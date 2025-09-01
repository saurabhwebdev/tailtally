# 🐾 TailTally - Complete Pet Business Management System

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/MongoDB-8.18.0-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Node.js-18.0+-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
</div>

<div align="center">
  <h3>🚀 Modern, Feature-Rich POS & Management Solution for Pet Businesses</h3>
  <p>Streamline your pet clinic, store, or grooming business with intelligent automation and comprehensive management tools</p>
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Core Modules](#-core-modules)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

TailTally is a comprehensive, enterprise-grade Pet Business Management System designed to revolutionize how pet businesses operate. Built with modern web technologies, it offers a complete solution for managing inventory, appointments, customers, sales, and more - all in one integrated platform.

### 🎯 Perfect For:
- 🏥 **Veterinary Clinics** - Manage appointments, medical records, and prescriptions
- 🛍️ **Pet Stores** - Track inventory, process sales, manage suppliers
- ✂️ **Grooming Salons** - Schedule appointments, track services, manage customers
- 🐕 **Pet Daycares** - Handle check-ins, track pets, manage owners

## ✨ Key Features

### 📊 **Dashboard & Analytics**
- Real-time business metrics and KPIs
- Interactive charts and visualizations
- Revenue tracking and forecasting
- Performance analytics

### 📦 **Inventory Management**
- Multi-category product tracking
- Low stock alerts and notifications
- GST/Tax compliance (Indian GST ready)
- Bulk import/export functionality
- Purchase order management
- Expiration date tracking
- Barcode support

### 🐕 **Pet Management**
- Comprehensive pet profiles
- Medical history tracking
- Vaccination records
- Photo gallery
- Age tracking and reminders
- Species and breed categorization

### 👥 **Owner/Customer Management**
- Detailed customer profiles
- Communication preferences
- Visit history tracking
- Loyalty points system
- Emergency contacts
- Custom notes and tags

### 📅 **Appointment System**
- Advanced scheduling with conflict detection
- Multiple service types
- Staff assignment
- Status tracking (scheduled, confirmed, completed)
- Email/SMS reminders
- **Public Booking Portal** (NEW!)
  - Customer self-service booking
  - No login required
  - Real-time availability
  - Automatic confirmations

### 💰 **Sales & Billing**
- Point of Sale (POS) interface
- Multiple payment methods
- Invoice generation
- GST/Tax calculations
- Discount management
- Return processing
- Receipt printing

### 📧 **Email Integration**
- Gmail integration for automated emails
- Appointment confirmations
- Low stock alerts
- Invoice delivery
- Custom email templates
- Secure app password authentication

### 📈 **Reports & Analytics**
- Sales reports with export options
- Inventory reports
- Customer analytics
- Appointment statistics
- Revenue tracking
- Custom date ranges
- PDF/Excel export

### 👤 **User Management & Security**
- Role-based access control (RBAC)
- Multiple user roles (Admin, Manager, Staff, Viewer)
- Granular permissions system
- Secure authentication with JWT
- Session management
- Activity logging

### 🌐 **Public Booking System**
- Customer-facing appointment booking
- No authentication required
- Service selection
- Available time slots
- Automated email confirmations
- Mobile-responsive design

## 🛠 Technology Stack

### **Frontend**
- **Framework:** Next.js 15.5.2 (App Router)
- **UI Library:** React 19.1.0
- **Styling:** TailwindCSS 3.4.17 + Tailwind Animate
- **Components:** Radix UI Primitives
- **Icons:** Lucide React
- **Charts:** Recharts
- **Forms:** Native React with controlled components
- **Date Handling:** date-fns

### **Backend**
- **Runtime:** Node.js (18.0+)
- **API:** Next.js API Routes
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT + HTTP-Only Cookies
- **Password Hashing:** bcryptjs
- **Email Service:** Nodemailer with Gmail

### **Development Tools**
- **Linting:** ESLint with Next.js config
- **Build Tool:** Next.js built-in bundler
- **CSS Processing:** PostCSS + Autoprefixer

## 🏗 System Architecture

```
tailtally/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API endpoints
│   │   │   ├── appointments/   # Appointment management
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── inventory/     # Inventory operations
│   │   │   ├── owners/        # Customer management
│   │   │   ├── pets/          # Pet management
│   │   │   ├── public/        # Public API endpoints
│   │   │   ├── reports/       # Reporting endpoints
│   │   │   ├── sales/         # Sales operations
│   │   │   ├── settings/      # Settings management
│   │   │   └── users/         # User management
│   │   ├── admin/             # Admin panel
│   │   ├── appointments/      # Appointment interface
│   │   ├── book-appointment/  # Public booking page
│   │   ├── inventory/         # Inventory interface
│   │   ├── owners/           # Customer interface
│   │   ├── pets/             # Pet interface
│   │   ├── reports/          # Reports interface
│   │   ├── sales/            # Sales interface
│   │   └── settings/         # Settings interface
│   ├── components/            # React components
│   │   ├── admin/            # Admin components
│   │   ├── appointments/     # Appointment components
│   │   ├── auth/             # Authentication components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── help/             # Help system
│   │   ├── inventory/        # Inventory components
│   │   ├── owners/           # Customer components
│   │   ├── pets/             # Pet components
│   │   ├── reports/          # Report components
│   │   ├── sales/            # Sales components
│   │   ├── settings/         # Settings components
│   │   └── ui/               # Reusable UI components
│   ├── contexts/             # React Context providers
│   ├── lib/                  # Utility functions
│   └── models/               # MongoDB/Mongoose models
├── public/                   # Static assets
└── config files             # Configuration files
```

## 🚀 Installation

### Prerequisites
- Node.js 18.0 or higher
- MongoDB (Local or Atlas)
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/tailtally.git
cd tailtally
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Environment Setup
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your configuration
```

### Step 4: Configure MongoDB

#### Option A: Local MongoDB
```env
MONGODB_ENV=local
MONGODB_LOCAL_URI=mongodb://localhost:27017/petdb
```

#### Option B: MongoDB Atlas
```env
MONGODB_ENV=atlas
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/petdb
```

### Step 5: Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to access the application.

### Step 6: Create Admin User
1. Navigate to `/auth/signup`
2. Create your first user account
3. This first user will automatically have admin privileges

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGODB_ENV` | MongoDB environment (`local` or `atlas`) | `local` | Yes |
| `MONGODB_LOCAL_URI` | Local MongoDB connection string | - | If local |
| `MONGODB_ATLAS_URI` | MongoDB Atlas connection string | - | If Atlas |
| `MONGODB_DB_NAME` | Database name | `petdb` | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | - | Yes |
| `JWT_EXPIRE` | JWT token expiration | `7d` | Yes |
| `COOKIE_NAME` | Authentication cookie name | `auth_token` | Yes |
| `COOKIE_SECURE` | Secure cookie flag | `false` | Yes |

### Email Configuration (Gmail)
1. Enable 2-Factor Authentication in Google Account
2. Generate App Password at https://myaccount.google.com/apppasswords
3. Configure in Settings → Email Configuration
4. Test with the built-in email tester

### Public Booking Setup
1. Navigate to Settings → Public Booking
2. Enable the public booking system
3. Configure available services and time slots
4. Set booking rules and limits
5. Share the URL: `https://yourdomain.com/book-appointment`

## 📚 Core Modules

### 🏠 Dashboard
- Real-time statistics
- Quick actions
- Recent activities
- Performance metrics

### 📦 Inventory Module
- **Features:**
  - Product catalog management
  - Stock tracking
  - GST/Tax configuration
  - Low stock alerts
  - Bulk operations
  - Purchase orders
  - Expiration tracking

### 🐾 Pet Management
- **Features:**
  - Comprehensive pet profiles
  - Medical history
  - Vaccination tracking
  - Photo management
  - Age calculation
  - Owner association

### 👥 Customer Management
- **Features:**
  - Customer profiles
  - Contact management
  - Visit history
  - Communication preferences
  - Loyalty tracking
  - Notes and tags

### 📅 Appointments
- **Features:**
  - Calendar view
  - Service scheduling
  - Staff assignment
  - Status management
  - Conflict detection
  - Reminders

### 💰 Sales & POS
- **Features:**
  - Quick checkout
  - Product search
  - Discount application
  - Multiple payment methods
  - Receipt generation
  - Return processing

### 📊 Reports
- **Features:**
  - Sales analytics
  - Inventory reports
  - Customer insights
  - Appointment statistics
  - Export functionality

### ⚙️ Settings
- **Features:**
  - Email configuration
  - Public booking settings
  - System preferences
  - User management
  - Role configuration

## 🔌 API Documentation

### Authentication Endpoints
```
POST   /api/auth/signup         # User registration
POST   /api/auth/login          # User login
POST   /api/auth/logout         # User logout
GET    /api/auth/me             # Current user info
PUT    /api/auth/profile        # Update profile
```

### Resource Endpoints
```
# Appointments
GET    /api/appointments        # List appointments
POST   /api/appointments        # Create appointment
GET    /api/appointments/:id    # Get appointment
PUT    /api/appointments/:id    # Update appointment
DELETE /api/appointments/:id    # Delete appointment

# Inventory
GET    /api/inventory           # List products
POST   /api/inventory           # Add product
GET    /api/inventory/:id       # Get product
PUT    /api/inventory/:id       # Update product
DELETE /api/inventory/:id       # Delete product

# Pets
GET    /api/pets                # List pets
POST   /api/pets                # Add pet
GET    /api/pets/:id            # Get pet
PUT    /api/pets/:id            # Update pet
DELETE /api/pets/:id            # Delete pet

# Owners
GET    /api/owners              # List owners
POST   /api/owners              # Add owner
GET    /api/owners/:id          # Get owner
PUT    /api/owners/:id          # Update owner
DELETE /api/owners/:id          # Delete owner

# Sales
GET    /api/sales               # List sales
POST   /api/sales               # Create sale
GET    /api/sales/:id           # Get sale
```

### Public Endpoints
```
GET    /api/public/book-appointment     # Get available slots
POST   /api/public/book-appointment     # Submit booking
GET    /api/settings/public-booking     # Get booking settings
```

## 🔒 Security

### Security Features
- **JWT Authentication** with HTTP-only cookies
- **Role-Based Access Control** (RBAC)
- **Password Hashing** with bcrypt
- **Input Validation** on all endpoints
- **MongoDB Injection Prevention**
- **XSS Protection** via React
- **CSRF Protection** with SameSite cookies
- **Rate Limiting** on public endpoints
- **Secure Email Integration** with app passwords

### Best Practices
- Regular security updates
- Environment variable protection
- Secure session management
- Audit logging
- Data encryption at rest (MongoDB)
- HTTPS enforcement in production

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure no breaking changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using Next.js and React
- UI components powered by Radix UI
- Icons by Lucide React
- Styling with TailwindCSS

## 📞 Support

For support, email support@tailtally.com or open an issue in the GitHub repository.

---

<div align="center">
  <p>Made with ❤️ for Pet Businesses Worldwide</p>
  <p>© 2024 TailTally. All rights reserved.</p>
</div>
