export interface Category {
  id: string;
  code: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  displayOrder?: number;
}
