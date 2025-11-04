# 🚀 Quick Start Guide - Auth0 Testing

## 1️⃣ Stop Running Backend

```powershell
Stop-Process -Id 12088 -Force
```

## 2️⃣ Start Backend

```powershell
cd MyApp
dotnet run
```

## 3️⃣ Start Frontend

```powershell
cd frontend\frontend
ng serve
```

## 4️⃣ Test in Browser

1. Go to `http://localhost:4200`
2. You'll be redirected to Auth0 login
3. Login with your test user
4. You'll see your profile in top-right corner
5. Try accessing Items and Clients pages

## ✅ What to Verify

- [x] Login redirects to Auth0
- [x] After login, redirected back to app
- [x] Profile picture and name shows in navbar
- [x] Can access Items page (authenticated)
- [x] Can access Clients page (authenticated)
- [x] Logout works correctly

## 🔐 Test Users

- **Admin**: Has all permissions (read, write, delete)
- **User**: Has read-only permissions

## ❌ Troubleshooting

If login fails: Check Auth0 Application → Allowed Callback URLs includes `http://localhost:4200`

If API returns 401: User might not have permission for that action

If backend won't start: Process still running, kill it first
