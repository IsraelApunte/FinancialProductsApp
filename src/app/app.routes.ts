import { Routes } from '@angular/router';
import { ProductListComponent } from './features/product-list/product-list.component';
import { ProductAddComponent } from './features/product-add/product-add.component';

export const routes: Routes = [
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: 'products', component: ProductListComponent },
    { path: 'products/add', component: ProductAddComponent },
];