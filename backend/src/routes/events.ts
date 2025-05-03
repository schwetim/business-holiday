import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get unique cities from events
router.get('/cities', async (req: Request, res: Response) => {
  try {
    const cities = await prisma.event.findMany({
      distinct: ['city'],
      select: {
        city: true
      },
      orderBy: {
        city: 'asc'
      }
    });
    res.json(cities.map((c: { city: string }) => c.city));
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// Get unique industries from events
router.get('/industries', async (req: Request, res: Response) => {
  try {
    const industries = await prisma.event.findMany({
      distinct: ['industry'],
      select: {
        industry: true
      },
      orderBy: {
        industry: 'asc'
      }
    });
    res.json(industries.map((i: { industry: string }) => i.industry));
  } catch (error) {
    console.error('Error fetching industries:', error);
    res.status(500).json({ error: 'Failed to fetch industries' });
  }
});

// Get industries with event counts
router.get('/industries-with-count', async (req: Request, res: Response) => {
  try {
    const industriesWithCount = await prisma.event.groupBy({
      by: ['industry'],
      _count: {
        industry: true,
      },
      orderBy: {
        industry: 'asc',
      },
    });

    // Format the result
    const formattedResult = industriesWithCount.map(item => ({
      name: item.industry,
      count: item._count.industry,
    }));

    res.json(formattedResult);
  } catch (error) {
    console.error('Error fetching industries with count:', error);
    res.status(500).json({ error: 'Failed to fetch industries with count' });
  }
});


// Get all categories
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get all tags
router.get('/tags', async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});


// Get filtered events
router.get('/', async (req: Request, res: Response) => {
  try {
    const { industry, region, startDate, endDate, destinationCity, categories, tags, keywords } = req.query;

    // Build the filter object
    const filter: any = {
      ...(industry && { industry: industry as string }),
      ...(region && { region: region as string }),
      ...(destinationCity && { city: destinationCity as string }),
      ...(startDate && { startDate: { gte: new Date(startDate as string) } }),
      ...(endDate && { endDate: { lte: new Date(endDate as string) } }),
      ...(keywords && {
        OR: [
          { name: { contains: keywords as string, mode: 'insensitive' } },
          { description: { contains: keywords as string, mode: 'insensitive' } },
        ]
      }),
    };

    // Add category filter if provided (expecting comma-separated IDs or names)
    if (categories) {
      const categoryNames = (categories as string).split(',').map(name => name.trim());
      filter.categories = {
        some: {
          name: {
            in: categoryNames
          }
        }
      };
    }

    // Add tag filter if provided (expecting comma-separated IDs or names)
    if (tags) {
      const tagNames = (tags as string).split(',').map(name => name.trim());
      filter.tags = {
        some: {
          name: {
            in: tagNames
          }
        }
      };
    }


    const events = await prisma.event.findMany({
      where: filter,
      include: { // Include categories and tags in the response
        categories: true,
        tags: true,
      }
    });

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get a single event by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const eventId = parseInt(id, 10); // Ensure ID is an integer
    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { // Include categories and tags in the response
        categories: true,
        tags: true,
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

export default router;
