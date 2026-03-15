# Hospital Management & Appointment Booking System

A full-stack hospital website with an online appointment booking portal for patients and a role-based admin dashboard for hospital staff. Built with React 19, Node.js/Express, and MySQL.

## Architecture

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Patient     │   │    Admin     │   │   Backend    │   │    MySQL     │
│   Portal      │   │   Portal    │   │    API       │   │   Database   │
│  (React/Vite) │   │ (React/Vite)│   │  (Express)   │   │              │
│  :3000 / 5173 │──▶│ :3001 / 5174│──▶│    :5000     │──▶│    :3306     │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

## Tech Stack

| Layer     | Technology                                              |
|-----------|---------------------------------------------------------|
| Frontend  | React 19, Vite, React Router DOM, React Hook Form, CSS  |
| Admin     | React 19, Vite, JWT auth, RBAC                          |
| Backend   | Node.js, Express, express-validator, Helmet, JWT        |
| Database  | MySQL 8.0 with connection pooling (mysql2)              |
| Deploy    | Docker, Docker Compose, Nginx reverse proxy             |

## Project Structure

```
├── src/                    # Patient portal
│   ├── components/         # UI components (about, appointment, common, home, services)
│   ├── pages/              # HomePage, ServicesPage, AboutPage, ContactPage, AppointmentPage
│   ├── context/            # AppointmentContext, ToastContext
│   ├── hooks/              # useResponsive, useRetry
│   ├── styles/             # CSS variables and global styles
│   └── App.jsx             # Routes and providers
├── admin/                  # Admin portal
│   ├── src/
│   │   ├── pages/          # Dashboard, Appointments, Doctors, Departments, Patients, Users, Login
│   │   ├── context/        # AuthContext (JWT + idle timeout)
│   │   ├── permissions.js  # Role-based access rules
│   │   └── api.js          # API client with token handling
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                # REST API
│   ├── routes/             # departments, doctors, slots, appointments, admin, adminData
│   ├── middleware/         # JWT auth, role checks, error handling
│   ├── schema.sql          # Database schema + seed data
│   ├── db.js               # MySQL connection pool
│   ├── server.js           # Express app setup
│   └── Dockerfile
├── docker-compose.yml      # Multi-container orchestration
├── nginx.conf              # Frontend Nginx config
└── .env.example            # Environment variable template
```

## Features

### Patient Portal
- Browse hospital departments and doctors
- Book appointments with a multi-step form (department → doctor → date/time → patient info)
- View available time slots for the next 30 days
- Cancel appointments
- Responsive design (mobile, tablet, desktop)
- Toast notifications, error boundaries, lazy-loaded pages

### Admin Portal
- Dashboard with live statistics
- Appointment management with filters (status, doctor, department, date)
- Doctor and department CRUD
- Patient directory with appointment counts
- User management (admin only)
- 30-minute idle auto-logout

### Role-Based Access Control

| Capability          | Admin | Manager | Staff |
|---------------------|:-----:|:-------:|:-----:|
| View dashboard      |  ✅   |   ✅    |  ✅   |
| View appointments   |  ✅   |   ✅    |  ✅   |
| Cancel appointments |  ✅   |   ✅    |  ❌   |
| Manage doctors      |  ✅   |   ✅    |  ❌   |
| Manage departments  |  ✅   |   ✅    |  ❌   |
| View patients       |  ✅   |   ✅    |  ✅   |
| Manage users        |  ✅   |   ❌    |  ❌   |

## Getting Started

### Prerequisites

- Node.js 20+
- MySQL 8.0 (or Docker)

### Local Development

```bash
# 1. Install dependencies
npm install
cd backend && npm install
cd ../admin && npm install
cd ..

# 2. Configure environment
cp .env.example .env
cp backend/.env.example backend/.env
# Edit both .env files with your MySQL credentials

# 3. Set up the database
# Import the schema into MySQL:
mysql -u root -p < backend/schema.sql

# 4. Start the backend (port 5000)
cd backend && npm run dev

# 5. Start the patient portal (port 5173)
npm run dev

# 6. Start the admin portal (port 5174)
cd admin && npm run dev
```

### Docker (Production)

```bash
# Create .env at project root with required variables:
# DB_ROOT_PASSWORD, DB_USER, DB_PASSWORD, JWT_SECRET

docker-compose up -d
```

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:3000   |
| Admin    | http://localhost:3001   |
| API      | http://localhost:5000   |

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (backend/.env)
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hospital_db
PORT=5000
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
JWT_SECRET=change_this_in_production
```

### Docker Compose (.env)
```
DB_ROOT_PASSWORD=root_password
DB_USER=hospital_user
DB_PASSWORD=hospital_password
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

## API Endpoints

### Public

| Method  | Endpoint                          | Description                |
|---------|-----------------------------------|----------------------------|
| GET     | `/api/departments`                | List departments           |
| GET     | `/api/departments/:id`            | Department details         |
| GET     | `/api/doctors`                    | List doctors               |
| GET     | `/api/doctors/:id`                | Doctor details             |
| GET     | `/api/slots?doctorId=&date=`      | Available time slots       |
| POST    | `/api/appointments`               | Book an appointment        |
| GET     | `/api/appointments/:id`           | Appointment details        |
| PATCH   | `/api/appointments/:id/cancel`    | Cancel an appointment      |
| GET     | `/api/health`                     | Health check               |

### Admin (JWT required)

| Method  | Endpoint                              | Min Role  |
|---------|---------------------------------------|-----------|
| POST    | `/api/admin/login`                    | —         |
| GET     | `/api/admin/stats`                    | staff     |
| GET     | `/api/admin/appointments`             | staff     |
| PATCH   | `/api/admin/appointments/:id/cancel`  | manager   |
| GET     | `/api/admin/patients`                 | staff     |
| POST    | `/api/admin/doctors`                  | manager   |
| PUT     | `/api/admin/doctors/:id`              | manager   |
| DELETE  | `/api/admin/doctors/:id`              | manager   |
| POST    | `/api/admin/departments`              | manager   |
| PUT     | `/api/admin/departments/:id`          | manager   |
| DELETE  | `/api/admin/departments/:id`          | manager   |
| GET     | `/api/admin/users`                    | admin     |
| POST    | `/api/admin/users`                    | admin     |
| PUT     | `/api/admin/users/:id`               | admin     |
| DELETE  | `/api/admin/users/:id`               | admin     |

## Database Schema

Six tables with foreign key relationships:

- `departments` — Hospital departments with operating hours
- `doctors` — Doctor profiles linked to departments
- `slots` — Auto-generated appointment time slots (30-day window)
- `patients` — Patient contact information (upserted on booking)
- `appointments` — Bookings linking slots, doctors, departments, and patients
- `admin_users` — Admin portal users with roles (admin, manager, staff)

Seed data includes 6 departments, 12 doctors, and 3 admin users.

## Default Admin Credentials

| Username   | Password    | Role    |
|------------|-------------|---------|
| admin      | Admin@123   | admin   |
| manager1   | Admin@123   | manager |
| staff1     | Admin@123   | staff   |

> ⚠️ Change all default passwords before deploying to production.

## Security

- JWT authentication with HS256 (8-hour expiry)
- Password hashing with bcryptjs (12 rounds)
- Login rate limiting: 10 attempts per 15 minutes per IP
- API rate limiting: 150 requests per 15 minutes
- Timing-attack prevention on login
- Helmet security headers (CSP, HSTS, X-Frame-Options, etc.)
- CORS origin whitelist
- Request body size limit (50KB)
- Real-time account status verification on every admin request
- 30-minute idle session timeout
- Database not exposed to host in Docker (internal network only)
- Nginx hides server tokens, blocks hidden files

## Production Checklist

- [ ] Set a strong `JWT_SECRET`
- [ ] Change all default admin passwords
- [ ] Set `NODE_ENV=production`
- [ ] Use strong database passwords
- [ ] Configure HTTPS in Nginx
- [ ] Update CORS origins to match your domain
- [ ] Set up database backups
- [ ] Review and tighten CSP headers for your domain
