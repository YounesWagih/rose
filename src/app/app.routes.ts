import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/home/components/home/home.component').then(
        ({ HomeComponent }) => HomeComponent,
      ),
  },
  {
    path: 'category',
    loadComponent: () =>
      import('./features/category/components/category/category.component').then(
        ({ CategoryComponent }) => CategoryComponent,
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/components/about/about.component').then(
        ({ AboutComponent }) => AboutComponent,
      ),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product-details/components/product-details/product-details.component').then(
        ({ ProductDetailsComponent }) => ProductDetailsComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
