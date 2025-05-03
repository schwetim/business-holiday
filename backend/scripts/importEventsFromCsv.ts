import fs from 'fs';
import path from 'path';
import { PrismaClient, Category, Tag } from '@prisma/client'; // Import Category and Tag
import csv from 'csv-parser';

const prisma = new PrismaClient();

// Type for CSV row data
interface EventCsvRow {
  externalId: string;
  name: string;
  description?: string;
  industry: string;
  // Add columns for categories and tags if they are included in the CSV
  // categories?: string; // e.g., comma-separated list of category names
  // tags?: string; // e.g., comma-separated list of tag names
  country: string;
  city: string;
  region: string;
  zipCode: string;
  street: string;
  streetNumber: string;
  location: string;
  latitude?: string;
  longitude?: string;
  startDate: string;
  endDate: string;
  websiteUrl?: string;
  ticketPrice?: string;
  imageFileName?: string;
}

// Validation function for required fields
function validateRow(row: EventCsvRow, rowIndex: number): boolean {
  const requiredFields = [
    'externalId',
    'name',
    'industry',
    'country',
    'city',
    'region',
    'zipCode',
    'street',
    'streetNumber',
    'location',
    'startDate',
    'endDate'
  ];

  for (const field of requiredFields) {
    if (!row[field as keyof EventCsvRow]) {
      console.error(`❌ Row ${rowIndex}: Missing required field "${field}"`);
      return false;
    }
  }

  // Validate dates
  try {
    new Date(row.startDate);
    new Date(row.endDate);
  } catch (e) {
    console.error(`❌ Row ${rowIndex}: Invalid date format`);
    return false;
  }

  return true;
}

async function ensureCategoriesAndTagsExist(categoryNames: string[], tagNames: string[]) {
  const createdCategories: Category[] = [];
  const createdTags: Tag[] = [];

  console.log('Ensuring categories exist...');
  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    createdCategories.push(category);
    process.stdout.write(`\rCategory "${name}" ensured.`);
  }
  console.log('\nEnsuring tags exist...');
  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    createdTags.push(tag);
    process.stdout.write(`\rTag "${name}" ensured.`);
  }
  console.log('\n');
  return { createdCategories, createdTags };
}

async function runImport() {
  // Only run in development mode
  if (process.env.NODE_ENV !== 'development') {
    console.log('ℹ️ Skipping CSV import — not in development mode.');
    return;
  }

  const commonCategories = ['Technology', 'Business', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Arts', 'Science'];
  const commonTags = ['Conference', 'Summit', 'Workshop', 'Exhibition', 'Networking', 'Innovation', 'Digital', 'Global'];

  // Ensure categories and tags exist in the database
  const { createdCategories, createdTags } = await ensureCategoriesAndTagsExist(commonCategories, commonTags);
  const categoryMap = new Map(createdCategories.map(c => [c.name.toLowerCase(), c]));
  const tagMap = new Map(createdTags.map(t => [t.name.toLowerCase(), t]));

  const csvPath = path.join(__dirname, '../import/events.csv');
  const results: EventCsvRow[] = [];
  let rowIndex = 0;
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  console.log('🚀 Starting development data import...');

  // Ensure CSV file exists
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found:', csvPath);
    return;
  }

  try {
    // Read and parse CSV
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data: EventCsvRow) => {
          rowIndex++;
          if (validateRow(data, rowIndex)) {
            results.push(data);
          } else {
            errorCount++;
          }
        })
        .on('end', () => resolve())
        .on('error', (error) => reject(error));
    });

    console.log(`📖 Read ${results.length} valid rows from CSV`);

    // Process each valid row
    for (const row of results) {
      try {
        // Construct image path if imageFileName exists
        const imagePath = row.imageFileName
          ? `/images/${row.externalId}/${row.imageFileName}`
          : null;

        // Simple logic to assign categories and tags based on industry or keywords
        // This is a placeholder; more sophisticated mapping might be needed
        const assignedCategories: Category[] = [];
        const assignedTags: Tag[] = [];

        // Example: Assign category based on industry
        const industryCategory = categoryMap.get(row.industry.toLowerCase());
        if (industryCategory) {
          assignedCategories.push(industryCategory);
        }

        // Example: Assign tags based on keywords in name/description
        // if (row.name.toLowerCase().includes('conference')) {
        //   const conferenceTag = tagMap.get('conference');
        //   if (conferenceTag) assignedTags.push(conferenceTag);
        // }
        // Add more logic here based on your CSV data or desired mapping

        // Check for existing event
        const existing = await prisma.event.findUnique({
          where: { externalId: row.externalId },
        });

        if (!existing) {
          // Create event in database
          await prisma.event.create({
            data: {
              externalId: row.externalId,
              name: row.name,
              description: row.description,
              industry: row.industry,
              country: row.country,
              city: row.city,
              region: row.region,
              zipCode: row.zipCode,
              street: row.street,
              streetNumber: row.streetNumber,
              location: row.location,
              latitude: row.latitude ? parseFloat(row.latitude) : null,
              longitude: row.longitude ? parseFloat(row.longitude) : null,
              startDate: new Date(row.startDate),
              endDate: new Date(row.endDate),
              websiteUrl: row.websiteUrl,
              ticketPrice: row.ticketPrice ? parseFloat(row.ticketPrice) : null,
              imagePath,
              categories: {
                connect: assignedCategories.map(c => ({ id: c.id })),
              },
              tags: {
                connect: assignedTags.map(t => ({ id: t.id })),
              },
              // If categories/tags were in CSV, parse and connect them here
              // categories: { connect: row.categories?.split(',').map(name => ({ name: name.trim() })) || [] },
            },
          });
          successCount++;
          process.stdout.write(`\r💾 Imported ${successCount} events...`);
        } else {
          skipCount++;
          console.log(`\nℹ️ Event with externalId ${row.externalId} already exists. Skipping.`);
        }
      } catch (error) {
        errorCount++;
        console.error(`\n❌ Error importing row with externalId ${row.externalId}:`, error);
      }
    }

    console.log('\n✅ Development data import complete!');
    console.log(`📊 Summary:
    - Total rows processed: ${rowIndex}
    - Successfully imported: ${successCount}
    - Skipped (already exist): ${skipCount}
    - Errors: ${errorCount}
    `);
  } catch (error) {
    console.error('❌ Fatal error during import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
runImport().catch((error) => {
  console.error('❌ Unhandled error:', error);
  prisma.$disconnect();
  process.exit(1);
});
