# 🔧 Auth0 Configuration Fix Guide

## ❌ Problem

Getting **401 Unauthorized** errors because:

1. Auth0 HTTP interceptor wasn't properly attached (FIXED ✅)
2. Auth0 API permissions might not be properly configured in your access token

## ✅ What I Fixed in Code

1. **Added `authHttpInterceptorFn`** to `app.config.ts` - This attaches JWT tokens to API calls
2. **Created User Profile debugging page** - Navigate to `/profile` after login to see your token claims

---

## 🔐 Auth0 Dashboard Configuration Steps

### Step 1: Configure API Permissions to Include in Access Token

1. **Go to Auth0 Dashboard** → **Applications** → **APIs** → **MyApp Backend API**

2. **Click on "Settings" tab**

3. **Enable RBAC Settings**:

   - ✅ **Enable RBAC**: Turn this ON
   - ✅ **Add Permissions in the Access Token**: Turn this ON

   This ensures permissions are included in the access token sent to your API.

4. **Click "Save"**

### Step 2: Verify API Permissions Are Defined

1. **Stay in** **APIs** → **MyApp Backend API** → **Permissions** tab

2. **Verify these 6 permissions exist**:

   ```
   read:items - Read items
   write:items - Create and update items
   delete:items - Delete items
   read:clients - Read clients
   write:clients - Create and update clients
   delete:clients - Delete clients
   ```

3. If missing, click "Add Permission" and create them

### Step 3: Assign Permissions to Roles

1. **Go to** **User Management** → **Roles**

2. **Click on "Admin" role** → **Permissions** tab → **Add Permissions**

   - Select **MyApp Backend API**
   - Check **ALL 6 permissions**:
     - ✅ read:items
     - ✅ write:items
     - ✅ delete:items
     - ✅ read:clients
     - ✅ write:clients
     - ✅ delete:clients
   - Click **Add Permissions**

3. **Click on "User" role** → **Permissions** tab → **Add Permissions**
   - Select **MyApp Backend API**
   - Check **ONLY these 2 permissions**:
     - ✅ read:items
     - ✅ read:clients
   - Click **Add Permissions**

### Step 4: Assign Roles to Test Users

1. **Go to** **User Management** → **Users**

2. **Click on your Admin test user** → **Roles** tab → **Assign Roles**

   - Select **Admin** role
   - Click **Assign**

3. **Click on your regular test user** → **Roles** tab → **Assign Roles**
   - Select **User** role
   - Click **Assign**

### Step 5: Configure Application Callback URLs

1. **Go to** **Applications** → **Applications** → **Your Angular SPA**

2. **Scroll to "Application URIs" section**

3. **Add these URLs** (comma-separated):

   - **Allowed Callback URLs**: `http://localhost:4200`
   - **Allowed Logout URLs**: `http://localhost:4200`
   - **Allowed Web Origins**: `http://localhost:4200`
   - **Allowed Origins (CORS)**: `http://localhost:4200`

4. **Click "Save Changes"**

---

## 🧪 Testing After Configuration

### 1. Clear Browser Cache & Auth0 Session

```bash
# In browser console (F12):
localStorage.clear();
sessionStorage.clear();
# Then refresh page
```

### 2. Restart Angular Frontend

```powershell
# Stop current server (Ctrl+C)
cd frontend\frontend
ng serve
```

### 3. Test Login Flow

1. **Open** `http://localhost:4200`
2. **You'll be redirected to Auth0 login**
3. **Login with Admin user**
4. **After redirect, navigate to** `http://localhost:4200/profile`
5. **Click "Show Access Token (for API calls)"**
6. **Verify the decoded token shows**:
   ```json
   {
     "permissions": [
       "read:items",
       "write:items",
       "delete:items",
       "read:clients",
       "write:clients",
       "delete:clients"
     ],
     ...
   }
   ```

### 4. Test API Calls

**Admin User Should Be Able To:**

- ✅ View Items page (GET /api/ItemsApi)
- ✅ Create new item (POST /api/ItemsApi)
- ✅ Delete item (DELETE /api/ItemsApi/{id})
- ✅ View Clients page (GET /api/ClientsApi)
- ✅ Add new client (POST /api/ClientsApi)
- ✅ Delete client (DELETE /api/ClientsApi/{id})

**Regular User Should Be Able To:**

- ✅ View Items page (GET /api/ItemsApi)
- ✅ View Clients page (GET /api/ClientsApi)

**Regular User Should NOT Be Able To:**

- ❌ Create new item (403 Forbidden)
- ❌ Delete item (403 Forbidden)
- ❌ Add new client (403 Forbidden)
- ❌ Delete client (403 Forbidden)

---

## 🐛 Troubleshooting

### Still Getting 401 Errors?

**Check 1: Is RBAC enabled?**

- Go to APIs → MyApp Backend API → Settings
- "Enable RBAC" should be ON
- "Add Permissions in the Access Token" should be ON

**Check 2: Are permissions in the access token?**

- Login → Navigate to `/profile`
- Click "Show Access Token"
- Look for "permissions" array in decoded token
- If missing, repeat Step 1 above

**Check 3: Is the audience correct?**

- Your Angular app should request audience: `https://myapp-api`
- Check `environment.ts` → `audience: 'https://myapp-api'`
- This MUST match the API Identifier in Auth0 dashboard

**Check 4: Are users assigned to roles?**

- Go to User Management → Users
- Click on user → Roles tab
- Should show either "Admin" or "User" role

### Getting 403 Forbidden (not 401)?

✅ **This is correct!** It means:

- Authentication is working (you're logged in)
- But you don't have permission for that action
- Example: Regular User trying to delete an item

---

## 📊 Role-Based Access Summary

| Action          | API Endpoint         | Method | Admin | User |
| --------------- | -------------------- | ------ | ----- | ---- |
| View items      | /api/ItemsApi        | GET    | ✅    | ✅   |
| Create item     | /api/ItemsApi        | POST   | ✅    | ❌   |
| Update item     | /api/ItemsApi/{id}   | PUT    | ✅    | ❌   |
| Delete item     | /api/ItemsApi/{id}   | DELETE | ✅    | ❌   |
| View clients    | /api/ClientsApi      | GET    | ✅    | ✅   |
| Create client   | /api/ClientsApi      | POST   | ✅    | ❌   |
| Delete client   | /api/ClientsApi/{id} | DELETE | ✅    | ❌   |
| View categories | /api/CategoriesApi   | GET    | ✅    | ✅   |

---

## ✅ Verification Checklist

After completing all steps above, verify:

- [ ] RBAC is enabled in Auth0 API settings
- [ ] "Add Permissions in the Access Token" is enabled
- [ ] All 6 permissions are defined in API
- [ ] Admin role has all 6 permissions
- [ ] User role has only 2 read permissions
- [ ] Test users are assigned to roles
- [ ] Application callback URLs are configured
- [ ] Angular app is restarted
- [ ] Browser cache is cleared
- [ ] Can login successfully
- [ ] Profile page shows permissions in access token
- [ ] Admin can perform all actions
- [ ] User can only read (gets 403 for write/delete)

---

## 🎯 Next Steps After Auth0 Works

Once authentication is working correctly:

1. **Implement Audit Trail** - Log all user actions
2. **Add Search & Pagination** - Advanced filtering
3. **Excel Import/Export** - Bulk operations
4. **Analytics Dashboard** - Reporting and charts

Each feature makes your project more enterprise-ready for Accenture interviews! 🚀
