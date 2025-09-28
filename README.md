# 🕒 E-Commerce App (NestJS + Prisma)

An attendance management backend built with **NestJS** and **Prisma**.  
This app allows users to check in/out of specific **buildings** based on their location (latitude & longitude).  
It supports authentication, city/building management, and attendance tracking.

---

## 🚀 Features
- **User Authentication** (JWT-based login/signup)

---

## 🏗️ Tech Stack
| Technology | Purpose |
|------------|---------|
| [NestJS](https://nestjs.com/) | Backend framework |
| [Prisma](https://www.prisma.io/) | ORM for database |
| [PostgreSQL](https://www.postgresql.org/) | Primary database (configurable) |
| [JWT](https://jwt.io/) | Authentication |
| [Class-Validator](https://github.com/typestack/class-validator) | Request validation |

---

## 📂 Project Structure
```bash
attendance-app/
├─ src/
| ├─ infra/ # Prisma Service
│ ├─ user/ # Authentication (JWT)
│ ├─ city/ # City CRUD
│ ├─ building/ # Building CRUD (with lat/long)
│ ├─ attendance/ # Check-in / Check-out
│ ├─ utils/ # Guards, Filters, Utils
│ └─ main.ts # App entry point
├─ prisma/
│ ├─ schema.prisma # Database schema
│ └─ seed.ts # Sample seeding (optional)
├─ .env.example # Environment variables template
└─ README.md
```

---

## ⚙️ Prerequisites
- **Node.js** v18+
- **npm** or **yarn**
- **PostgreSQL** (or any database supported by Prisma)
- **Prisma CLI**
```bash
npm install -g prisma
npx prisma migrate dev --name init
npx prisma generate
```

🔑 (Optional) Seed the database:

```bash
npm run seed
```

---

▶️ Running the App
```bash
npm run start:dev
```
