## MyApp - ASP.NET Core MVC Learning Project

This is a **learning project** designed to understand and practice ASP.NET Core MVC concepts with .NET 9. It demonstrates the core concepts of the MVC pattern, Entity Framework Core (Code-First approach), CRUD operations, and different types of relationships between entities.

**Purpose:** Educational project for learning full-stack web development with .NET and Angular.

---

## Overview

This is a full-stack application combining ASP.NET Core MVC backend with an Angular frontend. It demonstrates modern web development practices including:

- **Backend**: ASP.NET Core MVC with .NET 9
- **Frontend**: Angular 20 with Tailwind CSS
- MVC architecture & RESTful API design
- Entity Framework Core (EF Core) Code-First
- Full CRUD operations (Create, Read, Update, Delete)
- Entity relationships (One-to-One, One-to-Many, Many-to-Many)
- CORS configuration for API communication
- Responsive UI with Tailwind CSS

---

## What is MVC?

**MVC** stands for **Model-View-Controller**:

- **Model**: Represents the application's data and business logic (e.g., classes in `Models/` like `Item`, `Category`, `Client`).
- **View**: Handles the UI and presentation (e.g., `.cshtml` files in `Views/`).
- **Controller**: Manages user input, interacts with models, and selects views to render (e.g., `ItemsController`, `HomeController`).

---

## .NET 9 Setup

- The project targets **.NET 9** (`<TargetFramework>net9.0</TargetFramework>` in `MyApp.csproj`).
- Uses the latest ASP.NET Core and Entity Framework Core 8.0.7 packages.
- The entry point is `Program.cs`, which configures services, middleware, and routing.

---

## File Structure

### Backend (`MyApp/`)

- `Controllers/`:
  - MVC Controllers: `ItemsController`, `HomeController` (Razor views)
  - API Controllers: `ItemsApiController`, `CategoriesApiController`, `ClientsApiController` (REST API)
- `Models/`: Data models (entities) such as `Item`, `Category`, `Client`, `SerialNumber`, and view models
- `Data/`: `MyAppContext` - EF Core DbContext
- `Migrations/`: EF Core migration files for database schema changes
- `Views/`: Razor views for MVC controllers
- `wwwroot/`: Static files (CSS, JS, images, libraries)
- `appsettings.json`: Configuration, including database connection strings
- `Program.cs`: Application configuration with CORS and JSON serialization

### Frontend (`frontend/frontend/`)

- `src/app/components/`: Angular components
  - `items-list/`: Display all items in a table
  - `item-form/`: Create and edit items form
  - `client-management/`: Manage clients (add/delete)
- `src/app/services/`: HTTP services for API communication
  - `item.service.ts`: Item CRUD operations
  - `category.service.ts`: Category data
  - `client.service.ts`: Client CRUD operations
- `src/app/models/`: TypeScript interfaces matching backend models
- `tailwind.config.js`: Tailwind CSS configuration
- `src/styles.css`: Global styles with Tailwind directives

---

## MVC in Action

- **Routing**: Configured in `Program.cs` to use controller/action/id pattern, defaulting to `Items/Index`.
- **Controllers**: Handle HTTP requests, interact with the database via `MyAppContext`, and return views or other results.
- **Views**: Use Razor syntax to render dynamic HTML based on model data.

---

## IActionResult

- Controller actions return `IActionResult`, allowing flexibility:
  - `View()`: Returns a view.
  - `RedirectToAction()`: Redirects to another action.
  - `NotFound()`, `BadRequest()`, etc.: Return HTTP status codes.
- Example: `public async Task<IActionResult> DeleteConfirmed(int id)` in `ItemsController`.

---

## Action Parameters

- Action methods can accept parameters from the route, query string, or form data.
- Example: `Edit(int id)`, `Delete(int id)`, or model binding with `[FromForm]` or `[FromQuery]`.

---

## Razor Syntax

- Razor is a markup syntax for embedding C# in HTML.
- Used in `.cshtml` files for views.
- Example: `@model List<MyApp.Models.Item>`, `@foreach (var item in Model) { ... }`.

---

## Entity Framework Core Code-First

- Models are defined as C# classes.
- Migrations are used to create/update the database schema (`Migrations/` folder).
- Example: `MyAppContext` defines `DbSet<Item>`, `DbSet<Category>`, etc.
- Migrations like `Initial Migration`, `One to One`, `One to Many`, and `Many to Many` show schema evolution.

---

## Entity Framework Core Database-First

- While the project is primarily Code-First, EF Core also supports Database-First (scaffolding models from an existing database).
- You can use `Scaffold-DbContext` to generate models and context from a database.

---

## CRUD Overview

### Reading the Data

- Uses EF Core's LINQ queries to fetch data from the database.
- Example: `var items = await _context.Items.Include(i => i.Category).ToListAsync();`

### Creating the Data

- Uses model binding to receive form data and save new entities.
- Example: `await _context.Add(item); await _context.SaveChangesAsync();`

### Updating the Data

- Loads the entity, updates properties, and saves changes.
- Example: `var item = await _context.Items.FindAsync(id); item.Name = ...; await _context.SaveChangesAsync();`

### Deleting the Data

- Loads the entity and removes it from the context.
- Example: `var item = await _context.Items.FindAsync(id); _context.Items.Remove(item); await _context.SaveChangesAsync();`

---

## One to One Relationships

- Example: Each `Item` may have one `SerialNumber`.
- Configured in models and migrations.

---

## One to Many Relationships

- Example: Each `Category` can have many `Items`.
- Configured with navigation properties and foreign keys.

---

## Many to Many Relationships

- Example: `Item` and `Client` have a many-to-many relationship via `ItemClient` join entity.
- EF Core 5+ supports many-to-many without explicit join entity, but you used a join table for clarity.

---

## Summary

---

## API Endpoints

### REST API Controllers

#### Items API (`/api/ItemsApi`)

- `GET /api/ItemsApi` — Get all items with related data (Category, SerialNumber, Clients)
- `GET /api/ItemsApi/{id}` — Get a single item by ID
- `POST /api/ItemsApi` — Create a new item
  - Request body: `{ name, price, categoryId, clientId }`
  - Auto-generates serial number
- `PUT /api/ItemsApi/{id}` — Update an existing item
- `DELETE /api/ItemsApi/{id}` — Delete an item

#### Categories API (`/api/CategoriesApi`)

- `GET /api/CategoriesApi` — Get all categories
- `GET /api/CategoriesApi/{id}` — Get a single category by ID

#### Clients API (`/api/ClientsApi`)

- `GET /api/ClientsApi` — Get all clients
- `GET /api/ClientsApi/{id}` — Get a single client by ID
- `POST /api/ClientsApi` — Create a new client
  - Request body: `{ name }`
- `DELETE /api/ClientsApi/{id}` — Delete a client

### MVC Endpoints (Razor Views)

#### ItemsController

- `GET /Items` — List all items (Index view)
- `GET /Items/Create` — Show form to create a new item
- `POST /Items/Create` — Create a new item
- `GET /Items/Edit/{id}` — Show form to edit an item
- `POST /Items/Edit/{id}` — Update an item
- `GET /Items/Delete/{id}` — Show confirmation to delete an item
- `POST /Items/Delete/{id}` — Delete an item

---

## Technologies Used

### Backend

- **ASP.NET Core 9.0** - Web framework
- **Entity Framework Core 9.0.1** - ORM for database operations
- **PostgreSQL** - Database (migrated from SQL Server)
- **Npgsql 9.0.4** - PostgreSQL provider for EF Core
- **C# 12** - Programming language

### Frontend

- **Angular 20** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **RxJS** - Reactive programming library
- **HttpClient** - HTTP communication with backend API

### Features

- ✅ RESTful API with JSON responses
- ✅ CORS enabled for cross-origin requests
- ✅ JSON cycle handling for entity relationships
- ✅ Responsive design (mobile-friendly)
- ✅ Loading states and error handling
- ✅ Form validation
- ✅ Confirmation dialogs for destructive actions

---

## How to Run the Project

### Prerequisites

- .NET 9 SDK
- PostgreSQL (version 12 or higher)
- Node.js (v18 or higher)
- Angular CLI (`npm install -g @angular/cli`)

### Setup Steps

1. **Clone the repository:**

   ```sh
   git clone https://github.com/mandinumaneth/MyApp-NET-MVC.git
   cd MyApp-NET-MVC
   ```

2. **Configure the database connection:**

   - Edit `MyApp/appsettings.json` with your PostgreSQL credentials:
     ```json
     "ConnectionStrings": {
       "DefaultConnectionString": "Host=localhost;Port=5432;Database=myapp_database;Username=postgres;Password=your_password"
     }
     ```

3. **Apply migrations and create the database:**

   ```sh
   cd MyApp
   dotnet ef database update
   ```

4. **Run the backend:**

   ```powershell
   cd MyApp
   dotnet run
   ```

   - Backend runs on: `https://localhost:7114` and `http://localhost:5114`

5. **Install frontend dependencies:**

   ```powershell
   cd frontend\frontend
   npm install
   ```

6. **Run the Angular frontend:**

   ```powershell
   cd frontend\frontend
   ng serve --open
   ```

   - Frontend runs on: `http://localhost:4200`
   - Automatically opens in your default browser

### Quick Start Commands

**Terminal 1 - Backend:**

```powershell
cd C:\path\to\MyApp-NET-MVC\MyApp
dotnet run
```

**Terminal 2 - Frontend:**

```powershell
cd C:\path\to\MyApp-NET-MVC\frontend\frontend
ng serve --open
```

Access the application at `http://localhost:4200`

---

## Angular Frontend Architecture

### Components

#### ItemsListComponent

- Displays all items in a responsive table
- Shows Category, Serial Number, and associated Clients
- Edit and Delete buttons for each item
- Loading spinner and error handling
- Empty state when no items exist

#### ItemFormComponent

- Reusable form for Create and Edit operations
- Dropdown selections for Category and Client
- Form validation with real-time feedback
- Auto-navigation after successful save

### Services

#### ItemService

- Handles all item-related API calls
- Methods: `getItems()`, `getItem(id)`, `createItem()`, `updateItem()`, `deleteItem()`

#### CategoryService

- Fetches categories for dropdown selection

#### ClientService

- Handles all client-related API calls
- Methods: `getClients()`, `getClient(id)`, `createClient()`, `deleteClient(id)`

### Routing

- `/items` - Items list (default route)
- `/items/create` - Create new item
- `/items/edit/:id` - Edit existing item
- `/clients` - Client management page

### Styling

- **Tailwind CSS** for modern, utility-first styling
- Responsive design with mobile-first approach
- Custom color scheme with blue primary colors
- Smooth transitions and hover effects

---

## Backend API Configuration

### CORS Setup

The backend is configured to accept requests from the Angular frontend:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

app.UseCors("AllowAngular");
```

### JSON Serialization

Configured to handle circular references in entity relationships:

```csharp
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });
```

---

## Troubleshooting

### Backend Issues

**Port already in use:**

```powershell
# Stop all dotnet processes
Get-Process | Where-Object {$_.ProcessName -eq 'dotnet'} | Stop-Process -Force
```

**Database connection errors:**

- Verify PostgreSQL is running (check services or run `pg_isready`)
- Check connection string in `appsettings.json`
- Ensure PostgreSQL user has necessary permissions
- Run `dotnet ef database update` to apply migrations

### Frontend Issues

**Port 4200 already in use:**

```powershell
# Use a different port
ng serve --port 4201
```

**API CORS errors:**

- Ensure backend is running
- Verify CORS policy includes `http://localhost:4200`
- Check browser console for detailed error messages

**Module not found:**

```powershell
# Reinstall dependencies
cd frontend\frontend
npm install
```

---

## Project Features

### Implemented Features

- ✅ Full CRUD operations for Items
- ✅ Full CRUD operations for Clients (add/delete)
- ✅ Category management
- ✅ Client selection when creating/editing items
- ✅ Auto-generated serial numbers (CategoryName + ItemID)
- ✅ One-to-One relationship (Item ↔ SerialNumber)
- ✅ One-to-Many relationship (Category ↔ Items)
- ✅ Many-to-Many relationship (Items ↔ Clients via ItemClient)
- ✅ RESTful API with JSON responses
- ✅ Angular frontend with Tailwind CSS
- ✅ Responsive UI design
- ✅ Form validation
- ✅ Error handling and user feedback
- ✅ Loading states
- ✅ Price display in LKR (Sri Lankan Rupees)
- ✅ PostgreSQL database with migrations

### Future Enhancements

- 🔲 Authentication and Authorization
- 🔲 Pagination for large datasets
- 🔲 Search and filter functionality
- 🔲 Sorting capabilities
- 🔲 File upload for item images
- 🔲 Dashboard with statistics
- 🔲 Unit and integration tests
- 🔲 Docker containerization
- 🔲 CI/CD pipeline

---

## Connecting to the .NET Backend

The Angular frontend connects to the ASP.NET Core backend via HTTP services:

1. **Backend API URLs** are configured in services:

   ```typescript
   private apiUrl = 'https://localhost:7114/api/ItemsApi';
   ```

2. **CORS is enabled** in the backend to accept requests from `http://localhost:4200`

3. **HttpClient** is configured in `app.config.ts`:
   ```typescript
   providers: [provideHttpClient()];
   ```

### Optional: Proxy Configuration

Create `proxy.conf.json` in the Angular project root:

```json
{
  "/api": {
    "target": "https://localhost:7114",
    "secure": false,
    "changeOrigin": true
  }
}
```

Run with proxy:

```powershell
ng serve --proxy-config proxy.conf.json
```

---

## Project Summary

This is a modern full-stack web application demonstrating:

### Backend Architecture

- **ASP.NET Core MVC** for traditional server-rendered views
- **RESTful Web API** for modern SPA communication
- **Entity Framework Core** with Code-First migrations
- **PostgreSQL** database with complex relationships
- **JSON serialization** with cycle handling
- **CORS configuration** for cross-origin API access

### Frontend Architecture

- **Angular 20** with standalone components
- **Tailwind CSS** for modern, responsive UI
- **TypeScript** for type-safe development
- **RxJS** for reactive data handling
- **HttpClient** for API communication
- **Angular Router** for SPA navigation

### Learning Outcomes

This project demonstrates:

- Full-stack development with .NET and Angular
- RESTful API design and implementation
- Entity relationships and database design
- CRUD operations in both MVC and API patterns
- Modern frontend development with Angular
- Responsive UI design with Tailwind CSS
- Cross-origin resource sharing (CORS)
- JSON serialization challenges and solutions
- PostgreSQL database integration with Entity Framework Core
- Migration management and database versioning

---

