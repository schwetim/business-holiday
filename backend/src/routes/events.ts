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

// Get filtered events
router.get('/', async (req: Request, res: Response) => {
  try {
    const { industry, region, startDate, endDate, destinationCity } = req.query;
    
    if (!industry) {
      return res.status(400).json({ error: 'Industry parameter is required' });
    }

    const events = await prisma.event.findMany({
      where: {
        industry: industry as string,
        ...(region && { region: region as string }),
        ...(destinationCity && { city: destinationCity as string }),
        ...(startDate && { startDate: { gte: new Date(startDate as string) } }),
        ...(endDate && { endDate: { lte: new Date(endDate as string) } })
      }
    });

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

export default router;
