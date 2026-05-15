interface GalleryItem {
  id?: string;
  caption: string;
  image: string;
  uploadedAt?: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5050' : '');

async function parseApiError(response: Response, fallback: string): Promise<Error> {
  try {
    const data = await response.json();
    return new Error(data?.error || fallback);
  } catch {
    return new Error(fallback);
  }
}

export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/gallery`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw await parseApiError(response, 'Failed to fetch');
    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch from API, using localStorage fallback:', error);
    return getLocalGallery();
  }
}

export async function saveGalleryItems(items: GalleryItem[]): Promise<GalleryItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/gallery`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    });
    if (!response.ok) throw await parseApiError(response, 'Failed to save');
    const saved = await response.json();
    // Also save to localStorage as backup
    localStorage.setItem('faisal-gallery-items', JSON.stringify(saved));
    return saved;
  } catch (error) {
    console.warn('Failed to save to API, using localStorage only:', error);
    localStorage.setItem('faisal-gallery-items', JSON.stringify(items));
    return items;
  }
}

export async function addGalleryItems(newItems: GalleryItem[]): Promise<GalleryItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItems),
    });
    if (!response.ok) throw await parseApiError(response, 'Failed to add');
    const saved = await response.json();
    // Also save to localStorage as backup
    localStorage.setItem('faisal-gallery-items', JSON.stringify(saved));
    return saved;
  } catch (error) {
    console.warn('Failed to add to API, using localStorage only:', error);
    const current = getLocalGallery();
    const updated = [...current, ...newItems];
    localStorage.setItem('faisal-gallery-items', JSON.stringify(updated));
    return updated;
  }
}

export async function deleteGalleryItem(itemId: string): Promise<GalleryItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/gallery/${itemId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw await parseApiError(response, 'Failed to delete');
    const saved = await response.json();
    // Also update localStorage as backup
    localStorage.setItem('faisal-gallery-items', JSON.stringify(saved));
    return saved;
  } catch (error) {
    console.warn('Failed to delete from API, using localStorage only:', error);
    const current = getLocalGallery();
    const updated = current.filter(item => item.id !== itemId);
    localStorage.setItem('faisal-gallery-items', JSON.stringify(updated));
    return updated;
  }
}

export async function updateGalleryItem(
  itemId: string,
  updates: Partial<GalleryItem>
): Promise<GalleryItem[]> {
  try {
    const current = await fetchGalleryItems();
    const updated = current.map((item) =>
      item.id === itemId
        ? {
            ...item,
            ...updates,
            uploadedAt: updates.uploadedAt || item.uploadedAt || new Date().toISOString(),
          }
        : item
    );

    const response = await fetch(`${API_BASE_URL}/api/gallery`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });

    if (!response.ok) throw await parseApiError(response, 'Failed to update');
    const saved = await response.json();
    localStorage.setItem('faisal-gallery-items', JSON.stringify(saved));
    return saved;
  } catch (error) {
    console.warn('Failed to update through API, using localStorage only:', error);
    const current = getLocalGallery();
    const updated = current.map((item) =>
      item.id === itemId
        ? {
            ...item,
            ...updates,
            uploadedAt: updates.uploadedAt || item.uploadedAt || new Date().toISOString(),
          }
        : item
    );
    localStorage.setItem('faisal-gallery-items', JSON.stringify(updated));
    return updated;
  }
}

function getLocalGallery(): GalleryItem[] {
  try {
    const saved = localStorage.getItem('faisal-gallery-items');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}
