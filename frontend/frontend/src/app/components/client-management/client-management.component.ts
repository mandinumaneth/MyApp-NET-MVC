import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/item.model';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.css']
})
export class ClientManagementComponent implements OnInit {
  clients: Client[] = [];
  newClientName: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.errorMessage = 'Failed to load clients';
        this.isLoading = false;
      }
    });
  }

  addClient(): void {
    if (!this.newClientName.trim()) {
      this.errorMessage = 'Please enter a client name';
      return;
    }

    const newClient: Client = {
      id: 0,
      name: this.newClientName.trim()
    };

    this.clientService.createClient(newClient).subscribe({
      next: (client) => {
        this.clients.push(client);
        this.newClientName = '';
        this.successMessage = 'Client added successfully!';
        this.errorMessage = '';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error adding client:', error);
        this.errorMessage = 'Failed to add client';
      }
    });
  }

  deleteClient(id: number, name: string): void {
    if (!confirm(`Are you sure you want to delete client "${name}"?`)) {
      return;
    }

    this.clientService.deleteClient(id).subscribe({
      next: () => {
        this.clients = this.clients.filter(c => c.id !== id);
        this.successMessage = 'Client deleted successfully!';
        this.errorMessage = '';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error deleting client:', error);
        this.errorMessage = 'Failed to delete client';
      }
    });
  }
}
