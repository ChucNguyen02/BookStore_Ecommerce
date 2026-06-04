# 📚 BookStore E-commerce Platform

<div align="center">

![BookStore Banner](https://img.shields.io/badge/BookStore-E--commerce-4F46E5?style=for-the-badge&logo=book&logoColor=white)

**A full-stack, AI-powered e-commerce bookstore platform**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-6DB33F?style=flat-square&logo=spring-boot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-316192?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis)](https://redis.io/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.13-FF6600?style=flat-square&logo=rabbitmq)](https://www.rabbitmq.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

[Features](#-key-features) • [Tech Stack](#-technology-stack) • [Architecture](#-system-architecture) • [Getting Started](#-getting-started) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Features Deep Dive](#-features-deep-dive)
- [Deployment](#-deployment)

---

## 🎯 Overview

**BookStore** is a full-stack e-commerce platform for buying books online, built with modern technologies and best practices. It provides a seamless experience for both customers and administrators with AI-powered features, multi-payment gateway integration, and a comprehensive loyalty program.

### What Makes BookStore Special?
- 🤖 **AI-Powered Assistant** - Intelligent book recommendations & review summarization using Google Gemini
- 💳 **Multi-Payment Gateway** - Integrated with VNPay, MoMo, and PayOS for secure transactions
- 🎮 **Gamification System** - 4-tier loyalty program with daily check-in streaks and point rewards
- ⭐ **Rich Review System** - Verified purchase reviews with voting, replies, and image uploads
- 📊 **Admin Analytics** - Comprehensive dashboard with revenue tracking and order statistics
- 🔐 **Enterprise Security** - JWT authentication with Google OAuth2 SSO and RBAC
- 🌐 **Multi-language** - Full i18n support (Vietnamese & English)
- 📨 **Async Email** - RabbitMQ-powered email delivery with 11 Thymeleaf templates
- ⚡ **High Performance** - Redis caching with custom rate limiting

---

## ✨ Key Features

### 🛒 For Customers

#### Book Browsing
- **Catalog** - Browse books with advanced filtering by category, author, price range
- **Search** - Full-text search with Vietnamese diacritics support (unaccent)
- **Book Details** - Comprehensive info with images, descriptions, author profiles
- **Bestsellers & New Arrivals** - Curated book collections
- **View History** - Track recently viewed books
- **Wishlist** - Save books for later

#### Shopping & Checkout
- **Shopping Cart** - Add/remove books, adjust quantities
- **Selective Checkout** - Choose specific cart items to checkout
- **Voucher System** - Apply discount codes (percentage & fixed amount)
- **Points Discount** - Use loyalty points as payment discount
- **Address Management** - Save multiple shipping addresses
- **Order Tracking** - Real-time order status updates (Pending → Confirmed → Shipping → Delivered)

#### Payments
- **VNPay** - Vietnamese bank payment gateway with HMAC-SHA512 verification
- **MoMo** - E-wallet payment with HMAC-SHA256 signature
- **PayOS** - Modern payment gateway with webhook verification
- **COD** - Cash on delivery option

#### Reviews & Social
- **Verified Reviews** - Only buyers can review (linked to order)
- **Star Rating** - 1-5 stars with text comments
- **Review Images** - Upload photos with reviews
- **Helpful Voting** - Vote reviews as helpful/unhelpful
- **Seller Replies** - Admin can reply to reviews
- **AI Review Summary** - Gemini summarizes all reviews for a book

#### Q&A System
- **Book Questions** - Ask questions about any book
- **Admin Answers** - Seller provides answers
- **Community** - Browse Q&A before purchasing

#### Loyalty & Rewards
- **4-Tier Membership** - Bronze → Silver → Gold → Platinum
- **Daily Check-in** - Earn points with streak bonuses (7-day, 14-day, 30-day)
- **Order Points** - Earn points from purchases
- **Reward Store** - Redeem points for vouchers and rewards
- **Points History** - Track all point transactions

#### AI Features
- **AI Chatbot** - Ask for book recommendations in natural language
- **Smart Recommendations** - AI suggests books based on preferences and catalog
- **Review Summarization** - AI summarizes customer reviews

#### Notifications
- **In-app Notifications** - Real-time notification center
- **Email Notifications** - Order confirmation, shipping updates, delivery confirmation

#### User Account
- **Profile Management** - Update personal information, avatar (Cloudinary)
- **Email/Password Login** - With email verification
- **Google OAuth2 SSO** - One-click Google login with account linking
- **Password Recovery** - Reset password via email
- **Multi-language** - Switch between Vietnamese and English

### 👨‍💼 For Administrators

#### Product Management
- **Book CRUD** - Full book management with image gallery (Cloudinary)
- **Category Management** - Create/edit book categories
- **Author Management** - Manage author profiles
- **AI Description Generator** - Gemini generates book descriptions

#### Order Management
- **Order Dashboard** - View all orders with status filtering
- **Status Updates** - Process orders through lifecycle with email notifications
- **Search Orders** - By order code, customer name, email, phone
- **Tracking Numbers** - Add shipment tracking info
- **Order Notes** - Internal notes for order processing

#### Marketing
- **Voucher Management** - Create public/personal discount codes
- **Reward Management** - Configure reward items for loyalty store
- **Points Management** - View and manage user points

#### Analytics & Reports
- **Revenue Dashboard** - Track revenue with Recharts visualizations
- **Order Statistics** - Pending, processing, delivered, cancelled counts
- **User Management** - View/manage users, ban accounts
- **Wishlist Analytics** - Track popular wishlisted books
- **Export Reports** - Export data to Excel (xlsx)

#### Review Moderation
- **Pending Reviews** - Approve/reject reviews
- **Reply to Reviews** - Respond to customer feedback

---

## 🛠 Technology Stack

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 21 | Core programming language |
| **Spring Boot** | 3.3.5 | Application framework |
| **Spring Security** | 6.x | Authentication & authorization |
| **Spring Data JPA** | 3.3.5 | Database ORM |
| **PostgreSQL** | Latest | Primary database |
| **Redis** | 7 (Alpine) | Caching & rate limiting |
| **RabbitMQ** | 3.13 | Async message queue |
| **Maven** | Latest | Build tool |

#### Key Dependencies
- **Security & Auth**
  - Spring Security OAuth2 Resource Server
  - JWT (jjwt v0.12.6)
  - BCrypt password encoding
  - Google OAuth2 Client
- **Cloud Services**
  - Cloudinary (Image storage & CDN)
  - Google Gemini API (AI/ML)
- **Payment Integration**
  - VNPay (HMAC-SHA512)
  - MoMo (HMAC-SHA256)
  - PayOS Java SDK (v2.0.1)
- **Communication**
  - Spring Mail (SMTP)
  - Thymeleaf (11 email templates)
  - RabbitMQ with Dead Letter Queue (DLQ)
- **Database & Migration**
  - Flyway (v11.19.0) - Schema versioning
  - Spring Data Redis (Lettuce client)
- **Code Quality**
  - Lombok (Boilerplate reduction)
  - MapStruct (Object mapping)
  - SpringDoc OpenAPI / Swagger UI
- **Scheduling**
  - Spring Quartz Scheduler

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI library |
| **TypeScript** | 5.9.3 | Type safety |
| **Vite** | 7.2.4 | Build tool & dev server |
| **TailwindCSS** | 3.4.1 | Styling framework |

#### Key Libraries
- **Data Fetching**: TanStack React Query (v5.90.12), Axios
- **Routing**: React Router DOM (v7.9.6)
- **Charts**: Recharts (v3.6.0)
- **i18n**: i18next + react-i18next (Vietnamese & English)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Auth**: @react-oauth/google
- **Export**: xlsx (Excel export)
- **Date**: date-fns
- **Theme**: next-themes (Dark mode support)

### DevOps & Tools

- **Containerization**: Docker Compose (multi-stage Dockerfile)
- **Web Server**: Nginx (reverse proxy, gzip, security headers)
- **Frontend Hosting**: Vercel
- **API Docs**: Swagger UI (SpringDoc OpenAPI)
- **Version Control**: Git + GitHub

---

## 🏗 System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐                    ┌──────────────┐       │
│  │   Web App    │                    │    Admin     │       │
│  │ (React + TS) │                    │  Dashboard   │       │
│  └──────┬───────┘                    └──────┬───────┘       │
└─────────┼──────────────────────────────────┼────────────────┘
          └─────────────┬────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                        │
│          (Gzip, Security Headers, Static Cache)              │
└────────────────────────┬────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Spring Boot REST API                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Security Filter Chain                    │   │
│  │  - JWT Authentication    - Rate Limiting (Redis)     │   │
│  │  - OAuth2 Resource Server - CORS Configuration       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │  Book   │ │  Order  │ │  Auth   │ │   AI    │ ...28     │
│  │Controller│ │Controller│ │Controller│ │Controller│ controllers│
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘          │
│       ▼           ▼           ▼           ▼                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │  Book   │ │  Order  │ │  Auth   │ │ Gemini  │ ...35     │
│  │ Service │ │ Service │ │ Service │ │ Service │ services  │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘          │
│       └───────────┴───────────┴───────────┘                 │
│                        │                                     │
│                  Repository Layer (26 repos)                 │
└────────────────────────┼────────────────────────────────────┘
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
   ┌────────────┐ ┌────────────┐ ┌────────────┐
   │ PostgreSQL │ │   Redis    │ │  RabbitMQ  │
   │  (Main DB) │ │  (Cache)   │ │  (Email)   │
   └────────────┘ └────────────┘ └────────────┘

              External Services
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │ Gemini   │ │Cloudinary│ │  VNPay/  │
   │   AI     │ │ (Images) │ │MoMo/PayOS│
   └──────────┘ └──────────┘ └──────────┘
```

### Backend Layer Architecture

```
src/main/java/chucnguyen/bookstore/
│
├── configuration/           # Spring configurations (17 files)
│   ├── SecurityConfig       # JWT + OAuth2 + RBAC
│   ├── RedisConfig          # Cache manager + Lettuce
│   ├── RabbitMQConfig       # Email queue + DLQ
│   ├── RateLimitInterceptor # Custom @RateLimit annotation
│   ├── CloudinaryConfig     # Image upload config
│   ├── GeminiConfig         # AI configuration
│   ├── SwaggerConfig        # OpenAPI docs
│   └── ...
│
├── controller/              # REST API endpoints (28 controllers)
│   ├── BookController       # Book CRUD + search
│   ├── OrderController      # Order management
│   ├── AuthController       # Login, register, OAuth2
│   ├── PaymentController    # VNPay, MoMo, PayOS
│   ├── ReviewController     # Reviews + voting
│   ├── AiController         # AI chat, recommend, summarize
│   ├── PointsController     # Loyalty points system
│   ├── RewardController     # Reward store
│   └── ...
│
├── service/                 # Business logic (35 services)
│   ├── BookService          # Book operations
│   ├── OrderService         # Order lifecycle
│   ├── AuthService          # Authentication logic
│   ├── VNPayService         # VNPay payment processing
│   ├── MomoService          # MoMo payment processing
│   ├── PayOSService         # PayOS payment processing
│   ├── GeminiService        # AI/Gemini integration
│   ├── PointsService        # Points & check-in logic
│   ├── EmailConsumer        # RabbitMQ email consumer
│   ├── CloudinaryService    # Image upload/management
│   └── ...
│
├── repository/              # Data access layer (26 repositories)
├── entity/                  # JPA entities (26 entities + 14 enums)
├── dto/                     # Request/Response DTOs
├── mapper/                  # MapStruct object mappers
├── exception/               # Global exception handling
├── scheduler/               # Quartz scheduled tasks
│   ├── ScheduledTasks       # Auto-cancel, auto-complete orders
│   └── TokenCleanupScheduler
├── validator/               # Custom validators
└── util/                    # Utility classes
```

### Frontend Architecture

```
src/
│
├── pages/                    # Page components
│   ├── user/                # Customer-facing pages (19 sections)
│   │   ├── Home.tsx         # Landing page
│   │   ├── books/           # Book listing & details
│   │   ├── cart/            # Shopping cart
│   │   ├── checkout/        # Checkout flow
│   │   ├── orders/          # Order history & tracking
│   │   ├── reviews/         # Review management
│   │   ├── points/          # Loyalty points
│   │   ├── rewards/         # Reward store
│   │   ├── wishlist/        # Wishlist
│   │   ├── profile/         # User profile
│   │   └── ...
│   └── admin/               # Admin pages (11 sections)
│       ├── AdminDashboard   # Analytics dashboard
│       ├── books/           # Book management
│       ├── orders/          # Order management
│       ├── users/           # User management
│       ├── vouchers/        # Voucher management
│       ├── rewards/         # Reward management
│       ├── reports/         # Reports & export
│       └── ...
│
├── components/              # Reusable components
│   ├── user/                # Customer components (20 categories)
│   └── admin/               # Admin components
│
├── services/                # API services (32 service files)
├── hooks/                   # Custom React hooks
├── context/                 # React context providers
├── i18n/                    # Internationalization (EN + VI)
├── types/                   # TypeScript type definitions
├── routers/                 # Route configuration
├── styles/                  # CSS & animations
└── utils/                   # Utility functions
```

---

## 📁 Project Structure

```
BookStore_Ecommerce/
│
├── BookStore_Backend/                 # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/chucnguyen/bookstore/
│   │   │   │   ├── configuration/     # 17 config files
│   │   │   │   ├── controller/        # 28 REST controllers
│   │   │   │   ├── service/           # 35 business services
│   │   │   │   ├── repository/        # 26 data repositories
│   │   │   │   ├── entity/            # 26 JPA entities
│   │   │   │   ├── dto/               # Request/Response DTOs
│   │   │   │   ├── mapper/            # MapStruct mappers
│   │   │   │   ├── exception/         # Exception handling
│   │   │   │   ├── scheduler/         # Quartz scheduled tasks
│   │   │   │   ├── validator/         # Custom validators
│   │   │   │   └── BookStoreApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── db/migration/      # Flyway migrations
│   │   │       └── templates/email/   # 11 Thymeleaf email templates
│   │   └── test/
│   ├── pom.xml
│   ├── Dockerfile                     # Multi-stage Docker build
│   └── docker-compose.yml             # Full stack orchestration
│
├── BookStore_Frontend/                # React Frontend
│   ├── src/
│   │   ├── pages/                    # User (19) + Admin (11) pages
│   │   ├── components/               # Reusable UI components
│   │   ├── services/                 # 32 API service files
│   │   ├── hooks/                    # Custom hooks
│   │   ├── context/                  # React contexts
│   │   ├── i18n/locales/            # EN + VI translations
│   │   ├── types/                    # TypeScript definitions
│   │   ├── routers/                  # Route config
│   │   └── utils/                    # Utilities
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf                    # Production Nginx config
│   ├── vite.config.ts
│   ├── vercel.json                   # Vercel deployment config
│   └── tailwind.config.js
│
├── .github/                           # GitHub Actions
└── README.md
```

---

## 💾 Database Schema

### Core Entities

#### Books Table
```sql
books (
  id UUID PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  isbn VARCHAR(13) UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  discount_price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  pages INTEGER,
  publisher VARCHAR,
  publish_year INTEGER,
  language VARCHAR DEFAULT 'Vietnamese',
  cover_image_url VARCHAR,
  category_id UUID REFERENCES categories,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  sold_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
-- Indexes: slug, category_id, average_rating
```

#### Users Table
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR,
  full_name VARCHAR NOT NULL,
  phone VARCHAR,
  avatar_url VARCHAR,
  role VARCHAR(20) DEFAULT 'USER',  -- USER | ADMIN
  provider_id VARCHAR,
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
-- Indexes: email, role
-- Auth providers: LOCAL, GOOGLE (many-to-many via user_auth_providers)
```

#### Orders Table
```sql
orders (
  id UUID PRIMARY KEY,
  order_code VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users NOT NULL,
  shipping_name VARCHAR NOT NULL,
  shipping_phone VARCHAR(20) NOT NULL,
  shipping_address TEXT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_fee DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  points_used INTEGER DEFAULT 0,
  points_discount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  voucher_id UUID REFERENCES vouchers,
  voucher_code VARCHAR(50),
  payment_method VARCHAR(30),  -- COD | VNPAY | MOMO | PAYOS
  payment_status VARCHAR(20),  -- PENDING | PAID | FAILED
  status VARCHAR(20),          -- PENDING | PAYMENT_PENDING | CONFIRMED | SHIPPING | DELIVERED | CANCELLED
  note TEXT,
  cancelled_reason TEXT,
  points_earned INTEGER DEFAULT 0,
  transaction_id VARCHAR(100),
  tracking_number VARCHAR(100),
  created_at TIMESTAMP,
  confirmed_at TIMESTAMP,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  cancelled_at TIMESTAMP
)
-- Indexes: user_id, status, order_code, created_at
```

#### Reviews Table
```sql
reviews (
  id UUID PRIMARY KEY,
  book_id UUID REFERENCES books NOT NULL,
  user_id UUID REFERENCES users NOT NULL,
  order_id UUID REFERENCES orders NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT TRUE,
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT TRUE,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
)
-- Unique: (user_id, book_id, order_id)
-- Indexes: book_id, user_id, order_id, rating
```

#### Vouchers Table
```sql
vouchers (
  id UUID PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20),   -- PERCENTAGE | FIXED_AMOUNT
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_value DECIMAL(10,2) DEFAULT 0,
  max_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES users,  -- NULL = public, NOT NULL = personal
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
)
```

### Supporting Tables

- **categories** - Book categories with slug
- **authors** - Author profiles (many-to-many with books)
- **book_images** - Book image gallery
- **book_authors** - Book-Author junction table
- **order_items** - Individual items in an order
- **cart_items** - Shopping cart items
- **addresses** - User shipping addresses
- **wishlist** - User's saved books
- **view_history** - Book browsing history
- **book_questions** - Q&A for books
- **question_answers** - Answers to book questions
- **review_images** - Images attached to reviews
- **review_replies** - Admin replies to reviews
- **review_votes** - Helpful/unhelpful votes on reviews
- **user_points** - User loyalty points & tier (Bronze/Silver/Gold/Platinum)
- **point_transactions** - Points earn/redeem history
- **daily_check_in** - Daily check-in streak records
- **reward_items** - Reward store items
- **user_rewards** - User redemption records
- **notifications** - In-app notification center
- **email_verification_tokens** - Email verification tokens
- **email_change_tokens** - Email change verification
- **user_auth_providers** - Multi-provider auth (LOCAL, GOOGLE)

### Entity Relationships

```
users 1──────* orders
users 1──────* reviews
users 1──────* cart_items
users 1──────* addresses
users 1──────* wishlist
users 1──────1 user_points
users 1──────* daily_check_in
users 1──────* notifications
books 1──────* order_items
books 1──────* reviews
books 1──────* book_images
books *──────* authors (via book_authors)
books *──────1 categories
orders 1──────* order_items
orders *──────1 vouchers
reviews 1──────* review_images
reviews 1──────* review_replies
reviews 1──────* review_votes
```

---

## 🚀 Getting Started

### Prerequisites

- **Java Development Kit (JDK) 21+**
- **Node.js 18+ and npm**
- **PostgreSQL 15+**
- **Docker & Docker Compose** (for containerized setup)
- **Maven 3.8+** (or use included wrapper)

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/ChucNguyen02/BookStore_Ecommerce.git
cd BookStore_Ecommerce

# Start all services (Backend + Redis + RabbitMQ)
cd BookStore_Backend
docker-compose up -d

# Start frontend
cd ../BookStore_Frontend
npm install
npm run dev
```

### Backend Setup (Manual)

#### 1. Database Setup
```sql
psql -U postgres
CREATE DATABASE bookstore_db;
```

#### 2. Configure Environment
Create `.env` in `BookStore_Backend/`:
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookstore_db
DB_USERNAME=postgres
DB_PASSWORD=your_password

# JWT
JWT_SIGNER_KEY=your-secret-key-at-least-32-characters

# Google OAuth2
GOOGLE_CLIENT_ID=your-google-client-id

# Email (Gmail SMTP)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis123

# RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_USERNAME=bookstore
RABBITMQ_PASSWORD=bookstore123

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Payment Gateways
VNPAY_TMN_CODE=your-vnpay-code
VNPAY_HASH_SECRET=your-vnpay-secret
MOMO_PARTNER_CODE=your-momo-code
MOMO_ACCESS_KEY=your-momo-key
MOMO_SECRET_KEY=your-momo-secret
PAYOS_CLIENT_ID=your-payos-client-id
PAYOS_API_KEY=your-payos-api-key
PAYOS_CHECKSUM_KEY=your-payos-checksum
```

#### 3. Build and Run
```bash
cd BookStore_Backend

# Windows
mvnw.cmd clean install -DskipTests
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw clean install -DskipTests
./mvnw spring-boot:run
```

Backend starts on `http://localhost:8080`

### Frontend Setup

```bash
cd BookStore_Frontend
npm install
npm run dev
```

Frontend starts on `http://localhost:5173`

---

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Swagger UI
```
http://localhost:8080/swagger-ui/index.html
```

### Authentication
All authenticated endpoints require a Bearer token:
```
Authorization: Bearer <jwt_token>
```

### API Endpoints Overview

#### Authentication & Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login with credentials | ❌ |
| POST | `/auth/google` | Google OAuth2 login | ❌ |
| POST | `/auth/logout` | Logout (blacklist token) | ❌ |
| POST | `/auth/forgot-password` | Request password reset | ❌ |
| POST | `/auth/reset-password` | Reset password | ❌ |
| GET | `/users/me` | Get current user info | ✅ |
| PUT | `/users/me` | Update profile | ✅ |
| POST | `/users/verify-email` | Verify email address | ❌ |

#### Books

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/books` | List/search books | ❌ |
| GET | `/books/{slug}` | Get book details | ❌ |
| POST | `/books` | Create book | 👨‍💼 Admin |
| PUT | `/books/{id}` | Update book | 👨‍💼 Admin |
| DELETE | `/books/{id}` | Delete book | 👨‍💼 Admin |

#### Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/orders` | Create order | ✅ |
| GET | `/orders` | Get my orders | ✅ |
| GET | `/orders/{code}` | Get order details | ✅ |
| PUT | `/orders/{code}/cancel` | Cancel order | ✅ |
| PUT | `/admin/orders/{code}/status` | Update status | 👨‍💼 Admin |

#### Payments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/payment/vnpay/create` | Create VNPay payment | ✅ |
| POST | `/payment/momo/create` | Create MoMo payment | ✅ |
| POST | `/payment/payos/create` | Create PayOS payment | ✅ |
| GET | `/payment/vnpay/return` | VNPay callback | ❌ |
| POST | `/payment/momo/notify` | MoMo IPN webhook | ❌ |
| POST | `/payment/payos/webhook` | PayOS webhook | ❌ |

#### Reviews

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/reviews` | Create review | ✅ |
| GET | `/reviews/book/{bookId}` | Get book reviews | ❌ |
| POST | `/reviews/{id}/reply` | Reply to review | 👨‍💼 Admin |
| POST | `/reviews/{id}/votes` | Vote helpful/unhelpful | ✅ |

#### AI

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/ai/chat` | Chat with AI assistant | ❌ |
| POST | `/ai/recommend` | Get book recommendations | ❌ |
| GET | `/ai/summarize-reviews/{bookId}` | AI review summary | ❌ |
| POST | `/ai/generate-description` | Generate book description | 👨‍💼 Admin |

#### Points & Rewards

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/points` | Get user points | ✅ |
| POST | `/points/check-in` | Daily check-in | ✅ |
| GET | `/rewards` | Browse reward store | ❌ |
| POST | `/rewards/redeem` | Redeem reward | ✅ |

---

## 🎨 Features Deep Dive

### 1. Multi-Payment Gateway Integration

Three payment gateways integrated with full security:

- **VNPay**: HMAC-SHA512 signature, amount verification, idempotent callbacks
- **MoMo**: HMAC-SHA256 signature, IPN webhook processing
- **PayOS**: SDK-based webhook verification, payment link status polling

All gateways feature:
- Pessimistic locking (`findByOrderCodeWithLock`) to prevent race conditions
- Idempotency checks for duplicate webhook prevention
- Automatic order status transitions (PENDING → PAYMENT_PENDING → CONFIRMED)
- Scheduled auto-cancellation of unpaid orders (1-hour timeout)

### 2. Redis Caching & Rate Limiting

- **Cache Manager**: 10-minute TTL with JSON serialization
- **Cached Endpoints**: Orders, statistics, user data
- **Rate Limiting**: Custom `@RateLimit` annotation with Redis counter
  - Per-IP tracking via `X-Forwarded-For`
  - Configurable window and max requests per endpoint
  - Fail-open design (Redis failure doesn't block requests)

### 3. Async Email with RabbitMQ

- **Producer-Consumer Pattern**: Email events published to queue
- **Dead Letter Queue (DLQ)**: Failed emails routed for retry/inspection
- **Concurrent Consumers**: 2-5 concurrent email workers
- **11 Email Templates**: Welcome, order confirmation, shipping notification, delivery confirmation, password reset, email verification, email change, password set notification, account deletion, promotion

### 4. AI-Powered Features (Google Gemini)

- **Chatbot**: Context-aware conversation with conversation history
- **Book Recommendations**: AI suggests from actual catalog data
- **Review Summarization**: Summarizes up to 20 reviews with pros/cons
- **Description Generator**: Admin tool to auto-generate book descriptions

### 5. Loyalty & Gamification System

- **4 Tiers**: Bronze (0) → Silver (10K) → Gold (50K) → Platinum (100K)
- **Daily Check-in**: 10 points/day + streak bonuses:
  - 7-day streak: +50 bonus
  - 14-day streak: +100 bonus
  - 30-day streak: +300 bonus
- **Order Points**: 1% of order value converted to points
- **Reward Store**: Redeem points for vouchers and physical rewards

### 6. Scheduled Jobs (Quartz)

| Job | Schedule | Description |
|-----|----------|-------------|
| Auto-cancel PAYMENT_PENDING | Every 10 min | Cancel unpaid orders after 1h, restore stock/voucher/points |
| Auto-cancel PENDING | Hourly | Cancel unconfirmed COD orders after 24h |
| Auto-complete delivered | Daily 2 AM | Complete delivered orders after 7 days |
| Delivery confirmation emails | Every 2h | Send confirmation for recently delivered orders |
| Pending order reminders | Every 6h | Remind users about pending orders |
| Daily statistics | Daily 00:30 | Generate daily order statistics |
| Token cleanup | Scheduled | Clean expired verification tokens |

### 7. Security Architecture

- **Stateless JWT** with access + refresh tokens
- **Google OAuth2 SSO** with automatic account linking
- **BCrypt** password hashing
- **Token Blacklisting** via Redis
- **Email Verification** for new accounts
- **Role-Based Access Control**: USER, ADMIN
- **CORS** configuration with allowed origins
- **Security Headers** via Nginx (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)

---

## 🚢 Deployment

### Docker Deployment (Recommended)

The project includes a complete `docker-compose.yml` with:
- **Backend**: Multi-stage build (Maven build → JRE runtime), non-root user, JVM tuning
- **Redis**: Alpine image, password-protected, LRU eviction (256MB)
- **RabbitMQ**: Management UI enabled, health checks
- **Nginx**: Reverse proxy, gzip, static asset caching (30 days)

```bash
cd BookStore_Backend
docker-compose up -d
```

### Frontend Deployment (Vercel)

```bash
cd BookStore_Frontend
npm run build
# Deploy via Vercel CLI or GitHub integration
```

The project includes `vercel.json` for SPA routing configuration.

---

## 🙏 Acknowledgments

- **Spring Boot** - Application framework
- **React** - UI library
- **Google Gemini** - AI capabilities
- **VNPay / MoMo / PayOS** - Payment processing
- **Cloudinary** - Image hosting & CDN
- **PostgreSQL** - Reliable database
- **Redis** - High-performance caching
- **RabbitMQ** - Message queue

---

<div align="center">

**Made with ❤️ by Chuc Nguyen**

⭐ Star this repo if you find it useful!

[Back to Top](#-bookstore-e-commerce-platform)

</div>