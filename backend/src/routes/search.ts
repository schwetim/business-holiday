import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/search?q=query
router.get('/', async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid search query' });
  }

  const searchQuery = q.toLowerCase();

  try {
    // Search across events (name, description, location)
    const events = await prisma.event.findMany({
      where: {
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
          { city: { contains: searchQuery, mode: 'insensitive' } },
          { region: { contains: searchQuery, mode: 'insensitive' } },
          { country: { contains: searchQuery, mode: 'insensitive' } },
          { street: { contains: searchQuery, mode: 'insensitive' } },
        ],
      },
      include: {
        categories: true, // Include categories
        tags: true, // Include tags
      },
    });

    // Search across categories
    const categories = await prisma.category.findMany({
      where: {
        name: { contains: searchQuery, mode: 'insensitive' },
      },
    });

    // Search across tags
    const tags = await prisma.tag.findMany({
      where: {
        name: { contains: searchQuery, mode: 'insensitive' },
      },
    });

    const searchResults = {
      events,
      categories,
      tags,
    };

    res.json(searchResults);

  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
