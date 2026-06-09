# 🏋️ IronForge Gym Website

A modern gym website with a responsive design and admin dashboard.

---

## 📁 What's Inside

- **frontend/** - Website and admin dashboard
- **backend/** - API server
- **ml-service/** - Machine learning service

---

## 🚀 How to View

### Open the Website
Simply open `frontend/index.html` in your web browser.

### Access Admin Dashboard
Open `frontend/admin.html` in your web browser.
GET  /health
```

## 📡 Backend API Endpoints
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me               (protected)

GET    /api/reviews
POST   /api/reviews               (user)
DELETE /api/reviews/:id           (admin)

POST   /api/enquiries
GET    /api/enquiries             (admin)
DELETE /api/enquiries/:id         (admin)

GET    /api/images
POST   /api/images                (admin, multipart)
DELETE /api/images/:id            (admin)

GET    /api/timings
PUT    /api/timings/:day          (admin)

GET    /api/admin/users           (admin)
DELETE /api/admin/users/:id       (admin)
```
