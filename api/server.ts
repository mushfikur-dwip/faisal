import express, { Request, Response } from 'express';
import cors from 'cors';
import { readGallery, addGalleryItems, updateGalleryItems, deleteGalleryItem } from './gallery';

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// GET all gallery items
app.get('/api/gallery', (_req: Request, res: Response) => {
  try {
    readGallery()
      .then((items) => res.json(items))
      .catch(() => res.status(500).json({ error: 'Failed to fetch gallery items' }));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
});

// POST new gallery items
app.post('/api/gallery', (req: Request, res: Response) => {
  try {
    const newItems = req.body;
    if (!Array.isArray(newItems)) {
      return res.status(400).json({ error: 'Body must be an array' });
    }
    addGalleryItems(newItems)
      .then((updated) => res.json(updated))
      .catch(() => res.status(500).json({ error: 'Failed to add gallery items' }));
  } catch (error) {
    res.status(500).json({ error: 'Failed to add gallery items' });
  }
});

// PUT update all gallery items
app.put('/api/gallery', (req: Request, res: Response) => {
  try {
    const items = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Body must be an array' });
    }
    updateGalleryItems(items)
      .then((updated) => res.json(updated))
      .catch(() => res.status(500).json({ error: 'Failed to update gallery items' }));
  } catch (error) {
    res.status(500).json({ error: 'Failed to update gallery items' });
  }
});

// DELETE a specific gallery item
app.delete('/api/gallery/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    deleteGalleryItem(id)
      .then((updated) => res.json(updated))
      .catch(() => res.status(500).json({ error: 'Failed to delete gallery item' }));
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Gallery API server running on port ${PORT}`);
  });
}

export default app;
