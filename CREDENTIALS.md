# Hospital Admin Portal — User Credentials

> ⚠️ **Change all passwords immediately after first login in production.**

---

## Access URLs

| Service | URL |
|---|---|
| Patient Website | http://localhost:3000 |
| Admin Portal | http://localhost:3001 |
| API Health | http://localhost:3001/api/health |

---

## Admin Portal Accounts

### 🔴 Admin
Full access — user management, all CRUD, all views.

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `Admin@123` |
| Role | `admin` |

**Permissions:**
- ✅ Dashboard & Stats
- ✅ View / Cancel Appointments
- ✅ Add / Edit / Delete Doctors
- ✅ Add / Edit / Delete Departments
- ✅ View Patients
- ✅ Create / Edit / Delete / Disable Users

---

### 🟣 Manager
Operational management — no user administration.

| Field | Value |
|---|---|
| Username | `manager1` |
| Password | `Admin@123` |
| Role | `manager` |

**Permissions:**
- ✅ Dashboard & Stats
- ✅ View / Cancel Appointments
- ✅ Add / Edit / Delete Doctors
- ✅ Add / Edit / Delete Departments
- ✅ View Patients
- ❌ User Management

---

### 🟡 Staff
Read-only access — reception / front-desk use.

| Field | Value |
|---|---|
| Username | `staff1` |
| Password | `Admin@123` |
| Role | `staff` |

**Permissions:**
- ✅ Dashboard & Stats
- ✅ View Appointments (read-only)
- ✅ View Doctors (read-only)
- ✅ View Departments (read-only)
- ✅ View Patients
- ❌ Cancel Appointments
- ❌ Add / Edit / Delete Doctors or Departments
- ❌ User Management

---

## Security Notes

- Sessions expire after **8 hours** (JWT expiry)
- Auto-logout after **30 minutes** of inactivity
- Login is rate-limited to **10 attempts per 15 minutes** per IP
- Accounts can be disabled by an Admin without deletion
- Password minimum length: **8 characters**

---

## Creating New Users

Log in as `admin` → navigate to **Users** → click **+ Add User** → select role.

| Role | Use for |
|---|---|
| `admin` | IT administrators, system owners |
| `manager` | Ward managers, department heads |
| `staff` | Reception, front-desk, nursing staff |
