import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { CategoryService } from '../../services/category.service';
import { ClientService } from '../../services/client.service';
import { Item, ItemCreateDto, Category, Client } from '../../models/item.model';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {
  item: ItemCreateDto = {
    name: '',
    price: 0,
    categoryId: 0,
    clientId: 0
  };

  categories: Category[] = [];
  clients: Client[] = [];
  isEditMode = false;
  itemId: number | null = null;
  loading = false;
  error: string | null = null;
  submitting = false;

  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadClients();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.itemId = +params['id'];
        this.loadItem(this.itemId);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        this.error = 'Failed to load categories.';
        console.error('Error loading categories:', err);
      }
    });
  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (err) => {
        this.error = 'Failed to load clients.';
        console.error('Error loading clients:', err);
      }
    });
  }

  loadItem(id: number): void {
    this.loading = true;
    this.itemService.getItem(id).subscribe({
      next: (data) => {
        this.item = {
          name: data.name,
          price: data.price,
          categoryId: data.categoryId || 0,
          clientId: data.itemClients && data.itemClients.length > 0
            ? data.itemClients[0].clientId
            : 0
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load item.';
        this.loading = false;
        console.error('Error loading item:', err);
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.submitting = true;
    this.error = null;

    if (this.isEditMode && this.itemId) {
      this.itemService.updateItem(this.itemId, this.item).subscribe({
        next: () => {
          this.router.navigate(['/items']);
        },
        error: (err) => {
          this.error = 'Failed to update item.';
          this.submitting = false;
          console.error('Error updating item:', err);
        }
      });
    } else {
      this.itemService.createItem(this.item).subscribe({
        next: () => {
          this.router.navigate(['/items']);
        },
        error: (err) => {
          this.error = 'Failed to create item.';
          this.submitting = false;
          console.error('Error creating item:', err);
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.item.name || this.item.name.trim() === '') {
      this.error = 'Item name is required.';
      return false;
    }
    if (this.item.price <= 0) {
      this.error = 'Price must be greater than 0.';
      return false;
    }
    if (!this.item.categoryId || this.item.categoryId === 0) {
      this.error = 'Please select a category.';
      return false;
    }
    if (!this.item.clientId || this.item.clientId === 0) {
      this.error = 'Please select a client.';
      return false;
    }
    return true;
  }

  cancel(): void {
    this.router.navigate(['/items']);
  }
}
