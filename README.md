# Expense Management System

A full-stack expense management web application that helps users manage their personal finances by tracking income and expenses, monitoring their total balance, viewing financial statistics through interactive charts, and exporting financial reports.

The application is designed for anyone who wants to manage their budget and keep track of their financial transactions in an organized and simple way.

## Main Features

* **User Authentication** – Secure registration and login using JWT authentication.
* **Dashboard Overview** – View total balance, income, and expenses in summary cards.
* **Income Management** – Add, view, delete, and export income records.
* **Expense Management** – Add, view, delete, and export expense records with category-based tracking.
* **Interactive Charts** – Visualize income and expenses using Bar, Pie, and Line charts.
* **Recent Transactions** – Quickly view the latest income and expense transactions.
* **Financial Reports** – Export income and expense data as Excel files.
* **Responsive Design** – Accessible across desktops, tablets, and mobile devices.
* **Intuitive Navigation** – Easily navigate between Dashboard, Income, Expenses, and Logout.
* **Transaction Deletion** – Easily delete income and expense records when needed.


## Technologies Used

### Frontend

* React
* Bootstrap

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Tools

* Visual Studio Code
* Git
* GitHub

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/AbdullahMohamedVP1/Expense-System.git
cd Expense-System
```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd Backend
```

Install the required dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder and add the required environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the backend server:

```bash
npm start
```

For development with Nodemon:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install the required dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

To create a production build:

```bash
npm run build
```

## API Overview

The application provides RESTful APIs for authentication, income management, expense management, and dashboard data.

### Authentication APIs

Base URL:

```text
/api/v1/auth
```

| Method | Endpoint        | Description                              | Authentication |
| ------ | --------------- | ---------------------------------------- | -------------- |
| POST   | `/register`     | Register a new user                      | No             |
| POST   | `/login`        | Login user and authenticate using JWT    | No             |
| GET    | `/getUser`      | Get the authenticated user's information | Yes            |
| POST   | `/upload-image` | Upload a user profile image              | Yes            |

### Income APIs

Base URL:

```text
/api/v1/income
```

| Method | Endpoint         | Description                 | Authentication |
| ------ | ---------------- | --------------------------- | -------------- |
| POST   | `/add`           | Add a new income record     | Yes            |
| GET    | `/get`           | Get all income records      | Yes            |
| GET    | `/downloadexcel` | Export income data to Excel | Yes            |
| DELETE | `/:id`            | Delete an income record     | Yes           |

### Expense APIs

Base URL:

```text
/api/v1/expense
```

| Method | Endpoint         | Description                  | Authentication |
| ------ | ---------------- | ---------------------------- | -------------- |
| POST   | `/add`           | Add a new expense record     | Yes            |
| GET    | `/get`           | Get all expense records      | Yes            |
| GET    | `/downloadexcel` | Export expense data to Excel | Yes            |
| DELETE | `/:id`           | Delete an expense record     | Yes            |

### Dashboard API

Base URL:

```text
/api/v1/dashboard
```

| Method | Endpoint | Description                                 | Authentication |
| ------ | -------- | ------------------------------------------- | -------------- |
| GET    | `/`      | Get dashboard financial data and statistics | Yes            |

> **Note:** Protected endpoints require a valid JWT authentication token.

## API Documentation

The complete API documentation is available here:

[API Documentation](docs/API%20Documentation.pdf)

## UI/UX Design
Figma Design:
https://www.figma.com/design/rIPsg7fCX9WSUyfkF6LXWD/Untitled

## Team Members and Contributions

### Backend Team

#### Member 1 — Khaled Kamal — Setup & Authentication

* Worked on the backend project setup and authentication functionality.
* Implemented user registration and login.
* Implemented JWT token generation and authentication.
* Implemented the User Mongoose model.
* Implemented password hashing using bcryptjs.
* Implemented password comparison during login.
* Developed the authentication middleware for verifying JWT tokens.
* Added validation for registration and login fields.
* Implemented email uniqueness checking during registration.

#### Member 2 — Rahma Mahmoud — Income Management

* Developed the Income Management APIs.
* Implemented adding new income records.
* Implemented retrieving income records.
* Implemented deleting income records.
* Implemented exporting income records to Excel using ExcelJS.
* Added validation for income fields.
* Implemented the Income Mongoose model.

#### Member 3 — Menna Allah Tamer — Expense Management

* Developed the Expense Management APIs.
* Implemented adding new expense records.
* Implemented retrieving expense records.
* Implemented deleting expense records.
* Implemented exporting expense records to Excel using the XLSX library.
* Added validation for expense fields.
* Implemented the Expense Mongoose model.

#### Member 4 — Abdullah Mohamed — Dashboard & Uploads

* Developed the Dashboard API for retrieving financial statistics.
* Implemented MongoDB aggregation using `$match`, `$group`, and `$sum`.
* Implemented total income and expense calculations.
* Implemented total balance calculation.
* Implemented 30-day expense and 60-day income statistics.
* Implemented recent transactions retrieval and sorting.
* Used JavaScript `reduce()` for financial calculations.
* Implemented profile image upload functionality using Multer.
* Configured image storage and file type validation.
* Integrated the protected Dashboard route using JWT authentication.

### Frontend Team

#### Member 1 — Mohamed Shehab — Authentication & Setup

- React project setup
- Bootstrap and dependencies
- Routing
- Login and Sign Up UI
- Profile photo selector
- Login API integration
- Sign Up API integration

#### Member 2 — Bassem Tarek — Dashboard

- Dashboard layout
- Summary cards
- Recent transactions
- Financial overview
- Pie charts
- Bar charts
- Expense overview

#### Member 3 — Alaa Antar — Income Management

- Income details and overview
- Add income form
- Income API integration
- Income list
- Delete income
- Income Excel download

#### Member 4 — Mohamed Saber — Expense Management & API Setup

- API paths
- Axios setup
- Expense overview
- Add expense form
- Expense list
- Delete expense
- Get expenses API
- Expense Excel download

### UI/UX Team

#### Member — Ahmed Saeed — UI/UX Design
#### Member — Belal Omar — UI/UX Design

## Testing

A structured testing guide is provided to verify the main application features, including authentication, income and expense management, dashboard calculations, data export, and record deletion.

[Test Guide](docs/Test%20Guide.pdf)

## Demo Links

### Frontend Demo

> To be added if deployed.

### Backend/API

> To be added if deployed.

## ERD (Entity Relationship Diagram)

![ERD Diagram](docs/ERD%20Diagram.png)

## AI Tools Used

* **ChatGPT** – Used as a development assistant for code explanations, debugging, troubleshooting, documentation, and development suggestions.
* All AI-assisted code and suggestions were reviewed, tested, and understood by the team before being used in the project.
* The team remains responsible for the correctness, security, quality, and understanding of the final code.

