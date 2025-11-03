import { Routes } from '@angular/router';
import { ItemsListComponent } from './components/items-list/items-list.component';
import { ItemFormComponent } from './components/item-form/item-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/items', pathMatch: 'full' },
  { path: 'items', component: ItemsListComponent },
  { path: 'items/create', component: ItemFormComponent },
  { path: 'items/edit/:id', component: ItemFormComponent }
];
