# 🏢 Employee Management System

A full-stack Employee Management System with a professional dark-theme dashboard UI, built with **Spring Boot**, **React**, and **MySQL**.

![Java](https://img.shields.io/badge/Java-17+-orange?style=flat-square)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-green?style=flat-square)
![React](https://img.shields.io/badge/React-18.3-blue?style=flat-square)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square)

---

## 📋 Features

- ✅ **Dashboard** with statistics, recent employees, and quick actions
- ✅ **Full CRUD** — Create, Read, Update, Delete employees
- ✅ **Search** — Search by name or department
- ✅ **Validation** — Both client-side and server-side
- ✅ **Responsive Design** — Works on desktop, tablet, and mobile
- ✅ **Dark Theme** — Professional glassmorphism UI
- ✅ **Toast Notifications** — Success/error feedback
- ✅ **Delete Confirmation** — Modal dialog before delete
- ✅ **REST API** — Clean API with proper error handling

---

## 🛠️ Prerequisites

Before running this project, make sure you have installed:

| Tool | Version | Download |
|------|---------|----------|
| **Java JDK** | 17 or higher | [Download](https://adoptium.net/) |
| **Node.js** | 18 or higher | [Download](https://nodejs.org/) |
| **MySQL** | 8.0 or higher | [Download](https://dev.mysql.com/downloads/) |
| **Maven** | 3.8+ (or use included wrapper) | [Download](https://maven.apache.org/) |

---

## 🗄️ Database Setup

### Step 1: Start MySQL Server
Make sure your MySQL server is running.

### Step 2: Create the Database
Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE IF NOT EXISTS employee_management;
```

### Step 3: (Optional) Seed Sample Data
Run the provided SQL script:

```bash
mysql -u root -p < database/setup.sql
```

Or open `database/setup.sql` in MySQL Workbench and execute it.

### Step 4: Update Database Password
Open `backend/src/main/resources/application.properties` and change:

```properties
spring.datasource.password=YOUR_PASSWORD
```

Replace `YOUR_PASSWORD` with your actual MySQL root password.

---

## 🚀 Running the Project

### Backend (Spring Boot)

```bash
# Navigate to backend directory
cd backend

# Run with Maven wrapper (Windows)
mvnw.cmd spring-boot:run

# Run with Maven wrapper (Mac/Linux)
./mvnw spring-boot:run

# OR if you have Maven installed globally
mvn spring-boot:run
```

The backend API will start at: **http://localhost:8080**

### Frontend (React)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start at: **http://localhost:5173**

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/employees` | Get all employees |
| `GET` | `/api/employees/{id}` | Get employee by ID |
| `POST` | `/api/employees` | Create new employee |
| `PUT` | `/api/employees/{id}` | Update employee |
| `DELETE` | `/api/employees/{id}` | Delete employee |
| `GET` | `/api/employees/search?query=` | Search employees |

### Example: Create Employee (POST)

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "phone": "1234567890",
  "department": "Engineering",
  "salary": 85000,
  "joiningDate": "2024-01-15"
}
```

---

## 📁 Project Structure

```
CarHelp/
├── backend/                    # Spring Boot REST API
│   ├── pom.xml                 # Maven dependencies
│   └── src/main/
│       ├── java/com/employeemgmt/
│       │   ├── EmployeeManagementApplication.java
│       │   ├── config/         # CORS configuration
│       │   ├── controller/     # REST controllers
│       │   ├── exception/      # Global error handling
│       │   ├── model/          # JPA entities
│       │   ├── repository/     # Data access layer
│       │   └── service/        # Business logic
│       └── resources/
│           └── application.properties
├── frontend/                   # React Dashboard
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api/                # Axios API layer
│       ├── components/         # Reusable UI components
│       └── pages/              # Page components
├── database/
│   └── setup.sql               # Database schema + seed data
└── README.md
```

---

## 🔧 Troubleshooting

### Backend won't start
- **Check MySQL is running**: Make sure MySQL service is active
- **Check password**: Verify `application.properties` has correct MySQL password
- **Check Java version**: Run `java -version` — must be 17+
- **Port conflict**: If port 8080 is in use, change `server.port` in `application.properties`

### Frontend won't start
- **Check Node.js**: Run `node -v` — must be 18+
- **Missing dependencies**: Run `npm install` in the `frontend` directory
- **Port conflict**: If port 5173 is in use, Vite will auto-pick another port

### CORS errors in browser
- Make sure the backend is running on port 8080
- Make sure the frontend is running on port 5173
- The CORS config allows `http://localhost:5173` by default

### Database connection errors
- Verify MySQL is running: `mysql -u root -p`
- Check database exists: `SHOW DATABASES;`
- Verify credentials in `application.properties`

---

## 📝 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI Components |
| **Styling** | Vanilla CSS | Dark theme dashboard |
| **HTTP Client** | Axios | API communication |
| **Routing** | React Router v6 | Client-side routing |
| **Build Tool** | Vite | Fast dev server & bundler |
| **Backend** | Spring Boot 3.2 | REST API framework |
| **ORM** | Spring Data JPA | Database access |
| **Validation** | Jakarta Bean Validation | Input validation |
| **Database** | MySQL 8.0 | Data storage |

---

## 📄 License

This project is for educational purposes. Feel free to use and modify.

---

Made with ❤️ for learning Spring Boot + React
