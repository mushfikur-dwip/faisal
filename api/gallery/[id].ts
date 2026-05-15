import { deleteGalleryItem } from '../gallery';

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'DELETE') {
      res.setHeader('Allow', 'DELETE');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;
    const itemId = Array.isArray(id) ? id[0] : id;
    if (!itemId) {
      return res.status(400).json({ error: 'Missing gallery item id' });
    }

    const updated = await deleteGalleryItem(itemId);
    return res.status(200).json(updated);
  } catch (error) {
    console.error('Gallery delete API failed:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete gallery item';
    return res.status(500).json({ error: message });
  }
}
