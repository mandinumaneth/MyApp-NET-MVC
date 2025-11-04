# MyApp Angular Frontend Setup

## Prerequisites Completed ✅

- Node.js installed
- Angular CLI installed
- Tailwind CSS configured
- .NET Backend API created with CORS enabled
- PostgreSQL database configured

## Quick Start

### 1. Start the .NET Backend

```powershell
cd C:\Users\ASUS\Documents\GitHub\MyApp-NET-MVC\MyApp
dotnet run
```

The backend will run on `http://localhost:5114` and `https://localhost:7114`

### 2. Start the Angular Frontend

```powershell
cd C:\Users\ASUS\Documents\GitHub\MyApp-NET-MVC\frontend\frontend
ng serve
```

The frontend will run on `http://localhost:4200`

### 3. Open your browser

Navigate to `http://localhost:4200`

## Features Implemented

### Frontend (Angular + Tailwind CSS)

- ✅ Items List with responsive table
- ✅ Create Item form with validation
- ✅ Edit Item functionality
- ✅ Delete Item with confirmation
- ✅ Client Management page (add/delete clients)
- ✅ Category and Client selection dropdowns
- ✅ Beautiful Tailwind CSS styling
- ✅ Loading states and error handling
- ✅ Navigation bar with Items and Clients tabs
- ✅ Responsive design
- ✅ Price display in LKR currency

### Backend (.NET 9)

- ✅ API Controllers for Items, Categories, and Clients
- ✅ Full CRUD operations for Items and Clients
- ✅ CORS enabled for Angular frontend
- ✅ Full CRUD operations
- ✅ Entity relationships (One-to-One, One-to-Many, Many-to-Many)
- ✅ Auto-generated serial numbers
- ✅ PostgreSQL database with EF Core migrations
- ✅ Cascade deletion handling

## Project Structure

```
frontend/frontend/
├── src/
│   ├── app/
    │   ├── components/
    │   │   ├── items-list/        # Items list view
    │   │   ├── item-form/         # Create/Edit form
    │   │   └── client-management/ # Client management page
    │   ├── services/
    │   │   ├── item.service.ts    # Item API calls
    │   │   ├── category.service.ts
    │   │   └── client.service.ts   # Client API calls (full CRUD)
│   │   ├── models/
│   │   │   └── item.model.ts      # TypeScript interfaces
│   │   ├── app.routes.ts          # Routing configuration
│   │   └── app.config.ts          # HTTP Client config
│   └── styles.css                 # Tailwind CSS imports
└── tailwind.config.js             # Tailwind configuration
```

## API Endpoints

- GET `/api/ItemsApi` - Get all items
- GET `/api/ItemsApi/{id}` - Get item by ID
- POST `/api/ItemsApi` - Create new item
- PUT `/api/ItemsApi/{id}` - Update item
- DELETE `/api/ItemsApi/{id}` - Delete item

- GET `/api/CategoriesApi` - Get all categories
- GET `/api/ClientsApi` - Get all clients
- POST `/api/ClientsApi` - Create new client
- DELETE `/api/ClientsApi/{id}` - Delete client

## Troubleshooting

### CORS Issues

Make sure the .NET backend has CORS configured in `Program.cs`:

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

### SSL Certificate Issues

If you get SSL errors, the backend API URLs in services use `https://localhost:7114`. You can also use `http://localhost:5114` for HTTP. Make sure your .NET app is running.

### Database Connection

Ensure PostgreSQL is running and the connection string in `appsettings.json` is correct:

```json
"ConnectionStrings": {
  "DefaultConnectionString": "Host=localhost;Port=5432;Database=myapp_database;Username=postgres;Password=your_password"
}
```

Run migrations if needed:

```powershell
dotnet ef database update
```

## Next Steps

You can extend this application by:

- Adding authentication and authorization
- Implementing pagination for large datasets
- Adding search and filter functionality
- Creating dashboard with statistics
- Adding file upload for item images
- Implementing real-time updates with SignalR
- Adding unit and integration tests
- Exporting data to Excel/PDF
- Bulk operations for items and clients

## Technologies Used

- **Frontend**: Angular 20, TypeScript, Tailwind CSS, RxJS
- **Backend**: ASP.NET Core 9, Entity Framework Core 9.0.1, PostgreSQL
- **Database**: PostgreSQL with Npgsql provider
- **API**: RESTful Web API with JSON
