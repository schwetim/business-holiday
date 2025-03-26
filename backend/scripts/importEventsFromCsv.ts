import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import csv from 'csv-parser';

const prisma = new PrismaClient();

// Type for CSV row data
interface EventCsvRow {
  externalId: string;
  name: string;
  description?: string;
  industry: string;
  country: string;
  city: string;
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

async function runImport() {
  // Only run in development mode
  if (process.env.NODE_ENV !== 'development') {
    console.log('ℹ️ Skipping CSV import — not in development mode.');
    return;
  }

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
