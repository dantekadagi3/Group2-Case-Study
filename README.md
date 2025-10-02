# 📚 Modern Bookshop - Full-Stack E-commerce Platform

A comprehensive bookshop e-commerce platform built with Next.js, Supabase, and M-Pesa payment integration. Features include user authentication, shopping cart, admin dashboard, and dark/light theme support.

## ✨ Features

### Customer Features
- 🔐 **User Authentication** - Sign up, login, password reset
- 📖 **Book Catalog** - Browse books by category, search, and filter
- 🛒 **Shopping Cart** - Add/remove items, quantity management
- 💳 **Checkout & Payment** - M-Pesa integration via Quikk API
- 📱 **Responsive Design** - Mobile-first approach
- 🌙 **Dark/Light Theme** - Toggle between themes
- 👤 **User Profile** - Order history and account management

### Admin Features
- 📊 **Dashboard** - Sales analytics and overview
- 💰 **Payment Management** - M-Pesa transaction monitoring
- 📦 **Order Management** - Track and update order statuses
- 📚 **Book Management** - Add, edit, and manage inventory

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Quikk API (M-Pesa)
- **UI Components**: shadcn/ui
- **Theme**: next-themes

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- Quikk API account (for M-Pesa payments)

## 🚀 Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd bookshop-project
npm install
\`\`\`

### 2. Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

#### Environment Variables
Create a `.env.local` file in the root directory:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Payment Configuration (Optional)
QUIKK_API_BASE_URL=https://api.quikk.dev
QUIKK_API_KEY=your_quikk_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
\`\`\`

### 3. Database Setup

Run the SQL scripts in order in your Supabase SQL editor:

\`\`\`bash
# 1. Create database schema
scripts/001_create_database_schema.sql

# 2. Create admin user functionality
scripts/002_create_admin_user.sql

# 3. Create cart table
scripts/003_create_cart_table.sql

# 4. Populate with sample data
scripts/004_populate_authors.sql
scripts/005_populate_categories.sql
scripts/006_populate_books.sql
scripts/007_create_sample_orders.sql
scripts/008_create_sample_reviews.sql
\`\`\`

#### Alternative: Run Scripts via Supabase CLI

\`\`\`bash
# Install Supabase CLI
npm install -g supabase

# Login and link project
supabase login
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
\`\`\`

### 4. Authentication Setup

#### Enable Email Authentication
1. Go to Supabase Dashboard → Authentication → Settings
2. Enable "Enable email confirmations" (optional)
3. Configure email templates if needed

#### Row Level Security (RLS)
The database scripts automatically set up RLS policies. Verify they're enabled:
- Go to Supabase Dashboard → Authentication → Policies
- Ensure all tables have appropriate policies

### 5. Admin User Setup

To create an admin user:

1. Sign up normally through the app
2. Find your user ID in Supabase Dashboard → Authentication → Users
3. Run this SQL in Supabase SQL editor:

\`\`\`sql
-- Replace 'your-user-id' with actual user ID
UPDATE customers 
SET is_admin = true 
WHERE auth_user_id = 'your-user-id';
\`\`\`

Or use the provided script:
\`\`\`sql
-- Update the email in scripts/002_create_admin_user.sql
-- Then run the script
\`\`\`

## 🏃‍♂️ Running the Application

### Development Mode

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000`

### Production Build

\`\`\`bash
npm run build
npm start
\`\`\`

## 📱 Usage Guide

### Customer Flow
1. **Browse Books**: Visit `/books` or `/categories`
2. **Sign Up**: Create account at `/auth/register`
3. **Add to Cart**: Click "Add to Cart" on any book
4. **Checkout**: Go to `/cart` → "Proceed to Checkout"
5. **Payment**: Complete M-Pesa payment process

### Admin Flow
1. **Login**: Use admin credentials
2. **Dashboard**: Access `/admin` for overview
3. **Payments**: Monitor transactions at `/admin/payments`
4. **Orders**: Manage orders at `/admin/orders`

## 🔧 Configuration

### M-Pesa Payment Setup

1. **Get Quikk API Credentials**:
   - Contact dean@quikk.dev for API access
   - Add credentials to environment variables

2. **Test Payments**:
   - Use test phone numbers in development
   - Monitor payment status in admin dashboard

### Theme Configuration

The app supports automatic theme detection and manual toggle:
- System preference detection
- Persistent theme selection
- Smooth transitions between themes

## 📊 Database Schema

### Core Tables
- `customers` - User profiles and admin flags
- `authors` - Book authors information
- `categories` - Book categories
- `books` - Book catalog with inventory
- `orders` - Customer orders
- `order_items` - Order line items
- `payments` - Payment transactions
- `reviews` - Book reviews and ratings
- `cart_items` - Shopping cart persistence

### Key Relationships
- Books → Authors (many-to-one)
- Books → Categories (many-to-one)
- Orders → Customers (many-to-one)
- Order Items → Books (many-to-one)
- Payments → Orders (one-to-one)

## 🔐 Security Features

- **Row Level Security (RLS)** on all tables
- **Authentication middleware** for protected routes
- **Admin role verification** for admin pages
- **Input validation** on all forms
- **SQL injection protection** via Supabase client

## 🚨 Troubleshooting

### Common Issues

#### "useCart must be used within a CartProvider"
- Ensure CartProvider wraps the entire app in `layout.tsx`

#### Database Connection Issues
- Verify environment variables are correct
- Check Supabase project status
- Ensure RLS policies are properly configured

#### Admin Pages Not Accessible
- Verify user has `is_admin = true` in customers table
- Check authentication status
- Ensure middleware is properly configured

#### M-Pesa Payment Failures
- Verify Quikk API credentials
- Check phone number format (+254...)
- Monitor network connectivity
- Review payment logs in admin dashboard

### Debug Mode

Add debug logging by uncommenting console.log statements:

\`\`\`typescript
console.log("[v0] Debug info:", data);
\`\`\`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Payments
- `POST /api/payments/mpesa` - Initiate M-Pesa payment
- `GET /api/payments/status` - Check payment status
- `POST /api/payments/callback` - M-Pesa callback handler

### Books & Cart
- `GET /api/books` - Fetch books with filtering
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart` - Remove cart item

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For technical support:
- Check the troubleshooting section above
- Review Supabase documentation
- Contact the development team

---

**Happy Reading! 📖✨**
