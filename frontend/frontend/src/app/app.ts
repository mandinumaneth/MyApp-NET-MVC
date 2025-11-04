import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthButtonComponent } from './components/auth-button/auth-button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, AuthButtonComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'MyApp - Inventory Management';
}
