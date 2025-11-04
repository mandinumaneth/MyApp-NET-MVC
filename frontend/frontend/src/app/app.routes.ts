import { Routes } from '@angular/router';
import { ItemsListComponent } from './components/items-list/items-list.component';
import { ItemFormComponent } from './components/item-form/item-form.component';
import { ClientManagementComponent } from './components/client-management/client-management.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/items', pathMatch: 'full' },
  { path: 'profile', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'items', component: ItemsListComponent, canActivate: [authGuard] },
  { path: 'items/create', component: ItemFormComponent, canActivate: [authGuard] },
  { path: 'items/edit/:id', component: ItemFormComponent, canActivate: [authGuard] },
  { path: 'clients', component: ClientManagementComponent, canActivate: [authGuard] }
];
