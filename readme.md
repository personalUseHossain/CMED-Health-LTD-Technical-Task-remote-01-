# Prescription Management System

A full-stack web application built with Angular (Frontend) and Spring Boot (Backend).

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Node.js (Latest LTS)** - JavaScript runtime
   - Download: [https://nodejs.org/](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** - Node Package Manager (comes with Node.js)
   - Verify installation: `npm --version`

3. **Java (Latest LTS - Java 17 or 21)** - Java Development Kit
   - Download: [https://www.oracle.com/java/technologies/downloads/](https://www.oracle.com/java/technologies/downloads/)
   - Alternative (OpenJDK): [https://adoptium.net/](https://adoptium.net/)
   - Verify installation: `java --version`

4. **Maven (Latest)** - Build automation tool
   - Download: [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)
   - Verify installation: `mvn --version`

5. **Angular CLI** - Angular command line interface
   - Install globally: `npm install -g @angular/cli`
   - Verify installation: `ng version`

6. **Git** - Version control
   - Download: [https://git-scm.com/downloads](https://git-scm.com/downloads)
   - Verify installation: `git --version`

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/personalUseHossain/CMED-Health-LTD-Technical-Task-remote-01-.git
cd CMED-Health-LTD-Technical-Task-remote-01-
```

---

## 🎨 Frontend Setup (Angular)

### Step 1: Navigate to Frontend Directory

```bash
cd prescription-frontend
```

### Step 2: Install Angular CLI (if not already installed)

```bash
npm install -g @angular/cli
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the Development Server

```bash
npx ng serve
```


after running this the frontend will start at 
`http://localhost:4200/`

`Note: Please start the backend server to make sure everything works fine`

`How to start backend is shown below`

### Step 5: Access the Application

Open your browser and navigate to:
```
http://localhost:4200
```


## ⚙️ Backend Setup (Spring Boot)

### Step 1: Navigate to Backend Directory

Start a new terminal session and from the root directory:

```bash
cd prescription-backend
```

### Step 2: Run the Spring Boot Application

```bash
mvn spring-boot:run
```

### Step 3: Verify Backend is Running

The backend should start on:
```
http://localhost:8080
```

You can access the H2 Database console at:
```
http://localhost:8080/h2-console
```

**H2 Database Credentials:**
- JDBC URL: `jdbc:h2:mem:prescriptiondb`
- Username: `sa`
- Password: _(leave empty)_


## 🔐 Default User Credentials

After starting the backend, the following users are automatically created:

| Username | Password | Role |
|----------|----------|------|
| `admin` | `password` | ADMIN |


---

## 📁 Project Structure

```
project-root/
│
├── prescription-frontend/     # Angular Frontend
│   ├── src/
│   ├── package.json
│   └── angular.json
│
└── prescription-backend/      # Spring Boot Backend
    ├── src/
    ├── pom.xml
    └── application.properties
```

---




Please let me know if anything went wrong 
`personal.mdhossain@gmail.com | +8801953638739`

**Happy Coding! 🚀**