# 🐾 TailTally - Complete Pet Business Management System

<div align="center">
  <img src="/screenshots/tailtally-logo.png" alt="TailTally Logo" width="200" />
  <h1 style="color: #e63946; font-size: 3rem; margin: 20px 0;">TailTally</h1>
  <p><em>Where Technology Meets Tail Wags</em></p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/MongoDB-8.18.0-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Node.js-18.0+-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
</div>

<div align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/Maintained-yes-green.svg?style=flat-square" alt="Maintained" />
  <img src="https://img.shields.io/badge/Version-0.1.0-blue.svg?style=flat-square" alt="Version" />
</div>

<div align="center">
  <h3>🚀 Modern, Feature-Rich POS & Management Solution for Pet Businesses</h3>
  <p>Streamline your pet clinic, store, or grooming business with intelligent automation and comprehensive management tools</p>
  <p>
    <a href="#demo">View Demo</a> •
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#documentation">Documentation</a> •
    <a href="#support">Support</a>
  </p>
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Screenshots](#-screenshots)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Core Modules](#-core-modules)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Performance](#-performance)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [License](#-license)

## 🌟 Overview

TailTally is a comprehensive, enterprise-grade Pet Business Management System designed to revolutionize how pet businesses operate. Built with modern web technologies, it offers a complete solution for managing inventory, appointments, customers, sales, and more - all in one integrated platform.

### 🎯 Perfect For:
- 🏥 **Veterinary Clinics** - Manage appointments, medical records, and prescriptions
- 🛍️ **Pet Stores** - Track inventory, process sales, manage suppliers
- ✂️ **Grooming Salons** - Schedule appointments, track services, manage customers
- 🐕 **Pet Daycares** - Handle check-ins, track pets, manage owners
- 🏨 **Pet Hotels** - Manage bookings, track stays, handle billing
- 🚑 **Emergency Clinics** - Quick patient intake, medical history access

## 📸 Screenshots

<div align="center">
  <h3>Dashboard Overview</h3>
  <img src="/screenshots/dashboard.png" alt="Dashboard" width="800" />
  <p><em>Real-time metrics and insights at a glance</em></p>
</div>

<div align="center">
  <h3>Pet Management</h3>
  <img src="/screenshots/pet-management.png" alt="Pet Management" width="800" />
  <p><em>Comprehensive pet profiles with medical history</em></p>
</div>

<div align="center">
  <h3>Inventory System</h3>
  <img src="/screenshots/inventory.png" alt="Inventory" width="800" />
  <p><em>Advanced inventory tracking with GST support</em></p>
</div>

<div align="center">
  <h3>Point of Sale</h3>
  <img src="/screenshots/pos.png" alt="POS" width="800" />
  <p><em>Fast and intuitive checkout process</em></p>
</div>

<div align="center">
  <h3>Public Booking Portal</h3>
  <img src="/screenshots/public-booking.png" alt="Public Booking" width="800" />
  <p><em>Customer self-service appointment booking</em></p>
</div>

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

### Base URL
```
https://your-domain.com/api
```

### Authentication
The TailTally API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Response Format
All API responses follow this format:
```json
{
  "success": true|false,
  "data": { ... },
  "message": "Success or error message",
  "error": "Error details if applicable"
}
```

### Authentication & User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/logout` | User logout | Yes |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| GET | `/api/users/:id` | Get user details | Yes (Admin) |

### Dashboard & System

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/stats` | Dashboard statistics | Yes |
| GET | `/api/health` | Health check | No |

### Pet Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/pets` | List all pets | Yes |
| POST | `/api/pets` | Create new pet | Yes |
| GET | `/api/pets/:id` | Get pet details | Yes |
| PUT | `/api/pets/:id` | Update pet | Yes |
| DELETE | `/api/pets/:id` | Delete pet | Yes |
| GET | `/api/pets/:id/medical` | Get medical history | Yes |
| POST | `/api/pets/:id/medical` | Add medical record | Yes |
| GET | `/api/pets/:id/vaccinations` | Get vaccinations | Yes |
| POST | `/api/pets/:id/vaccinations` | Add vaccination | Yes |
| POST | `/api/pets/:id/photos` | Upload photo | Yes |
| GET | `/api/pets/notifications` | Pet notifications | Yes |

### Owner/Customer Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/owners` | List all owners | Yes |
| POST | `/api/owners` | Create new owner | Yes |
| GET | `/api/owners/:id` | Get owner details | Yes |
| PUT | `/api/owners/:id` | Update owner | Yes |
| DELETE | `/api/owners/:id` | Delete owner | Yes |
| GET | `/api/owners/notifications` | Owner notifications | Yes |

### Inventory Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/inventory` | List products | Yes |
| POST | `/api/inventory` | Add product | Yes |
| GET | `/api/inventory/:id` | Get product | Yes |
| PUT | `/api/inventory/:id` | Update product | Yes |
| DELETE | `/api/inventory/:id` | Delete product | Yes |
| POST | `/api/inventory/:id/sell` | Record sale | Yes |
| POST | `/api/inventory/bulk-import` | Bulk import | Yes |
| POST | `/api/inventory/purchase` | Record purchase | Yes |
| GET | `/api/inventory/stats` | Inventory stats | Yes |
| GET | `/api/inventory/notifications` | Low stock alerts | Yes |
| GET | `/api/inventory/gst` | GST config | Yes |
| PUT | `/api/inventory/gst` | Update GST | Yes |

### Appointments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/appointments` | List appointments | Yes |
| POST | `/api/appointments` | Create appointment | Yes |
| GET | `/api/appointments/:id` | Get appointment | Yes |
| PUT | `/api/appointments/:id` | Update appointment | Yes |
| DELETE | `/api/appointments/:id` | Delete appointment | Yes |
| POST | `/api/appointments/:id/complete` | Mark complete | Yes |
| GET | `/api/appointments/stats` | Appointment stats | Yes |

### Sales & Invoicing

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/sales` | List sales | Yes |
| POST | `/api/sales` | Create sale | Yes |
| GET | `/api/sales/:id` | Get sale details | Yes |
| GET | `/api/sales/stats` | Sales statistics | Yes |
| GET | `/api/invoices` | List invoices | Yes |
| POST | `/api/invoices/generate` | Generate invoice | Yes |
| GET | `/api/invoices/:id` | Get invoice | Yes |
| POST | `/api/invoices/:id/payment` | Record payment | Yes |

### Reports & Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/reports/sales` | Sales report | Yes |
| GET | `/api/reports/sales/export` | Export sales | Yes |
| GET | `/api/reports/appointments` | Appointments report | Yes |
| GET | `/api/reports/appointments/export` | Export appointments | Yes |
| GET | `/api/reports/pets` | Pet analytics | Yes |
| GET | `/api/reports/owners` | Customer analytics | Yes |

### Settings & Configuration

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/settings/email` | Get email config | Yes |
| POST | `/api/settings/email` | Save email config | Yes |
| POST | `/api/settings/email/test` | Test email | Yes |
| GET | `/api/settings/public-booking` | Get booking config | Yes |
| PUT | `/api/settings/public-booking` | Update booking | Yes |

### Public API (No Authentication Required)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/public/book-appointment` | Available slots | No |
| POST | `/api/public/book-appointment` | Submit booking | No |

### Notifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications` | All notifications | Yes |
| GET | `/api/notifications/count` | Unread count | Yes |

### Development Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/seed/owners` | Generate test owners | Yes (Dev) |
| POST | `/api/seed/pets` | Generate test pets | Yes (Dev) |

### Example Requests

#### Authentication
```bash
# Login
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

#### Create Pet
```bash
curl -X POST https://your-domain.com/api/pets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Max",
    "species": "dog",
    "breed": "Golden Retriever",
    "age": 3,
    "ownerId": "owner-id"
  }'
```

#### Get Inventory with Filters
```bash
curl -X GET "https://your-domain.com/api/inventory?category=food&lowStock=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Error Handling

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

### Rate Limiting
- **Authenticated requests**: 1000 requests per hour
- **Public endpoints**: 100 requests per hour
- Headers include: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Fork/Clone the repository**
2. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```
3. **Deploy**
   ```bash
   vercel
   ```
4. **Set Environment Variables** in Vercel Dashboard

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t tailtally .
docker run -p 3000:3000 --env-file .env.production tailtally
```

### Traditional Server Deployment

1. **Build the application**
   ```bash
   npm run build
   ```
2. **Start production server**
   ```bash
   npm start
   ```
3. **Configure reverse proxy** (Nginx/Apache)
4. **Set up SSL certificate** (Let's Encrypt)
5. **Configure PM2** for process management

## ⚡ Performance

### Optimization Features
- **Server-side rendering** for fast initial loads
- **Image optimization** with Next.js Image component
- **Code splitting** for reduced bundle sizes
- **Database indexing** for fast queries
- **Redis caching** (optional) for session management
- **CDN integration** for static assets

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: 90+
- **Core Web Vitals**: All green

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

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Failed
```bash
# Check MongoDB service
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

#### JWT Secret Missing
```bash
# Generate secure secret
openssl rand -base64 32
```

#### Email Not Sending
1. Check Gmail app password configuration
2. Verify 2FA is enabled
3. Check firewall settings for port 587
4. Test with email configuration tool in settings

### Debug Mode
Enable debug logging:
```env
DEBUG=true
LOG_LEVEL=debug
```

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

## 🗺️ Roadmap

### Version 0.2 (Q1 2025)
- [ ] Mobile application (React Native)
- [ ] Advanced reporting with AI insights
- [ ] Multi-language support
- [ ] Webhook integrations
- [ ] API rate limiting dashboard

### Version 0.3 (Q2 2025)
- [ ] Video consultations
- [ ] Pet health monitoring IoT integration
- [ ] Advanced inventory forecasting
- [ ] Customer mobile app
- [ ] Multi-branch support

### Version 1.0 (Q3 2025)
- [ ] AI-powered diagnostics assistant
- [ ] Blockchain-based medical records
- [ ] Advanced analytics dashboard
- [ ] Third-party integrations marketplace
- [ ] White-label solutions

### Long-term Vision
- Global pet care network
- AI-driven health predictions
- Telemedicine platform
- Pet insurance integration
- Complete ecosystem for pet care

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using Next.js and React
- UI components powered by Radix UI
- Icons by Lucide React
- Styling with TailwindCSS
- Avatar system by DiceBear
- Charts by Recharts
- Date handling by date-fns

### Special Thanks
- All contributors who have helped shape TailTally
- The open-source community for amazing tools
- Pet businesses worldwide for their feedback
- Our furry friends who inspire us daily 🐕🐈

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/tailtally&type=Date)](https://star-history.com/#yourusername/tailtally&Date)

## 💪 Powered By

<div align="center">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" alt="Next.js" width="60" height="60"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="React" width="60" height="60"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" alt="MongoDB" width="60" height="60"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-plain.svg" alt="TailwindCSS" width="60" height="60"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" alt="Node.js" width="60" height="60"/>
</div>

## 📞 Support

### Get Help
- 📧 **Email**: support@tailtally.com
- 💬 **Discord**: [Join our community](https://discord.gg/tailtally)
- 📚 **Documentation**: [docs.tailtally.com](https://docs.tailtally.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/tailtally/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/tailtally/discussions)

### Professional Services
- **Custom Development**: Tailored features for your business
- **Training**: On-site or remote training sessions
- **Priority Support**: 24/7 dedicated support
- **Migration Services**: Data migration from existing systems

## 📊 Statistics

<div align="center">
  <img src="https://img.shields.io/github/stars/yourusername/tailtally?style=social" alt="Stars" />
  <img src="https://img.shields.io/github/forks/yourusername/tailtally?style=social" alt="Forks" />
  <img src="https://img.shields.io/github/watchers/yourusername/tailtally?style=social" alt="Watchers" />
</div>

---

<div align="center">
  <h3>🐾 Join the TailTally Community</h3>
  <p>
    <a href="https://twitter.com/tailtally">Twitter</a> •
    <a href="https://linkedin.com/company/tailtally">LinkedIn</a> •
    <a href="https://youtube.com/tailtally">YouTube</a> •
    <a href="https://blog.tailtally.com">Blog</a>
  </p>
</div>

<div align="center">
  <img src="/screenshots/footer-banner.png" alt="TailTally Footer" width="800" />
  <p>Made with ❤️ for Pet Businesses Worldwide</p>
  <p>© 2024 TailTally. All rights reserved.</p>
  <p>
    <a href="#">Back to Top ⬆️</a>
  </p>
</div>
