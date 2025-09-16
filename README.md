## MyApp - ASP.NET Core MVC Learning Project

This project is a comprehensive learning exercise for ASP.NET Core MVC, built with .NET 9. It demonstrates the core concepts of the MVC pattern, Entity Framework Core (Code-First and Database-First), CRUD operations, and different types of relationships between entities.

---

## Overview

This project is designed to help you learn and practice ASP.NET Core MVC development. It covers the full stack of a modern .NET web application, including:

- MVC architecture
- Razor views
- Entity Framework Core (EF Core)
- Code-First and Database-First approaches
- CRUD operations
- Entity relationships (One-to-One, One-to-Many, Many-to-Many)

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

- `Controllers/`: Contains controllers like `ItemsController` and `HomeController`.
- `Models/`: Contains data models (entities) such as `Item`, `Category`, `Client`, `SerialNumber`, and view models.
- `Data/`: Contains `MyAppContext`, the EF Core DbContext.
- `Migrations/`: Contains EF Core migration files for database schema changes.
- `Views/`: Contains Razor views for each controller and action.
- `wwwroot/`: Static files (CSS, JS, images, libraries).
- `appsettings.json`: Configuration, including database connection strings.

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

This project exposes several endpoints via its controllers. The main endpoints are provided by `ItemsController` and `HomeController`.

### ItemsController Endpoints

- `GET /Items` — List all items (Index view)
- `GET /Items/Create` — Show form to create a new item
- `POST /Items/Create` — Create a new item
- `GET /Items/Edit/{id}` — Show form to edit an item
- `POST /Items/Edit/{id}` — Update an item
- `GET /Items/Delete/{id}` — Show confirmation to delete an item
- `POST /Items/Delete/{id}` — Delete an item


All endpoints return HTML views by default, but you can adapt them for API-style responses if needed.

---

## How to Run the Project

1. **Clone the repository:**

   ```sh
   git clone https://github.com/mandinumaneth/MyApp-NET-MVC.git
   cd MyApp-NET-MVC
   ```

2. **Configure the database connection:**

   - Edit `MyApp/appsettings.json` if needed. By default, it uses SQL Server Express:
     ```json
     "ConnectionStrings": {
       "DefaultConnectionString": "Data Source=localhost\\SQLEXPRESS;Initial Catalog=myapp_database;Integrated Security=True;TrustServerCertificate=True;"
     }
     ```

3. **Apply migrations and create the database:**

   - Open a terminal in the `MyApp` directory and run:
     ```sh
     dotnet ef database update
     ```

4. **Run the application:**
   - In the `MyApp` directory, run:
     ```sh
     dotnet run
     ```
   - The app will start on `https://localhost:5001` or a similar port. Open it in your browser.

---

This project is a well-structured ASP.NET Core MVC application using .NET 9 and Entity Framework Core. It demonstrates the full MVC pattern, CRUD operations, Razor views, and all major types of entity relationships, making it a great learning resource for modern .NET web development.
