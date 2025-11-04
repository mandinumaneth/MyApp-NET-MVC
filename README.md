## MyApp - ASP.NET Core MVC Learning Project

This is a **learning project** designed to understand and practice ASP.NET Core MVC concepts with .NET 9. It demonstrates the core concepts of the MVC pattern, Entity Framework Core (Code-First approach), CRUD operations, and different types of relationships between entities.

**Purpose:** Educational project for learning full-stack web development with .NET and Angular.

---

## Overview

This is a full-stack application combining ASP.NET Core MVC backend with an Angular frontend. It demonstrates modern web development practices including:

- **Backend**: ASP.NET Core MVC with .NET 9
- **Frontend**: Angular 20 with Tailwind CSS
- **Authentication**: Auth0 OAuth 2.0 / OpenID Connect
- MVC architecture & RESTful API design
- Entity Framework Core (EF Core) Code-First
- Full CRUD operations (Create, Read, Update, Delete)
- Entity relationships (One-to-One, One-to-Many, Many-to-Many)
- Role-Based Access Control (RBAC) with JWT
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

**🔒 All API endpoints are protected by JWT authentication.** Include a valid JWT token in the `Authorization` header as `Bearer <token>`.

### REST API Controllers

#### Items API (`/api/ItemsApi`)

- `GET /api/ItemsApi` — Get all items with related data (Category, SerialNumber, Clients) **[requires `read:items`]**
- `GET /api/ItemsApi/{id}` — Get a single item by ID **[requires `read:items`]**
- `POST /api/ItemsApi` — Create a new item **[requires `write:items`]**
  - Request body: `{ name, price, categoryId, clientId }`
  - Auto-generates serial number
- `PUT /api/ItemsApi/{id}` — Update an existing item **[requires `write:items`]**
- `DELETE /api/ItemsApi/{id}` — Delete an item **[requires `delete:items`]**

#### Categories API (`/api/CategoriesApi`)

- `GET /api/CategoriesApi` — Get all categories **[requires `read:items`]**
- `GET /api/CategoriesApi/{id}` — Get a single category by ID **[requires `read:items`]**

#### Clients API (`/api/ClientsApi`)

- `GET /api/ClientsApi` — Get all clients **[requires `read:clients`]**
- `GET /api/ClientsApi/{id}` — Get a single client by ID **[requires `read:clients`]**
- `POST /api/ClientsApi` — Create a new client **[requires `write:clients`]**
  - Request body: `{ name }`
- `DELETE /api/ClientsApi/{id}` — Delete a client **[requires `delete:clients`]**

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
- **Auth0** - Authentication and authorization platform
- **JWT Bearer Authentication** - Token-based security
- **Microsoft.AspNetCore.Authentication.JwtBearer 9.0.10** - JWT authentication middleware

### Frontend

- **Angular 20** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **RxJS** - Reactive programming library
- **HttpClient** - HTTP communication with backend API
- **@auth0/auth0-angular 2.2.3** - Auth0 SDK for Angular
- **Auth0 HTTP Interceptor** - Automatic JWT token attachment

### Features

- ✅ RESTful API with JSON responses
- ✅ CORS enabled for cross-origin requests
- ✅ JSON cycle handling for entity relationships
- ✅ Responsive design (mobile-friendly)
- ✅ Loading states and error handling
- ✅ Form validation
- ✅ Confirmation dialogs for destructive actions
- ✅ **OAuth 2.0 / OpenID Connect authentication**
- ✅ **Role-Based Access Control (RBAC)**
- ✅ **JWT token-based API security**
- ✅ **Protected routes and API endpoints**
- ✅ **User profile management**

---

## How to Run the Project

### Prerequisites

- .NET 9 SDK
- PostgreSQL (version 12 or higher)
- Node.js (v18 or higher)
- Angular CLI (`npm install -g @angular/cli`)
- **Auth0 Account** (free tier available at https://auth0.com)

### Setup Steps

1. **Clone the repository:**

   ```sh
   git clone https://github.com/mandinumaneth/MyApp-NET-MVC.git
   cd MyApp-NET-MVC
   ```

2. **Configure Auth0:**

   - Create a free Auth0 account at https://auth0.com
   - Create an Application (Single Page Application)
   - Create an API with identifier `https://myapp-api`
   - Enable RBAC and "Add Permissions in the Access Token"
   - Create permissions: `read:items`, `write:items`, `delete:items`, `read:clients`, `write:clients`, `delete:clients`
   - Create roles (Admin with all permissions, User with read-only)
   - Assign roles to test users

3. **Configure backend authentication:**

   - Edit `MyApp/appsettings.json` with your Auth0 credentials:
     ```json
     "Auth0": {
       "Domain": "your-tenant.us.auth0.com",
       "Audience": "https://myapp-api"
     }
     ```

4. **Configure frontend authentication:**

   - Edit `frontend/frontend/src/environments/environment.ts`:
     ```typescript
     export const environment = {
       auth0: {
         domain: "your-tenant.us.auth0.com",
         clientId: "your-client-id",
         authorizationParams: {
           audience: "https://myapp-api",
           redirect_uri: window.location.origin,
         },
         httpInterceptor: {
           allowedList: [
             "http://localhost:5114/api/*",
             "https://localhost:7114/api/*",
           ],
         },
       },
     };
     ```

5. **Configure the database connection:**

   - Edit `MyApp/appsettings.json` with your PostgreSQL credentials:
     ```json
     "ConnectionStrings": {
       "DefaultConnectionString": "Host=localhost;Port=5432;Database=myapp_database;Username=postgres;Password=your_password"
     }
     ```

6. **Apply migrations and create the database:**

   ```sh
   cd MyApp
   dotnet ef database update
   ```

7. **Run the backend:**

   ```powershell
   cd MyApp
   dotnet run
   ```

   - Backend runs on: `https://localhost:7114` and `http://localhost:5114`

8. **Install frontend dependencies:**

   ```powershell
   cd frontend\frontend
   npm install
   ```

9. **Run the Angular frontend:**

   ```powershell
   cd frontend\frontend
   ng serve --open
   ```

   - Frontend runs on: `http://localhost:4200`
   - Automatically opens in your default browser
   - You will be redirected to Auth0 login page

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

## Authentication & Authorization

This application implements **enterprise-grade authentication and authorization** using **Auth0** with OAuth 2.0 / OpenID Connect protocol.

### Architecture Overview

```
User → Angular App → Auth0 Login → JWT Token → API Requests → ASP.NET Core (validates JWT) → Database
```

### Key Features

✅ **OAuth 2.0 / OpenID Connect** - Industry-standard authentication protocol  
✅ **JWT (JSON Web Tokens)** - Secure, stateless token-based authentication  
✅ **RBAC (Role-Based Access Control)** - Granular permission management  
✅ **HTTP Interceptor** - Automatic token attachment to API requests  
✅ **Route Guards** - Frontend route protection  
✅ **Policy-Based Authorization** - Backend endpoint protection  
✅ **Token Refresh** - Automatic token renewal  
✅ **Secure Storage** - Tokens stored securely in memory (not localStorage)

### Permission Model

The application uses **6 granular permissions** for fine-grained access control:

| Permission       | Description         | Admin | User |
| ---------------- | ------------------- | ----- | ---- |
| `read:items`     | View items          | ✅    | ✅   |
| `write:items`    | Create/update items | ✅    | ❌   |
| `delete:items`   | Delete items        | ✅    | ❌   |
| `read:clients`   | View clients        | ✅    | ✅   |
| `write:clients`  | Create clients      | ✅    | ❌   |
| `delete:clients` | Delete clients      | ✅    | ❌   |

### Auth0 Configuration

**Backend (`MyApp/appsettings.json`):**

```json
{
  "Auth0": {
    "Domain": "dev-fdjyqqnyvd12ig7u.us.auth0.com",
    "Audience": "https://myapp-api"
  }
}
```

**Frontend (`frontend/frontend/src/environments/environment.ts`):**

```typescript
export const environment = {
  auth0: {
    domain: "dev-fdjyqqnyvd12ig7u.us.auth0.com",
    clientId: "CwYWpwjJ16FcrBiZqQ4nDABWYpMf4cZT",
    authorizationParams: {
      audience: "https://myapp-api",
      redirect_uri: window.location.origin,
    },
    httpInterceptor: {
      allowedList: [
        "http://localhost:5114/api/*",
        "https://localhost:7114/api/*",
      ],
    },
  },
};
```

### Authentication Flow

1. **User clicks "Log In"** → Redirected to Auth0 Universal Login page
2. **User enters credentials** → Auth0 validates credentials
3. **Auth0 issues JWT tokens** → Access token (for API) + ID token (user info)
4. **Angular stores tokens** → Secure in-memory storage
5. **HTTP Interceptor attaches token** → All API requests include `Authorization: Bearer <token>`
6. **Backend validates JWT** → Verifies signature, expiration, audience, issuer
7. **Policy checks permissions** → Ensures user has required permission in token claims
8. **API responds** → 200 OK (authorized) or 403 Forbidden (insufficient permissions)

### Testing Authentication

**Admin User (Full Access):**

- Can view, create, edit, and delete all items and clients
- Has all 6 permissions

**Regular User (Read-Only):**

- Can only view items and clients
- Has `read:items` and `read:clients` permissions
- Gets 403 Forbidden when attempting write/delete operations

**Test Endpoints:**

```bash
# Without token - Returns 401 Unauthorized
curl http://localhost:5114/api/ItemsApi

# With valid token - Returns data
curl http://localhost:5114/api/ItemsApi \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Debugging Authentication

Visit `/profile` route to see:

- User information (name, email, picture)
- Assigned permissions
- Assigned roles
- Decoded JWT access token (for debugging)

### Security Best Practices Implemented

✅ **HTTPS in production** - Secure communication  
✅ **Token expiration** - Short-lived access tokens (configurable in Auth0)  
✅ **Automatic token refresh** - Seamless user experience  
✅ **No tokens in localStorage** - Protection against XSS attacks  
✅ **CORS configured** - Only allows requests from trusted origins  
✅ **Audience validation** - Prevents token misuse across different APIs  
✅ **Permission claims in JWT** - No additional database lookups  
✅ **Policy-based authorization** - Declarative, maintainable security model

---

## Angular Frontend Architecture

### Components

#### ItemsListComponent

- Displays all items in a responsive table
- Shows Category, Serial Number, and associated Clients
- Edit and Delete buttons for each item
- Loading spinner and error handling
- Empty state when no items exist
- **Protected by authentication** - requires login

#### ItemFormComponent

- Reusable form for Create and Edit operations
- Dropdown selections for Category and Client
- Form validation with real-time feedback
- Auto-navigation after successful save
- **Requires write permissions**

#### AuthButtonComponent

- Displays login/logout button
- Shows user profile picture and name when authenticated
- Integrates with Auth0 authentication service

#### UserProfileComponent

- Displays logged-in user information
- Shows user permissions and roles
- Displays decoded JWT access token for debugging
- Located at `/profile` route

#### ClientManagementComponent

- Manage clients (add/delete)
- **Requires appropriate permissions for each action**

### Services

#### ItemService

- Handles all item-related API calls
- Methods: `getItems()`, `getItem(id)`, `createItem()`, `updateItem()`, `deleteItem()`

#### CategoryService

- Fetches categories for dropdown selection

#### ClientService

- Handles all client-related API calls
- Methods: `getClients()`, `getClient(id)`, `createClient()`, `deleteClient(id)`
- **All requests include JWT token automatically via HTTP interceptor**

### Guards

#### AuthGuard

- Protects all routes from unauthorized access
- Redirects unauthenticated users to Auth0 login page
- Applied to all routes: `/items`, `/items/create`, `/items/edit/:id`, `/clients`, `/profile`

### Routing

- `/items` - Items list (default route) **[protected by authGuard]**
- `/items/create` - Create new item **[protected by authGuard]**
- `/items/edit/:id` - Edit existing item **[protected by authGuard]**
- `/clients` - Client management page **[protected by authGuard]**
- `/profile` - User profile and token debugging **[protected by authGuard]**

### Styling

- **Tailwind CSS** for modern, utility-first styling
- Responsive design with mobile-first approach
- Custom color scheme with blue primary colors
- Smooth transitions and hover effects

---

## Backend API Configuration

### Authentication & Authorization

The backend uses **Auth0 JWT Bearer authentication** with policy-based authorization:

```csharp
// JWT Authentication with Auth0
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = $"https://{builder.Configuration["Auth0:Domain"]}/";
        options.Audience = builder.Configuration["Auth0:Audience"];
    });

// Permission-based Authorization Policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("read:items", policy => policy.RequireClaim("permissions", "read:items"));
    options.AddPolicy("write:items", policy => policy.RequireClaim("permissions", "write:items"));
    options.AddPolicy("delete:items", policy => policy.RequireClaim("permissions", "delete:items"));
    options.AddPolicy("read:clients", policy => policy.RequireClaim("permissions", "read:clients"));
    options.AddPolicy("write:clients", policy => policy.RequireClaim("permissions", "write:clients"));
    options.AddPolicy("delete:clients", policy => policy.RequireClaim("permissions", "delete:clients"));
});

// Apply authentication & authorization middleware
app.UseAuthentication();
app.UseAuthorization();
```

**Configuration in appsettings.json:**

```json
{
  "Auth0": {
    "Domain": "dev-fdjyqqnyvd12ig7u.us.auth0.com",
    "Audience": "https://myapp-api"
  }
}
```

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

- ✅ Authentication and Authorization (**Implemented with Auth0**)
- 🔲 User preferences database (store user settings)
- 🔲 Audit trail (log all user actions with timestamps)
- 🔲 Pagination for large datasets
- 🔲 Advanced search and filter functionality
- 🔲 Sorting capabilities
- 🔲 File upload for item images
- 🔲 Dashboard with statistics and charts
- 🔲 Excel import/export functionality
- 🔲 Unit and integration tests
- 🔲 Docker containerization
- 🔲 CI/CD pipeline

---

## Connecting to the .NET Backend

The Angular frontend connects to the ASP.NET Core backend via HTTP services with **Auth0 JWT authentication**:

1. **Backend API URLs** are configured in services:

   ```typescript
   private apiUrl = 'https://localhost:7114/api/ItemsApi';
   ```

2. **JWT tokens are automatically attached** to all API requests via `authHttpInterceptorFn`:

   ```typescript
   // app.config.ts
   provideHttpClient(withInterceptors([authHttpInterceptorFn]));

   // environment.ts
   httpInterceptor: {
     allowedList: [
       "http://localhost:5114/api/*",
       "https://localhost:7114/api/*",
     ];
   }
   ```

3. **CORS is enabled** in the backend to accept requests from `http://localhost:4200`

4. **HttpClient** is configured with Auth0 interceptor in `app.config.ts`:
   ```typescript
   providers: [
     provideHttpClient(withInterceptors([authHttpInterceptorFn])),
     provideAuth0(environment.auth0),
   ];
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
