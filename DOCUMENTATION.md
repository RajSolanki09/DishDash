# VINGO - Food Delivery Platform

## Project Documentation

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Project Overview](#2-project-overview)
3. [Objectives](#3-objectives)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture](#5-system-architecture)
6. [Database Design](#6-database-design)
7. [Page Index & Workflow](#7-page-index--workflow)
8. [Component Index](#8-component-index)
9. [API Endpoints Index](#9-api-endpoints-index)
10. [User Roles & Workflows](#10-user-roles--workflows)
11. [Real-Time Features](#11-real-time-features)
12. [Security Implementation](#12-security-implementation)
13. [Third-Party Integrations](#13-third-party-integrations)
14. [Screenshots](#14-screenshots)

---

## 1. Introduction

**Vingo** is a full-stack food delivery web application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. The platform enables customers to browse restaurants, order food, and track deliveries in real-time. It supports three distinct user roles: **Customers**, **Restaurant Owners**, and **Delivery Partners**.

The application replicates the core functionality of popular food delivery services like Swiggy and Zomato, providing a seamless experience from browsing to doorstep delivery.

---

## 2. Project Overview

| Detail | Description |
|---|---|
| **Project Name** | Vingo |
| **Project Type** | Full-Stack Web Application |
| **Architecture** | MERN Stack (MongoDB, Express, React, Node.js) |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT + Google OAuth (Firebase) |
| **Real-Time** | Socket.IO WebSocket |
| **Payment** | Razorpay Gateway |
| **Maps** | Leaflet.js with OpenStreetMap |
| **Firebase Project** | vingo-food-delivery-9c1e1 |

---

## 3. Objectives

1. To develop a complete food ordering and delivery management system
2. To provide real-time order tracking with live delivery boy location
3. To implement role-based access for Customers, Owners, and Delivery Partners
4. To integrate secure online payments via Razorpay
5. To provide analytics dashboard for restaurant owners
6. To implement geospatial queries for finding nearby restaurants and delivery partners

---

## 4. Technology Stack

### 4.1 Frontend Technologies

| Technology | Version | Purpose |
|---|---|---|
| React.js | 19.1.1 | UI Component Library |
| Vite | 7.1.14 | Build Tool & Dev Server |
| React Router DOM | 7.13.0 | Client-Side Routing |
| Redux Toolkit | 2.11.2 | Global State Management |
| React Redux | 9.2.0 | React-Redux Bindings |
| Axios | 1.13.3 | HTTP Client for API Calls |
| Tailwind CSS | 4.1.18 | Utility-First CSS Framework |
| GSAP | 3.14.2 | Animation Library |
| Leaflet / React-Leaflet | 1.9.4 / 5.0.0 | Interactive Maps |
| Socket.IO Client | 4.8.3 | Real-Time Communication |
| Firebase | 12.8.0 | Google Authentication |
| Recharts | 3.8.0 | Data Visualization Charts |
| Lenis | 1.0.42 | Smooth Scrolling |
| Lucide React | 0.577.0 | Icon Library |
| React Hot Toast | 2.6.0 | Toast Notifications |
| React Confetti | 6.4.0 | Celebration Animations |
| date-fns | 4.1.0 | Date Utility Functions |

### 4.2 Backend Technologies

| Technology | Version | Purpose |
|---|---|---|
| Express.js | 5.2.1 | Web Application Framework |
| Mongoose | 9.1.5 | MongoDB Object Data Modeling |
| Socket.IO | 4.8.3 | Real-Time WebSocket Server |
| JSON Web Token | 9.0.3 | Authentication Tokens |
| bcrypt | 6.0.0 | Password Hashing |
| Cloudinary | 2.9.0 | Cloud Image Hosting |
| Multer | 2.0.2 | File Upload Middleware |
| Nodemailer | 7.0.12 | Email Sending Service |
| Razorpay | 2.9.6 | Payment Gateway |
| Cookie Parser | 1.4.7 | HTTP Cookie Parsing |
| CORS | 2.8.6 | Cross-Origin Resource Sharing |
| dotenv | 17.2.3 | Environment Variables |

### 4.3 Database

| Technology | Purpose |
|---|---|
| MongoDB | NoSQL Document Database |
| MongoDB Atlas | Cloud Database Hosting |
| 2dsphere Index | Geospatial Queries |

---

## 5. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  React.js    │  │ Redux    │  │  Socket.IO       │  │
│  │  Components  │  │ Store    │  │  Client          │  │
│  └──────────────┘  └──────────┘  └──────────────────┘  │
│         │                │               │               │
│         └────────────────┼───────────────┘               │
│                          │                               │
└──────────────────────────┼───────────────────────────────┘
                           │ HTTPS / WSS
┌──────────────────────────┼───────────────────────────────┐
│                    SERVER (Node.js)                       │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Express.js  │  │ JWT      │  │  Socket.IO       │  │
│  │  Routes      │  │ Auth     │  │  Server          │  │
│  └──────────────┘  └──────────┘  └──────────────────┘  │
│         │                │               │               │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Controllers  │  │ Multer   │  │  Nodemailer      │  │
│  │              │  │ Cloudinary│  │                  │  │
│  └──────────────┘  └──────────┘  └──────────────────┘  │
│                          │                               │
└──────────────────────────┼───────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────┐
│                    DATABASE (MongoDB)                     │
│  ┌──────┐ ┌──────┐ ┌───────┐ ┌───────┐ ┌────────────┐ │
│  │ User │ │ Shop │ │ Item  │ │ Order │ │ Assignment │ │
│  └──────┘ └──────┘ └───────┘ └───────┘ └────────────┘ │
│  ┌──────────┐                                            │
│  │ Review   │                                            │
│  └──────────┘                                            │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Database Design

### 6.1 Entity Relationship Diagram

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│   User   │────<│   Shop   │>────│   Item   │
│          │     │          │     │          │
│ -fullname│     │ -name    │     │ -name    │
│ -email   │     │ -image   │     │ -image   │
│ -password│     │ -city    │     │ -price   │
│ -mobile  │     │ -state   │     │ -category│
│ -role    │     │ -address │     │ -foodType│
│ -location│     │ -location│     │ -rating  │
│ -favorites    │ -isOpen  │     │ -isAvail │
└──────────┘     └──────────┘     └──────────┘
      │                │                │
      │           ┌──────────┐          │
      └──────────>│  Order   │<─────────┘
                  │          │
                  │ -payment │
                  │ -address │
                  │ -amount  │
                  │ -shopOrders│
                  └──────────┘
                       │
                  ┌──────────┐     ┌──────────┐
                  │ Delivery │────>│  Review   │
                  │Assignment│     │          │
                  │          │     │ -rating  │
                  │ -status  │     │ -comment │
                  └──────────┘     └──────────┘
```

### 6.2 User Model

| Field | Type | Description |
|---|---|---|
| fullname | String | Full name of the user (Required) |
| email | String | Email address (Required, Unique) |
| password | String | Hashed password (Optional for Google auth) |
| mobile | String | Phone number (Required) |
| role | String | Enum: "user", "owner", "deliveryBoy" |
| socketId | String | Socket.IO connection identifier |
| isOnline | Boolean | Online status (Default: false) |
| resetOtp | String | OTP for password reset |
| isOtpVerified | Boolean | OTP verification status |
| otpExpires | Date | OTP expiration timestamp |
| location | GeoJSON | 2dsphere indexed coordinates |
| favorites | [ObjectId] | Referenced favorite items |
| isDutyOn | Boolean | Delivery boy duty toggle (Default: true) |
| createdAt | Date | Account creation timestamp |
| updatedAt | Date | Last update timestamp |

### 6.3 Shop Model

| Field | Type | Description |
|---|---|---|
| name | String | Restaurant name (Required) |
| image | String | Cloudinary image URL (Required) |
| owner | ObjectId | Reference to User (Owner) |
| city | String | City name (Required) |
| state | String | State name (Required) |
| address | String | Full address (Required) |
| items | [ObjectId] | References to Item documents |
| location | GeoJSON | 2dsphere indexed coordinates |
| isOpen | Boolean | Shop status (Default: true) |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp |

### 6.4 Item Model

| Field | Type | Description |
|---|---|---|
| name | String | Item name (Required) |
| image | String | Cloudinary image URL (Required) |
| shop | ObjectId | Reference to Shop |
| category | String | Enum: Snacks, Main Course, Dessert, Pizza, Burger, Sandwiches, North Indian, South Indian, Chinese, Fast Food, Others |
| price | Number | Item price (Required, Min: 0) |
| foodType | String | Enum: "veg", "non-veg" |
| rating | Object | { average: Number, count: Number } |
| isAvailable | Boolean | Availability status (Default: true) |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp |

### 6.5 Order Model

| Field | Type | Description |
|---|---|---|
| user | ObjectId | Reference to User (Customer) |
| paymentMethod | String | Enum: "cod", "online" |
| deliveryAddress | Object | { text, latitude, longitude } |
| totalAmount | Number | Total order amount (Required) |
| shopOrders | [ShopOrder] | Embedded shop order documents |
| payment | Boolean | Payment status (Default: false) |
| razorpayOrderId | String | Razorpay order ID |
| razorpayPaymentId | String | Razorpay payment ID |
| createdAt | Date | Order creation timestamp |
| updatedAt | Date | Last update timestamp |

#### ShopOrder (Embedded Sub-Document)

| Field | Type | Description |
|---|---|---|
| shop | ObjectId | Reference to Shop |
| owner | ObjectId | Reference to Owner |
| subTotal | Number | Subtotal for this shop |
| shopOrderItems | [Object] | Items: { item, name, price, quantity } |
| status | String | Enum: "pending", "preparing", "out of delivery", "delivered" |
| assignment | ObjectId | Reference to DeliveryAssignment |
| deliveryOtp | String | OTP for delivery verification |
| assignedDeliveryBoy | ObjectId | Reference to delivery boy |
| deliveredAt | Date | Delivery timestamp |
| deliveryEarning | Number | Delivery fee (₹50) |

### 6.6 DeliveryAssignment Model

| Field | Type | Description |
|---|---|---|
| order | ObjectId | Reference to Order |
| shop | ObjectId | Reference to Shop |
| shopOrderId | ObjectId | Shop order sub-document ID |
| broadcastedTo | [ObjectId] | Delivery boys notified |
| assignedTo | ObjectId | Delivery boy who accepted |
| status | String | Enum: "broadcasted", "assigned", "expired", "completed" |
| acceptedAt | Date | Acceptance timestamp |

### 6.7 Review Model

| Field | Type | Description |
|---|---|---|
| user | ObjectId | Reference to User (Reviewer) |
| item | ObjectId | Reference to Item |
| shop | ObjectId | Reference to Shop |
| rating | Number | Rating value (1-5) |
| comment | String | Review text (Required) |
| createdAt | Date | Review creation timestamp |
| updatedAt | Date | Last update timestamp |

---

## 7. Page Index & Workflow

### 7.1 Complete Page Directory

| Sr. No. | Page Name | Route | Auth Required | Description |
|---|---|---|---|---|
| 1 | Home | `/` | No | Entry point - shows LandingPage or role-specific dashboard |
| 2 | Landing Page | `/` (when logged out) | No | Marketing page with hero, stats, features, role cards |
| 3 | Sign Up | `/signup` | No | User registration with role selection |
| 4 | Sign In | `/signin` | No | Login with email/password or Google Auth |
| 5 | Forgot Password | `/forgot-password` | No | OTP-based 3-step password reset |
| 6 | Profile | `/profile` | Yes | View/edit user profile |
| 7 | About Us | `/about` | No | Static about page |
| 8 | Create/Edit Shop | `/create-edit-shop` | Yes | Shop registration form for owners |
| 9 | Add Item | `/add-item` | Yes | Add new menu item form |
| 10 | Edit Item | `/edit-item/:itemId` | Yes | Edit existing menu item |
| 11 | Cart | `/cart` | Yes | Shopping cart with order summary |
| 12 | Checkout | `/checkOut` | Yes | Address selection and payment |
| 13 | Order Placed | `/order-placed` | Yes | Order confirmation with confetti |
| 14 | My Orders (User) | `/my-orders` | Yes | Customer order history |
| 15 | Owner Orders | `/owner-orders` | Yes | Owner order management |
| 16 | Track Order | `/track-order/:orderId` | Yes | Live order tracking |
| 17 | Shop | `/shop/:shopId` | Yes | Individual restaurant page |
| 18 | Favorites | `/favorites` | Yes | Favorited food items |
| 19 | Delivery Dashboard | `/delivery-orders` | Yes | Delivery partner dashboard |

### 7.2 Application Flow Diagram

```
                        ┌──────────────┐
                        │  LANDING     │
                        │  PAGE        │
                        └──────┬───────┘
                               │
                    ┌──────────┼──────────┐
                    ▼          ▼          ▼
              ┌──────────┐ ┌───────┐ ┌──────────┐
              │  SIGN UP │ │ SIGN  │ │  ABOUT   │
              │          │ │  IN   │ │   US     │
              └────┬─────┘ └───┬───┘ └──────────┘
                   │           │
                   └─────┬─────┘
                         ▼
                  ┌──────────────┐
                  │    HOME      │
                  │  DASHBOARD   │
                  └──────┬───────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   ┌───────────┐  ┌───────────┐  ┌───────────────┐
   │ CUSTOMER  │  │  OWNER    │  │ DELIVERY BOY  │
   │ DASHBOARD │  │ DASHBOARD │  │   DASHBOARD   │
   └─────┬─────┘  └─────┬─────┘  └───────┬───────┘
         │              │                  │
    ┌────┼────┐    ┌────┼────┐      ┌─────┼─────┐
    ▼    ▼    ▼    ▼    ▼    ▼      ▼           ▼
  Shop Cart  Orders  Items Orders  Assignments  Earnings
    │    │    │     │     │              │
    ▼    ▼    ▼     ▼     ▼              ▼
  Item Check Track  Edit  Status    Mark Delivered
  Page out   Order  Item  Update
         │                    │
         ▼                    ▼
    Order Placed          Analytics
```

---

## 8. Component Index

### 8.1 Navigation & Layout Components

| Component | File Path | Description |
|---|---|---|
| Nav | `frontend/src/components/Nav.jsx` | Fixed navigation bar with role-based menu, search, cart badge, notifications, dark mode toggle |
| SmoothScroll | `frontend/src/components/SmoothScroll.jsx` | Lenis smooth scrolling wrapper |
| CustomCursor | `frontend/src/components/CustomCursor.jsx` | GSAP-powered custom cursor with magnetic effect |
| PageRouteLoader | `frontend/src/components/PageRouteLoader.jsx` | Branded loading spinner for lazy routes |
| ErrorBoundary | `frontend/src/components/ErrorBoundary.jsx` | React error boundary with reload/home options |

### 8.2 Customer Components

| Component | File Path | Description |
|---|---|---|
| UserDashboard | `frontend/src/components/UserDashboard.jsx` | Customer home with categories, restaurants, food items |
| FoodCart | `frontend/src/components/FoodCart.jsx` | Food item card with add-to-cart, favorites, rating |
| CartItemCard | `frontend/src/components/CartItemCard.jsx` | Cart item row with quantity controls |
| UserOrderCard | `frontend/src/components/UserOrderCard.jsx` | Customer order card with tracking and review |
| OrderStepper | `frontend/src/components/OrderStepper.jsx` | Visual order progress (4 steps) |
| CategoryCard | `frontend/src/components/CategoryCard.jsx` | Circular category selection card |
| ReviewForm | `frontend/src/components/ReviewForm.jsx` | Star rating and comment submission |
| ReviewList | `frontend/src/components/ReviewList.jsx` | Display reviews with user info |

### 8.3 Owner Components

| Component | File Path | Description |
|---|---|---|
| OwnerDashboard | `frontend/src/components/OwnerDashboard.jsx` | Owner home with inventory and analytics tabs |
| OwnerItemCard | `frontend/src/components/OwnerItemCard.jsx` | Owner menu item with edit/delete/availability |
| OwnerOrderCard | `frontend/src/components/OwnerOrderCard.jsx` | Owner order management with status dropdown |
| AnalyticsDashboard | `frontend/src/components/AnalyticsDashboard.jsx` | Revenue, orders, charts, top items |

### 8.4 Delivery Partner Components

| Component | File Path | Description |
|---|---|---|
| DeliveryBoy | `frontend/src/components/DeliveryBoy.jsx` | Dashboard with earnings, active delivery, orders |
| DeliveryBoyTraking | `frontend/src/components/DeliveryBoyTraking.jsx` | Leaflet map with live location tracking |

### 8.5 Utility Components

| Component | File Path | Description |
|---|---|---|
| Skeleton | `frontend/src/components/Skeleton.jsx` | Loading placeholders (rect, circle, text, card) |
| Magnetic | `frontend/src/components/Magnetic.jsx` | Magnetic hover effect |

---

## 9. API Endpoints Index

### 9.1 Authentication Routes (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | No | Register new user |
| POST | `/signin` | No | Login user |
| GET | `/signout` | No | Logout user |
| POST | `/send-otp` | No | Send password reset OTP |
| POST | `/verify-otp` | No | Verify reset OTP |
| POST | `/reset-password` | No | Reset password |
| POST | `/google-auth` | No | Google OAuth login |

### 9.2 User Routes (`/api/user`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/current` | Yes | Get current user |
| GET | `/:userId` | Yes | Get user by ID |
| POST | `/update-location` | Yes | Update GPS location |
| PUT | `/update-profile` | Yes | Update profile details |
| POST | `/toggle-favorite` | Yes | Toggle favorite item |
| GET | `/get-favorites` | Yes | Get all favorites |
| POST | `/toggle-duty` | Yes | Toggle delivery duty |

### 9.3 Shop Routes (`/api/shop`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/create-edit` | Yes | Create or edit shop |
| GET | `/get-my` | Yes | Get owner's shop |
| GET | `/get-by-city/:city` | Yes | Get shops by city |
| GET | `/get-shop-details/:shopId` | No | Get shop details |
| POST | `/toggle-status` | Yes | Toggle open/closed |
| GET | `/analytics` | Yes | Get shop analytics |

### 9.4 Item Routes (`/api/item`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/add-item` | Yes | Add new item |
| PUT | `/edit-item/:itemId` | Yes | Edit item |
| GET | `/get-item-by-id/:itemId` | Yes | Get item by ID |
| DELETE | `/delete/:itemId` | Yes | Delete item |
| GET | `/get-by-city/:city` | Yes | Get items by city |
| GET | `/search-items` | No | Search items |
| POST | `/rating` | Yes | Rate an item |
| POST | `/toggle-availability/:itemId` | Yes | Toggle availability |

### 9.5 Order Routes (`/api/order`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/place-order` | Yes | Place new order |
| POST | `/verify-payment` | Yes | Verify Razorpay payment |
| GET | `/my-orders` | Yes | Get user/owner orders |
| POST | `/update-status/:orderId/:shopId` | Yes | Update order status |
| GET | `/get-assignment` | Yes | Get delivery assignments |
| GET | `/get-current-order` | Yes | Get current assignment |
| POST | `/accept-order/:assignmentId` | Yes | Accept assignment |
| GET | `/get-order-by-id/:orderId` | Yes | Get order details |
| POST | `/send-delivery-otp` | Yes | Send delivery OTP |
| POST | `/verify-delivery-otp` | Yes | Verify delivery OTP |
| GET | `/get-today-deliveries` | Yes | Today's delivery stats |
| GET | `/get-all-time-earnings` | Yes | All-time earnings |
| POST | `/reorder/:orderId` | Yes | Reorder previous order |

### 9.6 Review Routes (`/api/review`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/add` | Yes | Add review |
| GET | `/item/:itemId` | No | Get item reviews |
| GET | `/shop/:shopId` | No | Get shop reviews |

---

## 10. User Roles & Workflows

### 10.1 Customer Workflow

```
┌─────────────────────────────────────────────────────────┐
│                  CUSTOMER WORKFLOW                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Visit Landing Page (/)                              │
│       │                                                 │
│  2. Sign Up (/signup) → Select "Customer" role          │
│       │                                                 │
│  3. Sign In (/signin) → JWT cookie set                  │
│       │                                                 │
│  4. UserDashboard → Browse categories & restaurants     │
│       │                                                 │
│  5. Click Restaurant → Shop Page (/shop/:shopId)        │
│       │                                                 │
│  6. Add Items to Cart → Cart (/cart)                    │
│       │                                                 │
│  7. Checkout (/checkOut) → Select location on map       │
│       │   → Choose payment (COD/Online)                 │
│       │                                                 │
│  8. Order Placed (/order-placed) → Confetti             │
│       │                                                 │
│  9. Track Order (/track-order/:orderId)                 │
│       │   → Status stepper → Live delivery tracking     │
│       │                                                 │
│  10. After Delivery → Review items (1-5 stars)          │
│       │                                                 │
│  11. Reorder from history (/my-orders)                  │
│       │                                                 │
│  12. Manage Favorites (/favorites)                      │
│       │                                                 │
│  13. Edit Profile (/profile)                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 10.2 Restaurant Owner Workflow

```
┌─────────────────────────────────────────────────────────┐
│               RESTAURANT OWNER WORKFLOW                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Sign Up (/signup) → Select "Restaurant" role        │
│       │                                                 │
│  2. Sign In (/signin)                                   │
│       │                                                 │
│  3. OwnerDashboard → "Register Restaurant" CTA          │
│       │                                                 │
│  4. Create Shop (/create-edit-shop)                     │
│       │   → Shop name, address, image, GPS location     │
│       │                                                 │
│  5. Dashboard → Menu Items Tab + Sales Insights Tab     │
│       │                                                 │
│  6. Add Item (/add-item)                                │
│       │   → Name, price, category, food type, image     │
│       │                                                 │
│  7. Edit Item (/edit-item/:itemId)                      │
│       │                                                 │
│  8. Toggle Availability (In Stock / Out of Stock)       │
│       │                                                 │
│  9. Delete Item (with confirmation modal)               │
│       │                                                 │
│  10. Manage Orders (/owner-orders)                      │
│        │   → View customer details                      │
│        │   → Update status: pending → preparing         │
│        │                → out of delivery → delivered    │
│        │                                                │
│  11. Analytics Dashboard                                │
│        │   → Total revenue, total orders                │
│        │   → Revenue chart (last 7 days)                │
│        │   → Top selling items                          │
│        │                                                │
│  12. Toggle Shop Status (/profile)                      │
│        → Open Shop / Close For Today                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 10.3 Delivery Partner Workflow

```
┌─────────────────────────────────────────────────────────┐
│              DELIVERY PARTNER WORKFLOW                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Sign Up (/signup) → Select "Rider" role             │
│       │                                                 │
│  2. Sign In (/signin)                                   │
│       │                                                 │
│  3. Delivery Dashboard (/delivery-orders)               │
│       │   → Today's earnings & deliveries               │
│       │   → Hourly bar chart                            │
│       │                                                 │
│  4. Duty Toggle → Start/Stop receiving orders           │
│       │                                                 │
│  5. GPS Tracking → Live location sent via Socket.IO     │
│       │                                                 │
│  6. Receive Assignment (Socket event: newAssignment)    │
│       │   → View shop, customer, payout (₹50)           │
│       │                                                 │
│  7. Accept Order → "Accept Route"                       │
│       │   → Assignment marked as assigned               │
│       │   → Other delivery boys notified                │
│       │                                                 │
│  8. Navigate → Customer location on map                 │
│       │                                                 │
│  9. Mark Delivered                                      │
│       │   → OTP sent to customer email                  │
│       │   → Enter OTP → Order delivered                 │
│       │   → ₹50 earning recorded                        │
│       │                                                 │
│  10. View Earnings → Today's stats + all-time history   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 11. Real-Time Features

### 11.1 Socket.IO Events

#### Server to Client Events

| Event | Description | Recipients |
|---|---|---|
| `newOrder` | Notifies new order received | Shop Owner |
| `update-status` | Order status changed | User, Owner, Delivery Boy |
| `delivery-boy-assigned` | Delivery partner assigned | User, Owner |
| `newAssignment` | Available delivery order | Nearby Delivery Boys |
| `delivery-otp-sent` | Delivery OTP sent | Customer |
| `updateDeliveryLocation` | Live GPS coordinates | User (tracking) |
| `earning-updated` | Delivery earning recorded | Delivery Boy |

#### Client to Server Events

| Event | Description |
|---|---|
| `identity` | Register user with socket ID |
| `updateLocation` | Send delivery boy GPS coordinates |

### 11.2 Real-Time Order Tracking

```
Order Status Flow:

  ┌─────────┐    ┌───────────┐    ┌─────────────────┐    ┌───────────┐
  │ PENDING │───>│ PREPARING │───>│ OUT OF DELIVERY │───>│ DELIVERED │
  └─────────┘    └───────────┘    └─────────────────┘    └───────────┘
       │              │                    │                    │
       │              │          Delivery Boy accepts    OTP verified
       │              │          Live map tracking       ₹50 earned
       │              │
   Owner sees    Owner marks
   new order     preparing
```

---

## 12. Security Implementation

### 12.1 Authentication

- **JWT Tokens**: Stored in HTTP-only cookies with 7-day expiry
- **Password Hashing**: bcrypt with salt rounds
- **Google OAuth**: Firebase Authentication for social login
- **Protected Routes**: Middleware validates JWT on each API request

### 12.2 Password Reset Flow

1. User enters email → 4-digit OTP sent via Nodemailer
2. OTP expires in 5 minutes
3. User verifies OTP → Sets new password
4. Password hashed with bcrypt before storing

### 12.3 Delivery Verification

- OTP-based delivery confirmation sent to customer's email
- Delivery boy must enter correct OTP to mark delivery complete
- Prevents unauthorized delivery confirmation

### 12.4 Payment Security

- Razorpay signature verification on payment completion
- Server-side amount validation
- Secure payment flow with order creation and verification

---

## 13. Third-Party Integrations

| Service | Purpose |
|---|---|
| **MongoDB Atlas** | Cloud database hosting |
| **Cloudinary** | Image upload, storage, and CDN |
| **Firebase** | Google OAuth authentication |
| **Razorpay** | Online payment gateway |
| **Nodemailer (Gmail)** | Email service for OTP |
| **BigDataCloud API** | Reverse geocoding (coordinates to city) |
| **OpenStreetMap (Leaflet)** | Interactive map tiles |
| **Socket.IO** | Real-time WebSocket communication |

---

## 14. Redux State Management

### Store Configuration

```
Redux Store
├── userSlice (user state, cart, orders, notifications)
├── ownerSlice (shop data)
└── mapSlice (location and address)
```

### userSlice State

| Property | Type | Description |
|---|---|---|
| userData | Object | Current user information |
| city | String | User's current city |
| currentState | String | User's current state |
| currentAddress | String | User's current address |
| shopsInMyCity | Array | Restaurants in user's city |
| itemsInMyCity | Array | Food items in user's city |
| cartItems | Array | Shopping cart items |
| totalAmount | Number | Cart total amount |
| myOrders | Array | User's order history |
| notifications | Array | Real-time notifications |
| searchResults | Array | Search results |
| socket | Object | Socket.IO instance |
| favoriteItems | Array | Favorited food items |

### Custom Hooks

| Hook | Purpose |
|---|---|
| `useGetCurrentUser` | Fetch and set current user on mount |
| `useGetCity` | Get GPS location and reverse geocode to city |
| `useGetMyShop` | Fetch owner's shop data |
| `useGetShopByCity` | Fetch restaurants in user's city |
| `useGetItemsByCity` | Fetch food items in user's city |
| `useGetMyOrders` | Fetch user's order history |
| `useUpdateLocation` | Track delivery boy GPS position |

---

## 15. Project Folder Structure

```
Vingo MERN-Project/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── shop.controller.js
│   │   ├── item.controller.js
│   │   ├── order.controllers.js
│   │   └── review.controller.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── shop.model.js
│   │   ├── item.model.js
│   │   ├── order.model.js
│   │   ├── deliveryAssignment.model.js
│   │   └── review.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── shop.routes.js
│   │   ├── item.routes.js
│   │   ├── order.routes.js
│   │   └── review.routes.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   └── multer.js
│   ├── utils/
│   │   ├── cloudinary.js
│   │   └── mail.js
│   ├── socket/
│   │   └── socket.js
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Nav.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── DeliveryBoy.jsx
│   │   │   ├── FoodCart.jsx
│   │   │   ├── CartItemCard.jsx
│   │   │   ├── UserOrderCard.jsx
│   │   │   ├── OwnerOrderCard.jsx
│   │   │   ├── OrderStepper.jsx
│   │   │   ├── AnalyticsDashboard.jsx
│   │   │   ├── OwnerItemCard.jsx
│   │   │   ├── CategoryCard.jsx
│   │   │   ├── DeliveryBoyTraking.jsx
│   │   │   ├── ReviewForm.jsx
│   │   │   ├── ReviewList.jsx
│   │   │   ├── PageRouteLoader.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── SmoothScroll.jsx
│   │   │   ├── CustomCursor.jsx
│   │   │   └── Magnetic.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── AboutUs.jsx
│   │   │   ├── CreateEditShop.jsx
│   │   │   ├── AddItem.jsx
│   │   │   ├── EditItem.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckOut.jsx
│   │   │   ├── OrderPlaced.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── TrackOrderPage.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── Favorites.jsx
│   │   │   └── Deliverydashboard.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   ├── userSlice.js
│   │   │   ├── ownerSlice.js
│   │   │   └── mapSlice.js
│   │   ├── hooks/
│   │   │   ├── useGetCurrentUser.js
│   │   │   ├── useGetCity.js
│   │   │   ├── useGetMyShop.js
│   │   │   ├── useGetShopByCity.js
│   │   │   ├── useGetItemsByCity.js
│   │   │   ├── useGetMyOrders.js
│   │   │   └── useUpdateLocation.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── package.json
└── DOCUMENTATION.md
```

---

## Conclusion

Vingo is a comprehensive food delivery platform that demonstrates the power of the MERN stack in building real-time, feature-rich web applications. The project showcases modern web development practices including role-based access control, real-time WebSocket communication, geospatial database queries, third-party API integrations, and responsive UI design.

The three-role system (Customer, Owner, Delivery Partner) provides a complete end-to-end food ordering and delivery experience, making it a practical demonstration of full-stack development skills.

---

*Document prepared for academic submission.*
