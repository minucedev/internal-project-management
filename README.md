# Internal Project Management (CRM MVP)

An internal project management system designed for small teams, focusing on simplicity and efficiency. The project is developed using a Monorepo architecture.

## 📂 Project Structure

```
internal-project-management/
├── backend/            # Backend Source Code (Spring Boot 3.x - JDK 21)
├── frontend/           # Frontend Source Code (React + TypeScript + Vite)
└── database/           # SQL Scripts (Schema, Seed data)
```

## 🛠 Prerequisites

Before running the project, ensure your machine has the following installed:

- Java JDK 21 (Check: `java -version`)
- Node.js (Recommended LTS v18+ or v20+. Check: `node -v`)
- PostgreSQL (With a management tool like pgAdmin 4 or DBeaver)
- Git

## 🚀 Setup & Run Guide

Follow the steps below to initialize the system on a new machine.

### Step 1: Database Setup

1. Open pgAdmin or your PostgreSQL terminal.
2. Create a new database (e.g., named `crm_db`).
3. Locate the SQL file in the project's `/database` folder (usually `script.sql` or `schema.sql`).
4. Execute this script to initialize the tables and seed data.

### Step 2: Run Backend (Spring Boot)

1. Open a terminal or IDE (IntelliJ IDEA) and navigate to the `backend` folder.
2. Configure the Database Connection:
   - Open `src/main/resources/application.properties`.
   - Update `spring.datasource.url`, `username`, and `password` to match your local PostgreSQL setup.
3. Install dependencies (Maven) and run the application:

   ```bash
   # If using Terminal
   ./mvnw spring-boot:run
   ```

   Or simply press the Run button in IntelliJ IDEA.

4. The Backend will start at: http://localhost:8080

### Step 3: Run Frontend (React)

**Note:** The frontend was initialized using: `npm create vite@latest . -- --template react-ts`

1. Open a new terminal and navigate to the `frontend` folder:

   ```bash
   cd frontend
   ```

2. Install Dependencies:

   ```bash
   npm install antd @ant-design/icons axios @reduxjs/toolkit react-redux react-router-dom firebase
   ```

   **Note:** If you are pulling an existing repo with a populated `package.json`, just run `npm install`.

3. Start the Development Server:

   ```bash
   npm run dev
   ```

4. Access the application via the URL shown in the terminal (usually http://localhost:5173).

## 📚 Tech Stack

- **Backend:** Java 21, Spring Boot 3, Spring Security (JWT), Spring Data JPA
- **Frontend:** React (TypeScript), Vite, Ant Design, Redux Toolkit, Axios
- **Database:** PostgreSQL
- **Real-time:** Firebase (for Chat & Online Status)

## 🤝 Development Team

- Nguyen Minh Phuc
- Le Xuan Thanh
