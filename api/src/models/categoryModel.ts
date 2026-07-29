export type CategoryModel = {
  id: string;
  code: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  displayOrder: number;
};
