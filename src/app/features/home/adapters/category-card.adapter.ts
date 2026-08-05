import { Category } from '../../category/models/category.model';

const LOCAL_CATEGORY_ICON_SLUGS = new Set([
  'cakes',
  'candles-and-diffusers',
  'cards',
  'chocolate',
  'flowers',
  'gifts',
  'jewellery',
  'perfumes',
  'watches',
]);

export interface CategoryCard {
  _id: string;
  name: string;
  productsCount: number;
  icon: string;
}

export function adaptCategoryToCard(category: Category): CategoryCard {
  const hasLocalIcon = LOCAL_CATEGORY_ICON_SLUGS.has(category.slug);

  return {
    _id: category._id,
    name: category.name,
    productsCount: category.productsCount,
    icon: hasLocalIcon
      ? `assets/category/new_icons/${category.slug}.svg`
      : category.image,
  };
}
