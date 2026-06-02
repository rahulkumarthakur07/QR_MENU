# QR Menu

A full-stack restaurant QR-menu ordering application with owner dashboard, menu management, QR table generation, and location-aware ordering.

## Project Overview

This project is a two-part application:

- `backend/`: Express + MongoDB API for authentication, business management, categories, products, tables, orders, uploads, and public menu access.
- `frontend/`: React + Vite customer and admin UI for logging in, managing business settings, products, tables, orders, and viewing the public menu.

The app allows restaurant owners to:

- manage business details and location geofencing
- create categories and products
- generate QR-enabled table menu links
- track orders and update order status
- upload images via imgbb
- bulk upload products from CSV

Guests can:

- open QR menu links per table
- browse categories and products
- add items to a cart
- place orders with location verification

## Tech Stack

### Backend

- Node.js
- Express 5
- MongoDB / Mongoose
- JSON Web Tokens (JWT)
- bcryptjs for password hashing
- multer for CSV upload handling
- qrcode for QR code generation
- axios for external image upload to imgbb
- dotenv for environment configuration

### Frontend

- React 19
- Vite
- React Router DOM
- Axios
- Lucide React icons
- ESLint

## Folder Structure

```
Qr-Menu/
├── backend/
│   ├── config/              # DB setup
│   ├── controllers/         # Route business logic
│   ├── middleware/          # Auth and error handling
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   └── server.js            # Express app entrypoint
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance
│   │   ├── components/      # UI components
│   │   ├── context/         # Auth and cart context
│   │   ├── pages/           # App views and pages
│   │   └── App.jsx          # Route definitions
└── README.md
```

## Backend API Routes

### Authentication

- `POST /api/auth/register`
  - body: `{ name, email, password }`
  - returns: user and JWT token
- `POST /api/auth/login`
  - body: `{ email, password }`
  - returns: user and JWT token
- `GET /api/auth/me`
  - protected: requires `Authorization: Bearer <token>`
  - returns: authenticated user

### Business

- `POST /api/business`
  - protected
  - create restaurant business details
  - body: `{ businessName, logoUrl, address, lat, lng, geoFenceRadius }`
- `GET /api/business/my-business`
  - protected
  - get business owned by logged-in user
- `PUT /api/business/:id`
  - protected
  - update business data

### Categories

- `POST /api/categories`
  - protected
  - create a category for a business
  - body: `{ businessId, name }`
- `GET /api/categories/:businessId`
  - get categories for a business
- `PUT /api/categories/:id`
  - protected
  - update category name
- `DELETE /api/categories/:id`
  - protected
  - remove a category

### Products

- `POST /api/products`
  - protected
  - create a product
  - body: `{ businessId, categoryId, name, description, price, imageUrl }`
- `POST /api/products/bulk-upload`
  - protected
  - bulk import products from CSV file
  - field name: `file`
- `GET /api/products/:businessId`
  - list products for a business
- `PUT /api/products/:id`
  - protected
  - update product fields
- `DELETE /api/products/:id`
  - protected
  - delete product

### Tables / QR Codes

- `POST /api/tables/generate`
  - protected
  - generate table records and QR codes for a business
  - body: `{ businessId, numberOfTables }`
- `GET /api/tables/:businessId`
  - protected
  - get table list for a business
- `PUT /api/tables/:id/reset`
  - protected
  - reset a table QR token and menu URL
- `DELETE /api/tables/:id`
  - protected
  - delete a table

### Orders

- `POST /api/orders/check-location`
  - validate customer against restaurant geofence
  - body: `{ businessId, customerLat, customerLng }`
- `POST /api/orders`
  - place an order
  - body: `{ businessId, tableNumber, items, totalAmount, customerLat, customerLng }`
- `GET /api/orders/business/:businessId`
  - protected
  - list orders for a business owner
- `PATCH /api/orders/:id/status`
  - protected
  - update order status

### Uploads

- `POST /api/upload/image`
  - protected
  - upload base64 image payload to imgbb
  - body: `{ imageBase64 }`

### Public Menu

- `GET /api/public/business/:businessId`
  - get public business details
- `GET /api/public/menu/:businessId`
  - get categories and available products
- `GET /api/public/table/:businessId/:tableNumber/:token?`
  - validate QR table link and token

## Frontend Routes

- `/login` - login page
- `/register` - registration page
- `/dashboard` - owner dashboard
- `/dashboard/business` - business settings
- `/dashboard/products` - products management
- `/dashboard/tables` - table and QR generation
- `/dashboard/orders` - order management
- `/menu/:businessId/table/:tableNumber/:token?` - public menu view
- `/cart/:businessId/table/:tableNumber/:token?` - customer cart and checkout

Private dashboard routes require authentication and redirect to `/login` if not logged in.

## Data Models

### User

- `name`, `email`, `password`, `role`

### Business

- `ownerId`, `businessName`, `logoUrl`, `address`
- `location.lat`, `location.lng`, `geoFenceRadius`

### Category

- `businessId`, `name`

### Product

- `businessId`, `categoryId`, `name`, `description`, `price`, `imageUrl`, `isAvailable`

### Table

- `businessId`, `tableNumber`, `menuUrl`, `qrCodeDataUrl`, `token`, `isActive`

### Order

- `businessId`, `tableId`, `tableNumber`, `items`, `totalAmount`
- `customerLocation`, `status`

## Environment Variables

### Backend `.env`

Required environment variables:

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `FRONTEND_URL` - frontend URL used for QR menu link generation
- `IMGBB_API_KEY` - imgbb API key for image uploads

### Frontend

- `VITE_API_URL` - backend API base URL

## How to Run

### 1. Setup backend

```bash
cd backend
npm install
```

Create `.env` and add:

```bash
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
IMGBB_API_KEY=your_imgbb_api_key
```

Start backend:

```bash
npm run dev
```

### 2. Setup frontend

```bash
cd ../frontend
npm install
npm run dev
```
## env
create a .env file and add 
VITE_API_URL=http://localhost:5000/ 


Open the frontend URL shown by Vite, typically `http://localhost:5173`.

## Usage Notes

- The frontend stores JWT tokens in `localStorage` and adds them to API requests.
- Public menu access is driven by QR table links like:
  - `/menu/:businessId/table/:tableNumber/:token?`
- The cart page uses browser geolocation to validate orders against the restaurant geofence.
- Product bulk upload accepts CSV content with headers such as `name`, `description`, `price`, `imageUrl`, and either `categoryId` or `categoryName`.

## Additional Details

- The backend uses `express.json()` and `express.urlencoded()` to parse JSON and form data.
- Tables are stored with QR code data URLs generated by `qrcode`.
- The app supports both authenticated owner flows and anonymous customer menu flows.

---

