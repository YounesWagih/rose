import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/home/home.component').then(
        ({ HomeComponent }) => HomeComponent
      )
  },
  {
    path: 'category',
    loadComponent: () =>
      import('./features/category/category.component').then(
        ({ CategoryComponent }) => CategoryComponent
      )
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product-details/product-details.component').then(
        ({ ProductDetailsComponent }) => ProductDetailsComponent
      )
  },
  { path: '**', redirectTo: '' }
];
