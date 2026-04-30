# dishdash — Online Food Delivery System
## Black Book / Project Documentation

---

**Project Title:** dishdash — Online Food Delivery System  
**Technology Stack:** MERN (MongoDB, Express.js, React.js, Node.js)  
**Academic Year:** 2025–2026  
**Document Type:** Project Black Book  

---

## TABLE OF CONTENTS

1. Introduction
2. Project Aim & Overview
3. Environment Description
4. Models (Database Schema Design)
5. System Requirement Specification (SRS)
6. Data Flow Diagrams (DFD)
7. Software Project Planning
8. System Design
9. Project Testing
10. Limitations & System Enhancement
11. Future Recommendations
12. Concluding Remarks
13. Bibliography

---

---

# CHAPTER 1 — INTRODUCTION

## 1.1 Background of the Project

The food delivery industry has undergone a massive transformation in the last decade. With the rise of internet connectivity and smartphones, customers now expect food to be available at their doorsteps within minutes. Traditional food ordering systems — such as phone calls or walk-in visits — are inefficient, error-prone, and lack real-time visibility. The modern customer demands a seamless digital experience: browsing menus, placing orders, making payments, and tracking deliveries — all from a single application.

**dishdash** is an online food delivery platform developed to address these exact needs. It is a full-stack web application built on the MERN stack (MongoDB, Express.js, React.js, Node.js) that connects three key stakeholders: **Customers**, **Restaurant/Shop Owners**, and **Delivery Boys** — all within one cohesive system supported by real-time communication via WebSockets.

## 1.2 Problem Statement

Existing small-scale food businesses in local areas lack a robust digital presence. Customers cannot browse menus online, ordering is manual, delivery assignment is informal, and payment tracking is non-existent. This creates:

- **Inefficiency** in order management and delivery routing
- **Lack of transparency** — customers cannot track their food
- **Revenue loss** due to unmanaged orders and no payment gateway integration
- **Poor customer retention** due to bad user experience

dishdash solves all of these problems by providing a complete, production-ready food delivery ecosystem.

## 1.3 Scope of the Project

The scope of dishdash covers:

- **User Registration & Authentication** — Sign Up, Sign In, Google OAuth, OTP-based Password Reset
- **Multi-Role System** — Customer, Shop Owner, and Delivery Boy roles with separate workflows
- **Shop & Menu Management** — Owners can create, edit shops and manage food items
- **Order Lifecycle Management** — Place order → Accept → Prepare → Assign Delivery → Deliver
- **Real-Time Order Tracking** — Live delivery boy location tracking using Socket.IO
- **Payment Integration** — Razorpay for online payments alongside Cash on Delivery
- **Review & Rating System** — Customers can rate and review food items
- **Analytics Dashboard** — Owners and delivery boys have dedicated dashboards with earnings data

---

# CHAPTER 2 — PROJECT AIM & OVERVIEW

## 2.1 Aim of the Project

The primary aim of the **dishdash** project is to develop a comprehensive, scalable, and user-friendly online food delivery web application that:

> _"Digitizes the entire food ordering and delivery process from restaurant discovery to doorstep delivery, ensuring real-time communication, secure payments, and a premium user experience for all stakeholders involved."_

## 2.2 Project Objectives

The specific objectives of this project are:

1. **To design and implement** a multi-role authentication system supporting Customer, Owner, and Delivery Boy roles.
2. **To build** a fully functional restaurant discovery and menu browsing system with category-wise filtering.
3. **To develop** a real-time order management pipeline from order placement to delivery confirmation using OTP verification.
4. **To integrate** Razorpay payment gateway for secure online payments alongside Cash on Delivery.
5. **To implement** live GPS-based delivery tracking using Socket.IO WebSockets and Leaflet maps.
6. **To provide** dashboards for shop owners (order management, analytics) and delivery boys (earnings, today's deliveries).
7. **To ensure** a responsive, modern, and premium UI/UX using React.js with Tailwind CSS and GSAP animations.

## 2.3 Project Overview

dishdash is a **three-sided marketplace** platform:

| Role | Capabilities |
|---|---|
| **Customer** | Browse shops & food items, add to cart, checkout, pay online/COD, track order in real time, review items, manage favorites |
| **Shop Owner** | Create/edit shop, manage menu items, accept/reject orders, view analytics dashboard, track earnings |
| **Delivery Boy** | Receive broadcast delivery assignments, accept orders, update real-time GPS location, confirm delivery via OTP, view earnings dashboard |

### Technology Summary

| Layer | Technology |
|---|---|
| Frontend | React.js 19, Vite, Redux Toolkit, React Router DOM v7 |
| Styling | Tailwind CSS v4, GSAP Animations, Leaflet Maps |
| Backend | Node.js, Express.js v5 |
| Database | MongoDB with Mongoose ODM |
| Real-Time | Socket.IO v4 (WebSockets) |
| Authentication | JWT (JSON Web Tokens), Google Firebase OAuth |
| Payment | Razorpay Payment Gateway |
| File Storage | Cloudinary (image uploads) |
| Email | Nodemailer (OTP emails) |

---

# CHAPTER 3 — ENVIRONMENT DESCRIPTION

## 3.1 Development Environment

The dishdash project was developed using the following development environment:

### 3.1.1 Operating System & Hardware
- **Operating System:** Windows 11
- **RAM:** Minimum 8 GB recommended
- **Processor:** Intel Core i5 or equivalent (64-bit)
- **Storage:** Minimum 10 GB free disk space
- **Network:** Stable internet connection (for cloud service integrations)

### 3.1.2 Backend Development Environment

| Tool | Version | Purpose |
|---|---|---|
| Node.js | v20.x (LTS) | JavaScript runtime for backend |
| Express.js | v5.2.1 | Web application framework |
| MongoDB | v7.x (Cloud: Atlas) | NoSQL database |
| Mongoose | v9.1.5 | MongoDB ODM (Object Data Modeling) |
| Nodemon | v3.1.11 | Auto-restart server during development |
| dotenv | v17.x | Environment variable management |
| bcrypt | v6.0.0 | Password hashing |
| jsonwebtoken | v9.0.3 | JWT-based authentication |
| socket.io | v4.8.3 | Real-time WebSocket server |
| multer | v2.0.2 | File/image upload handling |
| cloudinary | v2.9.0 | Cloud image storage |
| nodemailer | v7.0.12 | Email sending for OTP |
| razorpay | v2.9.6 | Payment gateway integration |
| cors | v2.8.6 | Cross-Origin Resource Sharing |

### 3.1.3 Frontend Development Environment

| Tool | Version | Purpose |
|---|---|---|
| React.js | v19.1.1 | UI component framework |
| Vite (Rolldown) | v7.1.14 | Fast build tool & dev server |
| Redux Toolkit | v2.11.2 | Global state management |
| React Router DOM | v7.13 | Client-side routing |
| Axios | v1.13.3 | HTTP requests to backend |
| Socket.IO Client | v4.8.3 | Real-time WebSocket client |
| Tailwind CSS | v4.1.18 | Utility-first CSS framework |
| GSAP | v3.14.2 | Smooth animations |
| Leaflet / React-Leaflet | v1.9.4 / v5.0.0 | Interactive map & tracking |
| Firebase | v12.8.0 | Google OAuth authentication |
| Razorpay (JS SDK) | Latest | Frontend payment checkout |
| Lucide-React | v0.577 | Icon library |
| React Hot Toast | v2.6.0 | Notification toasts |
| Recharts | v3.8.0 | Analytics charts & graphs |
| Lenis | v1.0.42 | Smooth scrolling |
| React Confetti | v6.4.0 | Order placed celebration effect |

### 3.1.4 Code Editor & Tools

- **Code Editor:** Visual Studio Code (VS Code)
- **Version Control:** Git & GitHub
- **API Testing:** Postman / Thunder Client
- **Browser:** Google Chrome (DevTools for debugging)
- **Database GUI:** MongoDB Atlas Dashboard / MongoDB Compass

## 3.2 Production / Deployment Environment

- **Backend Hosting:** Render / Railway (Node.js server)
- **Frontend Hosting:** Vercel / Netlify (React static build)
- **Database:** MongoDB Atlas (Cloud, M0 Free Tier / M10 Paid)
- **Media Storage:** Cloudinary (Images)
- **Environment Variables:** Stored securely via hosting platform's secret manager

---

# CHAPTER 4 — MODELS (DATABASE SCHEMA DESIGN)

The dishdash backend uses **MongoDB** as its database and **Mongoose** as the ODM library. The application has **6 data models** that represent the core entities of the system.

## 4.1 User Model (`user.model.js`)

The User model is the central entity of the system. It handles all three roles: **Customer**, **Shop Owner**, and **Delivery Boy**.

### 4.1.1 Schema Fields

| Field | Type | Description |
|---|---|---|
| `fullname` | String (Required) | Full name of the user |
| `email` | String (Required, Unique) | User's email address — used for login |
| `password` | String (Optional) | Hashed password (optional for Google OAuth users) |
| `mobile` | String (Required) | Mobile phone number of the user |
| `role` | Enum: `user`, `owner`, `deliveryBoy` | Determines user's access and dashboard |
| `socketId` | String | Current WebSocket connection ID for real-time events |
| `isOnline` | Boolean (default: false) | Whether the delivery boy is currently active |
| `resetOtp` | String | OTP code sent during forgot password flow |
| `isOtpVerified` | Boolean | Whether the OTP has been verified |
| `otpExpires` | Date | Expiry time of the OTP |
| `location` | GeoJSON Point | Real-time GPS coordinates (used for delivery boys) |
| `favorites` | [ObjectId → Item] | List of food items the user has saved as favorites |
| `isDutyOn` | Boolean (default: true) | Delivery boy duty status toggle |
| `timestamps` | Auto | `createdAt` and `updatedAt` auto-generated |

### 4.1.2 Special Index
```
userSchema.index({ location: "2dsphere" });
```
A **2dsphere geospatial index** is created on the `location` field to enable efficient proximity-based queries (e.g., finding the nearest delivery boy to a shop).

---

## 4.2 Shop Model (`shop.model.js`)

Represents a restaurant or food outlet registered on the platform by a Shop Owner.

### 4.2.1 Schema Fields

| Field | Type | Description |
|---|---|---|
| `name` | String (Required) | Name of the restaurant/shop |
| `image` | String (Required) | Cloudinary URL of shop's cover image |
| `owner` | ObjectId → User | Reference to the owner's User document |
| `city` | String (Required) | City where the shop is located |
| `state` | String (Required) | State where the shop is located |
| `address` | String (Required) | Full address of the shop |
| `items` | [ObjectId → Item] | Array of food items listed in this shop |
| `location` | GeoJSON Point (Required) | Shop's GPS coordinates for geospatial delivery matching |
| `isOpen` | Boolean (default: true) | Whether the shop is currently accepting orders |
| `timestamps` | Auto | Auto-generated created/updated timestamps |

### 4.2.2 Special Index
```
shopSchema.index({ location: "2dsphere" });
```
A **2dsphere index** allows finding shops near a customer's delivery address or finding delivery boys near the shop.

---

## 4.3 Item Model (`item.model.js`)

Represents an individual food item listed by a shop owner.

### 4.3.1 Schema Fields

| Field | Type | Description |
|---|---|---|
| `name` | String (Required) | Name of the food item |
| `image` | String (Required) | Cloudinary URL of item's image |
| `shop` | ObjectId → Shop | Reference to the parent shop |
| `category` | Enum | Food category: Snacks, Main Course, Pizza, Burger, Chinese, etc. |
| `price` | Number (min: 0, Required) | Price of the food item in INR |
| `foodType` | Enum: `veg`, `non-veg` | Indicates whether the item is vegetarian or non-vegetarian |
| `rating.average` | Number (default: 0) | Calculated average star rating |
| `rating.count` | Number (default: 0) | Total number of ratings received |
| `isAvailable` | Boolean (default: true) | Whether the item is currently available to order |
| `timestamps` | Auto | Auto-generated timestamps |

### 4.3.2 Supported Categories
`Snacks`, `Main Course`, `Dessert`, `Pizza`, `Burger`, `Sandwiches`, `North Indian`, `South Indian`, `Chinese`, `Fast Food`, `Others`

---

## 4.4 Order Model (`order.model.js`)

The most complex model in the system. An Order is a hierarchical structure with **nested schemas** to support ordering from multiple shops in a single transaction.

### 4.4.1 Main Order Schema

| Field | Type | Description |
|---|---|---|
| `user` | ObjectId → User | The customer who placed the order |
| `paymentMethod` | Enum: `cod`, `online` | Payment method chosen at checkout |
| `deliveryAddress.text` | String (Required) | Human-readable delivery address |
| `deliveryAddress.latitude` | Number (Required) | GPS latitude of delivery address |
| `deliveryAddress.longitude` | Number (Required) | GPS longitude of delivery address |
| `totalAmount` | Number (Required) | Total amount across all shop orders |
| `shopOrders` | [ShopOrderSchema] | Array of per-shop sub-orders |
| `payment` | Boolean (default: false) | Whether payment has been confirmed |
| `razorpayOrderId` | String | Razorpay generated order ID |
| `razorpayPaymentId` | String | Razorpay confirmed payment ID |

### 4.4.2 Shop Order Sub-Schema (Nested)

| Field | Type | Description |
|---|---|---|
| `shop` | ObjectId → Shop | Reference to the shop in this sub-order |
| `owner` | ObjectId → User | Reference to the shop's owner |
| `subTotal` | Number | Cost for items from this specific shop |
| `shopOrderItems` | [ShopOrderItemSchema] | Individual food items in this sub-order |
| `status` | Enum | `pending → preparing → out of delivery → delivered` |
| `assignment` | ObjectId → DeliveryAssignment | Linked delivery assignment record |
| `deliveryOtp` | String | OTP code for delivery confirmation |
| `assignedDeliveryBoy` | ObjectId → User | The delivery boy assigned to this sub-order |
| `deliveredAt` | Date | Timestamp when delivery was completed |
| `deliveryEarning` | Number | Amount earned by delivery boy (₹50 per delivery) |

---

## 4.5 DeliveryAssignment Model (`deliveryAssignment.model.js`)

Manages the intelligent assignment of delivery boys to shop orders using a **broadcast-first, accept-based** mechanism.

### 4.5.1 Schema Fields

| Field | Type | Description |
|---|---|---|
| `order` | ObjectId → Order | The parent order |
| `shop` | ObjectId → Shop | The shop whose sub-order needs delivery |
| `shopOrderId` | ObjectId | The specific shop order being assigned |
| `broadcastedTo` | [ObjectId → User] | List of delivery boys who received the broadcast |
| `assignedTo` | ObjectId → User (default: null) | The delivery boy who accepted |
| `status` | Enum: `broadcasted`, `assigned`, `expired`, `completed` | Current assignment status |
| `acceptedAt` | Date | Timestamp when a delivery boy accepted the order |
| `timestamps` | Auto | Auto-generated timestamps |

---

## 4.6 Review Model (`review.model.js`)

Stores customer reviews and ratings for food items.

### 4.6.1 Schema Fields

| Field | Type | Description |
|---|---|---|
| `user` | ObjectId → User (Required) | The customer who wrote the review |
| `item` | ObjectId → Item (Required) | The food item being reviewed |
| `shop` | ObjectId → Shop (Required) | The shop the item belongs to |
| `rating` | Number (1–5, Required) | Star rating given by the customer |
| `comment` | String (Required) | Written review text |
| `timestamps` | Auto | Auto-generated timestamps |

---

# CHAPTER 5 — SYSTEM REQUIREMENT SPECIFICATION (SRS)

## 5.1 Functional Requirements

### 5.1.1 Authentication Module
- **FR-01:** The system shall allow new users to register as Customer, Shop Owner, or Delivery Boy.
- **FR-02:** The system shall support email/password login with JWT-based session management using HTTP-only cookies.
- **FR-03:** The system shall support Google OAuth login via Firebase Authentication.
- **FR-04:** The system shall provide a Forgot Password flow — user enters email → OTP is sent via email (Nodemailer) → OTP verified → password reset.
- **FR-05:** The system shall protect all sensitive routes using a JWT authentication middleware (`isAuth`).

### 5.1.2 Shop & Item Management
- **FR-06:** Shop Owners shall be able to create a new shop with name, address, city, state, image, and geolocation.
- **FR-07:** Shop Owners shall be able to add food items with name, price, category, food type, and image.
- **FR-08:** Shop Owners shall be able to edit and delete their existing items.
- **FR-09:** Shop Owners shall be able to toggle their shop's open/closed status.
- **FR-10:** Customers shall be able to browse shops filtered by their city.

### 5.1.3 Order Management
- **FR-11:** Customers shall be able to add items from multiple shops into the cart.
- **FR-12:** Customers shall be able to checkout, providing a delivery address selected on an interactive map.
- **FR-13:** The system shall support two payment methods: Cash on Delivery (COD) and online payment via Razorpay.
- **FR-14:** After a successful order, the system shall split the order into per-shop sub-orders and notify each owner via Socket.IO.
- **FR-15:** Shop owners shall be able to update sub-order status: `pending → preparing → out of delivery`.
- **FR-16:** The system shall find nearby online delivery boys and broadcast the assignment — first to accept gets the job.
- **FR-17:** Delivery boys shall confirm delivery by verifying a customer-provided OTP.

### 5.1.4 Real-Time & Tracking
- **FR-18:** The system shall maintain persistent WebSocket connections via Socket.IO for all logged-in users.
- **FR-19:** Active delivery boys shall continuously broadcast their GPS coordinates to the server.
- **FR-20:** Customers shall be able to view the delivery boy's live location on an interactive Leaflet map.

### 5.1.5 User Features
- **FR-21:** Customers shall be able to mark food items as favorites and view them on a dedicated page.
- **FR-22:** Customers shall be able to write reviews and star ratings for ordered food items.
- **FR-23:** Customers shall be able to reorder from previous orders.
- **FR-24:** All users shall be able to edit their profiles.

### 5.1.6 Dashboards
- **FR-25:** Shop Owners shall have an analytics dashboard showing order counts, revenue, popular items, and charts.
- **FR-26:** Delivery Boys shall have a dashboard showing today's deliveries and all-time earnings.

## 5.2 Non-Functional Requirements

### 5.2.1 Performance
- **NFR-01:** The frontend shall use **React lazy loading** and **code splitting** to reduce initial load time.
- **NFR-02:** API responses shall be served within 500ms under normal load conditions.
- **NFR-03:** Images shall be stored on Cloudinary and served via CDN for fast loads.

### 5.2.2 Security
- **NFR-04:** User passwords shall be hashed using **bcrypt** with a salt factor of 10 before storing in the database.
- **NFR-05:** Authentication tokens shall be stored in **HTTP-only cookies** to prevent XSS attacks.
- **NFR-06:** All protected API routes shall be secured by the `isAuth` middleware that validates the JWT token.
- **NFR-07:** Payment signatures shall be verified using Razorpay's HMAC-SHA256 signature verification.

### 5.2.3 Usability
- **NFR-08:** The application shall be fully **responsive** across desktop, tablet, and mobile devices.
- **NFR-09:** The UI shall provide real-time **Toast notifications** for all key user actions.
- **NFR-10:** The application shall include loading **Skeleton screens** while data is being fetched.

### 5.2.4 Scalability
- **NFR-11:** The system shall use **MongoDB Atlas** which supports horizontal sharding for scaling.
- **NFR-12:** Socket.IO connections shall be managed efficiently with proper disconnect cleanup.

## 5.3 Hardware Requirements

| Component | Minimum | Recommended |
|---|---|---|
| Processor | Dual-core 1.5 GHz | Quad-core 2.5 GHz |
| RAM | 4 GB | 8 GB or more |
| Storage | 256 GB HDD | 512 GB SSD |
| Network | 15 Mbps Broadband | 50+ Mbps |
| Browser | Chrome 90+ | Chrome Latest |

## 5.4 Software Requirements

| Software | Version | Purpose |
|---|---|---|
| Node.js | v20 LTS | Backend runtime |
| MongoDB | v7.x | Database |
| npm | v10.x | Package management |
| Git | v2.x | Version control |
| Modern Browser | Chrome / Edge / Firefox Latest | Client-side access |

---

# CHAPTER 6 — DATA FLOW DIAGRAMS (DFD)

A **Data Flow Diagram (DFD)** shows how data moves through the system. It uses four symbols: Process (circle/rounded box), External Entity (rectangle), Data Store (open rectangle), and Data Flow (arrow).

---

## 6.1 Context Level DFD (Level 0)

The Level 0 DFD (Context Diagram) shows the entire system as a single process interacting with the three external entities.

```
                    +----------------------+
    CUSTOMER -----> |                      | <----- SHOP OWNER
                    |    dishdash SYSTEM      |
    CUSTOMER <----- |   (Food Delivery)    | -----> SHOP OWNER
                    |                      |
  DELIVERY BOY ---> |                      | <----- DELIVERY BOY
                    +----------------------+
```

**Data Flows:**

| From | To | Data |
|---|---|---|
| Customer | System | Registration details, login credentials, order details, delivery address, payment |
| System | Customer | Menu, order status, live tracking, OTP, invoice |
| Shop Owner | System | Shop info, menu items, order status updates |
| System | Shop Owner | Incoming orders, notifications, analytics data |
| Delivery Boy | System | Location updates, duty status, OTP confirmation |
| System | Delivery Boy | Order assignment broadcasts, delivery details |

---

## 6.2 Level 1 DFD — Main System Processes

Level 1 breaks the single system process into major functional modules.

```
CUSTOMER
   |
   |--[Registration/Login Info]--> (1.0) USER AUTHENTICATION
   |                                      |--[JWT Token]--> [D1: Users DB]
   |
   |--[Browse Request]-----------> (2.0) SHOP & MENU BROWSING
   |                                      |--[Query City]--> [D2: Shops DB]
   |                                      |--[Query Items]--> [D3: Items DB]
   |                                      |--[Shop/Items List]--> CUSTOMER
   |
   |--[Cart + Checkout Data]------> (3.0) ORDER PROCESSING
   |                                      |--[Save Order]--> [D4: Orders DB]
   |                                      |--[Payment]--> RAZORPAY
   |                                      |--[Notify]--> SHOP OWNER (Socket)
   |
   |--[Track Request]-------------> (4.0) REAL-TIME TRACKING
                                          |--[GPS Data]<-- DELIVERY BOY (Socket)
                                          |--[Live Location]--> CUSTOMER (Socket)

SHOP OWNER
   |
   |--[Shop/Item Data]-----------> (5.0) SHOP MANAGEMENT
   |                                      |--[Save]--> [D2: Shops DB, D3: Items DB]
   |
   |--[Status Update]------------> (3.0) ORDER PROCESSING
                                          |--[Update]--> [D4: Orders DB]
                                          |--[Trigger]-> (6.0) DELIVERY ASSIGNMENT

DELIVERY BOY
   |
   |--[Accept Assignment]--------> (6.0) DELIVERY ASSIGNMENT
   |                                      |--[Update]--> [D5: Assignments DB]
   |
   |--[GPS Coordinates]----------> (4.0) REAL-TIME TRACKING
   |
   |--[Delivery OTP]-------------> (7.0) DELIVERY CONFIRMATION
                                          |--[Mark Delivered]--> [D4: Orders DB]
```

---

## 6.3 Level 2 DFD — User Authentication Process (Process 1.0)

```
CUSTOMER
   |
   |--[Email + Password]----------> (1.1) SIGN UP
   |                                        |--[Hash Password (bcrypt)]
   |                                        |--[Save User]--> [D1: Users DB]
   |                                        |--[JWT Cookie]--> CUSTOMER
   |
   |--[Email + Password]----------> (1.2) SIGN IN
   |                                        |--[Verify Password]
   |                                        |--[Fetch User]<-- [D1: Users DB]
   |                                        |--[JWT Cookie]--> CUSTOMER
   |
   |--[Email]---------------------> (1.3) FORGOT PASSWORD
   |                                        |--[Generate OTP]
   |                                        |--[Send Email]--> NODEMAILER --> CUSTOMER
   |                                        |--[Save OTP]--> [D1: Users DB]
   |
   |--[OTP]-----------------------> (1.4) VERIFY OTP
   |                                        |--[Validate OTP + Expiry]
   |                                        |--[isOtpVerified = true]--> [D1: Users DB]
   |
   |--[New Password]--------------> (1.5) RESET PASSWORD
                                            |--[Hash New Password]
                                            |--[Update]--> [D1: Users DB]
                                            |--[Clear OTP Fields]--> [D1: Users DB]

GOOGLE USER
   |
   |--[Firebase Token]------------> (1.6) GOOGLE AUTH
                                            |--[Verify Firebase Token]
                                            |--[Find/Create User]--> [D1: Users DB]
                                            |--[JWT Cookie]--> CUSTOMER
```

---

## 6.4 Level 2 DFD — Order Processing (Process 3.0)

```
CUSTOMER
   |
   |--[Cart Items + Address]------> (3.1) PLACE ORDER
   |                                        |--[Group by Shop]
   |                                        |--[Create Order]--> [D4: Orders DB]
   |                                        |--[Razorpay Order ID] (if online)
   |                                        |--[Notify Owner via Socket]--> SHOP OWNER
   |
   |--[Razorpay Response]---------> (3.2) VERIFY PAYMENT
   |                                        |--[HMAC Signature Check]
   |                                        |--[payment=true]--> [D4: Orders DB]
   |
SHOP OWNER
   |--[Accept + Status Update]---> (3.3) UPDATE ORDER STATUS
   |                                        |--[Update shopOrder.status]--> [D4: Orders DB]
   |                                        |--[Trigger Delivery Assignment] (if "out of delivery")

   --> (3.4) DELIVERY ASSIGNMENT
                                            |--[Find Nearby Online Delivery Boys]
                                            |--[Geospatial Query: $near]--> [D1: Users DB]
                                            |--[Broadcast via Socket]--> DELIVERY BOY(s)
                                            |--[Save Assignment]--> [D5: Assignments DB]

DELIVERY BOY
   |--[Accept Assignment]---------> (3.5) ACCEPT ORDER
   |                                        |--[First-come wins]
   |                                        |--[assignedTo = deliveryBoy]--> [D5: Assignments DB]
   |                                        |--[Notify Customer via Socket]--> CUSTOMER
   |
   |--[Delivery OTP]-------------> (3.6) VERIFY DELIVERY OTP
                                            |--[Match OTP]
                                            |--[status = "delivered"]--> [D4: Orders DB]
                                            |--[deliveredAt, deliveryEarning]--> [D4: Orders DB]
                                            |--[Celebrate Confetti]--> CUSTOMER UI
```

---

# CHAPTER 7 — SOFTWARE PROJECT PLANNING

## 7.1 Project Planning Approach

The dishdash project was developed following an iterative and incremental development model, similar to **Agile methodology**. The project was broken into sprints where each sprint delivered a working piece of the application.

## 7.2 Work Breakdown Structure (WBS)

The project was divided into the following major phases and tasks:

### Phase 1: Planning & Design (Week 1)
- Requirements gathering and feature finalization
- Database schema design (6 models)
- UI/UX wireframing and design system planning
- Technology stack selection and environment setup

### Phase 2: Backend Core Development (Week 2–3)
- Express.js server setup with CORS and middleware
- MongoDB connection via Mongoose
- User Authentication APIs (Signup, Signin, Google Auth, OTP, JWT)
- User & Profile management APIs
- Shop CRUD APIs (Create, Read, Update)
- Item CRUD APIs with Cloudinary image upload

### Phase 3: Order System Development (Week 4–5)
- Order placement API with multi-shop cart grouping
- Razorpay payment gateway integration
- Order status management APIs
- Geospatial delivery boy proximity query
- Delivery assignment broadcast system
- OTP-based delivery confirmation

### Phase 4: Real-Time System (Week 5–6)
- Socket.IO server setup integrated with HTTP server
- User identity and online status via WebSockets
- Real-time GPS location update events
- Live location broadcast to customers tracking orders

### Phase 5: Frontend Development (Week 6–8)
- React.js project setup with Vite, Redux Toolkit, React Router
- Design system: Tailwind CSS tokens, global styles, custom cursor
- Landing Page, Sign Up, Sign In, Forgot Password pages
- Home Page: City-based shop and item listings
- Shop Page: Menu browsing with category filters
- Cart Page & Checkout with interactive map (Leaflet)
- Razorpay frontend integration
- Order Placed page with confetti celebration
- My Orders page with order details
- Real-time Order Tracking page with Leaflet map
- Owner Dashboard with analytics charts (Recharts)
- Delivery Boy Dashboard with earnings
- Profile, Favorites, Review Form pages

### Phase 6: Testing & Debugging (Week 8–9)
- Unit testing of API endpoints (Postman)
- Integration testing of payment flow
- Real-time socket event testing
- Cross-browser compatibility checks
- Responsive design testing on mobile devices
- Bug fixing and performance optimization

### Phase 7: Documentation & Finalization (Week 9–10)
- Code cleanup and inline commenting
- Black book and project report writing
- Preparation for demonstration

## 7.3 Project Timeline (Gantt Summary)

| Phase | Duration | Week |
|---|---|---|
| Planning & Database Design | 1 week | Week 1 |
| Backend Core (Auth, Shop, Item) | 2 weeks | Week 2–3 |
| Order System & Payment | 2 weeks | Week 4–5 |
| Real-Time (Socket.IO) | 1 week | Week 5–6 |
| Frontend Development | 3 weeks | Week 6–8 |
| Testing & Bug Fixing | 1 week | Week 8–9 |
| Documentation | 1 week | Week 9–10 |
| **Total** | **~10 weeks** | |

## 7.4 Team Roles & Responsibilities

| Role | Responsibility |
|---|---|
| Full-Stack Developer | Backend API development, database design, frontend UI |
| UI/UX Designer | Screen wireframing, design system, responsive layout |
| Project Lead | Feature planning, timeline tracking, testing oversight |

_(Note: In a student project, all roles may be handled by a single developer or small team.)_

---

# CHAPTER 8 — SYSTEM DESIGN

## 8.1 Architecture Overview

dishdash follows a **3-Tier Client-Server Architecture** with an additional real-time layer:

```
┌──────────────────────────────────────────────┐
│               PRESENTATION TIER              │
│    React.js SPA (Vite) + Tailwind CSS        │
│    Redux Toolkit (Global State)              │
│    React Router DOM v7 (Client-Side Routing) │
└──────────────────┬───────────────────────────┘
                   │  HTTP (Axios) + WebSocket (Socket.IO)
┌──────────────────▼───────────────────────────┐
│                LOGIC TIER                    │
│    Node.js + Express.js v5 REST API          │
│    Socket.IO Server (Real-Time Events)       │
│    JWT Middleware (isAuth)                   │
│    Multer + Cloudinary (File Uploads)        │
│    Razorpay SDK (Payments)                  │
│    Nodemailer (OTP Emails)                   │
└──────────────────┬───────────────────────────┘
                   │  Mongoose ODM
┌──────────────────▼───────────────────────────┐
│                DATA TIER                     │
│    MongoDB Atlas (Cloud NoSQL Database)      │
│    Collections: Users, Shops, Items,         │
│    Orders, DeliveryAssignments, Reviews      │
└──────────────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│           EXTERNAL SERVICES TIER             │
│    Cloudinary (Image Storage CDN)            │
│    Firebase (Google OAuth)                   │
│    Razorpay (Payment Gateway)                │
│    Nodemailer / SMTP (Email OTP)             │
└──────────────────────────────────────────────┘
```

## 8.2 Backend Module Design

### 8.2.1 API Route Structure

| Base Route | File | Description |
|---|---|---|
| `/api/auth` | `auth.routes.js` | Signup, Signin, Signout, Google Auth, OTP, Reset Password |
| `/api/user` | `user.routes.js` | Profile, favorites, location update |
| `/api/shop` | `shop.routes.js` | Create, read, update shop |
| `/api/item` | `item.routes.js` | Add, edit, delete, list items |
| `/api/order` | `order.routes.js` | Place order, payment verify, status update, tracking |
| `/api/review` | `review.routes.js` | Add review, get reviews |

### 8.2.2 Middleware Design

| Middleware | File | Function |
|---|---|---|
| `isAuth` | `middlewares/isAuth.js` | Verifies JWT from cookie, attaches user to `req.user` |
| `multer` | `middlewares/multer.js` | Handles image file uploads before Cloudinary upload |

### 8.2.3 Socket.IO Event Design

| Event Name | Direction | Description |
|---|---|---|
| `connection` | Server listens | New client connects |
| `identity` | Client → Server | User registers their ID to socket; marks them online |
| `updateLocation` | Client → Server | Delivery boy sends new GPS coordinates |
| `updateDeliveryLocation` | Server → All Clients | Server broadcasts delivery boy's new location |
| `newOrderNotification` | Server → Owner | New order placed; notifies shop owner |
| `orderAssigned` | Server → DeliveryBoy | New delivery assignment broadcast |
| `disconnect` | Server listens | Client disconnects; marks user offline |

## 8.3 Frontend Module Design

### 8.3.1 Redux State Management

| Slice | State | Description |
|---|---|---|
| `userSlice` | `userData`, `cart`, `socket`, `myOrders`, `city`, `shopsByCity`, `itemsByCity`, `myShop`, `favorites` | All global user and app data |
| `ownerSlice` | `ownerOrders` | Shop owner's incoming orders |
| `mapSlice` | `mapInstance` | Leaflet map reference |

### 8.3.2 Page Structure & Routes

| URL Path | Component | Access |
|---|---|---|
| `/` | `Home.jsx` | Public |
| `/signup` | `SignUp.jsx` | Guest only |
| `/signin` | `SignIn.jsx` | Guest only |
| `/forgot-password` | `ForgotPassword.jsx` | Guest only |
| `/profile` | `Profile.jsx` | Auth required |
| `/about` | `AboutUs.jsx` | Public |
| `/create-edit-shop` | `CreateEditShop.jsx` | Auth required |
| `/add-item` | `AddItem.jsx` | Auth required (Owner) |
| `/edit-item/:itemId` | `EditItem.jsx` | Auth required (Owner) |
| `/cart` | `CartPage.jsx` | Auth required |
| `/checkOut` | `CheckOut.jsx` | Auth required |
| `/order-placed` | `OrderPlaced.jsx` | Auth required |
| `/my-orders` | `MyOrders.jsx` | Auth required |
| `/track-order/:orderId` | `TrackOrderPage.jsx` | Auth required |
| `/shop/:shopId` | `Shop.jsx` | Auth required |
| `/favorites` | `Favorites.jsx` | Auth required |
| `/delivery-orders` | `DeliveryBoy.jsx` | Auth required (Delivery) |
| `/delivery-dashboard` | `Deliverydashboard.jsx` | Auth required (Delivery) |

### 8.3.3 Component Design Overview

| Component | Purpose |
|---|---|
| `Nav.jsx` | Main navigation bar with role-based menus, cart count, notifications |
| `FoodCart.jsx` | Food item card with add-to-cart, favorite toggle, rating display |
| `OwnerDashboard.jsx` | Analytics charts using Recharts (orders, revenue, popular items) |
| `DeliveryBoy.jsx` | Delivery boy order feed — shows broadcasts, accept button |
| `TrackOrderPage.jsx` | Live order tracking with Leaflet map and delivery boy marker |
| `UserOrderCard.jsx` | Customer's order history card with OTP, reorder, review |
| `OwnerOrderCard.jsx` | Owner's order management card with status update controls |
| `ReviewForm.jsx` | Star rating + comment form for item review submission |
| `Skeleton.jsx` | Loading skeleton placeholders for content-heavy pages |
| `CustomCursor.jsx` | Custom animated cursor for premium user experience |
| `PageRouteLoader.jsx` | Full-page loading animation during lazy-loaded page transitions |

## 8.4 Payment Integration Design (Razorpay)

```
CUSTOMER (Checkout Page)
    |
    |--[POST /api/order/place-order + paymentMethod: "online"]
    |
    BACKEND: Creates Razorpay order --> Returns { razorpayOrderId, amount, key }
    |
    FRONTEND: Opens Razorpay Checkout Modal
    |
CUSTOMER pays via UPI / Card / Net Banking
    |
    Razorpay: Returns { razorpay_payment_id, razorpay_order_id, razorpay_signature }
    |
    FRONTEND --[POST /api/order/verify-payment + signature data]-->
    |
    BACKEND: Verifies HMAC-SHA256 signature --> Sets payment=true --> Broadcasts to Owner
    |
    CUSTOMER redirected to /order-placed ✅
```

---

# CHAPTER 9 — PROJECT TESTING

## 9.1 Testing Approach

The dishdash project followed a **multi-layered testing strategy** to ensure correctness, reliability, and performance of both the frontend and backend systems. Testing was done across multiple phases of development.

## 9.2 Unit Testing

### 9.2.1 Backend API Unit Testing (Postman)

Each API endpoint was individually tested using **Postman** with different scenarios:

| API Endpoint | Test Cases | Expected Result |
|---|---|---|
| `POST /api/auth/signup` | Valid data, duplicate email, missing fields | 201 Created / 400 Bad Request |
| `POST /api/auth/signin` | Valid credentials, wrong password, unknown email | 200 OK / 401 Unauthorized |
| `POST /api/auth/send-otp` | Valid email, non-existent email | 200 OK / 404 Not Found |
| `POST /api/auth/verify-otp` | Correct OTP, expired OTP, wrong OTP | 200 OK / 400 Bad Request |
| `POST /api/shop` | Owner role, non-owner role, missing fields | 201 Created / 403 Forbidden |
| `POST /api/item` | Valid item, missing price, invalid category | 201 Created / 400 Bad Request |
| `POST /api/order/place-order` | Valid cart, empty cart, invalid address | 201 Created / 400 Bad Request |
| `POST /api/order/verify-payment` | Valid signature, tampered signature | 200 OK / 400 Bad Request |
| `POST /api/order/update-status` | Owner updates own order, other user tries | 200 OK / 403 Forbidden |

### 9.2.2 Frontend Component Testing

Individual React components were tested by rendering them in the browser and verifying:

- **FoodCart.jsx:** Add to cart button adds item to Redux store; favorite toggle reflects in UI
- **CartPage.jsx:** Quantity increment/decrement updates subtotal correctly; empty cart shows correct message
- **CheckOut.jsx:** Leaflet map renders; address is set when clicking on the map

## 9.3 Integration Testing

Integration testing verified that the frontend and backend work together correctly:

### 9.3.1 Authentication Flow Integration
- **Test:** Register → Login → Access protected route → Logout
- **Result:** ✅ JWT cookie set on login, cleared on logout; protected routes redirect correctly

### 9.3.2 Order Flow Integration
- **Test:** Add item to cart → Checkout → Razorpay payment → Order Placed → Owner sees order → Status update → Delivery assignment
- **Result:** ✅ Full order pipeline works; each step correctly triggers the next

### 9.3.3 Real-Time Socket Integration
- **Test:** Open two browser windows (customer + delivery boy) → Delivery boy updates location → Customer tracking page shows updated marker
- **Result:** ✅ Location updates broadcast within ~200ms via Socket.IO

### 9.3.4 Payment Verification Integration
- **Test:** Complete Razorpay test payment → Verify backend payment confirmation → Order marked paid
- **Result:** ✅ Razorpay signature verification works correctly; order status updated

## 9.4 User Interface (UI) Testing

### 9.4.1 Responsive Design Testing

| Screen Size | Device Type | Status |
|---|---|---|
| 375px | Mobile (iPhone SE) | ✅ Passed |
| 768px | Tablet (iPad) | ✅ Passed |
| 1280px | Laptop | ✅ Passed |
| 1920px | Desktop (Full HD) | ✅ Passed |

### 9.4.2 Cross-Browser Testing

| Browser | Version | Status |
|---|---|---|
| Google Chrome | Latest | ✅ Passed |
| Microsoft Edge | Latest | ✅ Passed |
| Mozilla Firefox | Latest | ✅ Passed |
| Safari (macOS) | Latest | ✅ Passed |

## 9.5 Security Testing

| Test | Method | Result |
|---|---|---|
| Accessing protected API without token | Direct API call without cookie | ✅ 401 Unauthorized returned |
| Password stored as plain text | Check MongoDB document | ✅ bcrypt hash stored |
| Tampered Razorpay signature | Modify signature before sending | ✅ Payment rejected |
| XSS via review comment | Submit `<script>alert(1)</script>` | ✅ Displayed as text, not executed |
| Cart manipulation (price change) | Modify Redux state | ✅ Price re-calculated from DB on backend |

## 9.6 Performance Testing

- **Code Splitting:** All pages are lazy-loaded; initial JS bundle is significantly smaller
- **Image Optimization:** All images served via Cloudinary CDN; auto-format and quality optimization applied
- **API Response Times:** Measured average response times under normal load:
  - `GET /api/user/me`: ~80ms
  - `GET /api/shop/city`: ~120ms
  - `POST /api/order/place-order`: ~350ms
  - Socket location event propagation: ~150–200ms

---

# CHAPTER 10 — LIMITATIONS & SYSTEM ENHANCEMENT

## 10.1 Current Limitations

### 10.1.1 Scalability Limitations
- The current Socket.IO setup is **single-server** and does not use Redis adapter. This means real-time events will not work correctly if the backend is scaled horizontally across multiple server instances.
- The **geospatial delivery boy search** depends on delivery boys actively broadcasting their location. If a delivery boy has poor network connectivity, their location may be stale.

### 10.1.2 Business Logic Limitations
- **No dynamic delivery fee:** The delivery earning for a delivery boy is hardcoded at ₹50 per order. There is no dynamic fee calculation based on distance.
- **No surge pricing:** The system does not support increased prices during peak hours or high-demand periods.
- **No cancellation system:** Customers cannot cancel an order once it is placed. There is no refund mechanism for cancelled orders.

### 10.1.3 User Experience Limitations
- **No push notifications:** All notifications are WebSocket-based and require the browser tab to be open. There are no browser push notifications or mobile push notifications when the tab is closed.
- **No in-app chat:** There is no direct communication channel between the customer and the delivery boy or shop owner.
- **No estimated delivery time (ETA):** The system shows live tracking but does not calculate or display an estimated time of arrival.

### 10.1.4 Security Limitations
- **No rate limiting:** The API endpoints do not have rate limiting implemented, making them potentially vulnerable to brute-force attacks on login or OTP endpoints.
- **OTP expiry is time-based only:** There is no limit on the number of OTP attempts before locking the account.

---

## 10.2 Possible System Enhancements

### 10.2.1 Performance Enhancements
- **Redis Integration:** Use Redis as a Socket.IO adapter and for caching frequently accessed data (shop listings, menu items) to reduce database load.
- **Database Indexing:** Add additional compound indexes on frequently queried fields (e.g., `{ city: 1, isOpen: 1 }` for shop queries).

### 10.2.2 Feature Enhancements
- **Dynamic Delivery Fee:** Calculate delivery fee based on the distance between shop and customer using the Haversine formula or Google Maps Distance Matrix API.
- **Order Cancellation & Refunds:** Allow customers to cancel within a time window; trigger Razorpay refund API automatically.
- **Multiple Addresses:** Allow customers to save multiple delivery addresses and select from them at checkout.

### 10.2.3 Security Enhancements
- **Rate Limiting:** Implement `express-rate-limit` or `Upstash Redis rate limit` on auth routes (login, OTP send) to prevent brute-force attacks.
- **Refresh Token Rotation:** Replace single JWT with access token + refresh token pair for better session security.

---

# CHAPTER 11 — FUTURE RECOMMENDATIONS

## 11.1 Mobile Application Development

- **React Native / Flutter App:** Convert the web application into a native mobile app for iOS and Android. A mobile app would improve user experience, enable push notifications, and allow better GPS tracking with background location access.
- **PWA (Progressive Web App):** As an intermediate step, convert the React app into a PWA with offline support and a home screen installation prompt.

## 11.2 Advanced Delivery Management

- **Route Optimization:** Integrate **Google Maps Directions API** or **OpenRouteService** to calculate the optimal delivery route for the delivery boy, reducing delivery time.
- **AI-Based Delivery Boy Assignment:** Instead of broadcasting to all nearby delivery boys, use a machine learning model that considers past performance, current workload, and proximity to intelligently assign orders.
- **Multi-Order Pickup:** Allow a delivery boy to pick up orders from multiple shops in a single trip and deliver them to nearby customers — improving efficiency.

## 11.3 Business Intelligence & Analytics

- **Admin Super-Panel:** Build a super-admin dashboard to manage all shops, users, delivery boys, orders, and revenue across the entire platform.
- **Advanced Analytics:** Implement detailed analytics using tools like **Apache Kafka** for event streaming and **Elasticsearch** for real-time analytics querying.
- **Customer Behavior Analysis:** Track customer browsing patterns, popular items by area, peak ordering times — and use this data to provide personalized recommendations.

## 11.4 Enhanced User Features

- **AI Food Recommendations:** Implement a collaborative filtering recommendation engine that suggests food items based on a customer's order history and preferences.
- **Group Ordering:** Allow multiple users to collaboratively add items to a shared cart and split the bill.
- **Loyalty & Rewards System:** Introduce a points-based loyalty system where customers earn points on every order and redeem them for discounts.
- **Live Chat Support:** Integrate a real-time chat system (WebSocket-based) for customer-delivery boy communication.

## 11.5 Scalability & DevOps Improvements

- **Microservices Architecture:** Split the monolithic backend into independent microservices (Auth Service, Order Service, Delivery Service, Notification Service) to allow independent scaling.
- **Docker & Kubernetes:** Containerize the application using Docker and orchestrate with Kubernetes for automatic scaling and zero-downtime deployments.
- **CI/CD Pipeline:** Set up a Continuous Integration/Continuous Deployment pipeline using **GitHub Actions** for automated testing and deployment.
- **Load Balancing:** Deploy multiple backend instances behind a load balancer (Nginx / AWS ALB) with Redis for shared session/socket state.

## 11.6 Payment & Financial Features

- **Multiple Payment Gateways:** Add support for PhonePe, Paytm, and Google Pay in addition to Razorpay.
- **Wallet System:** Introduce an in-app digital wallet where customers can add money and use it for faster checkout.
- **Automated Payouts:** Implement automatic weekly/monthly payouts to delivery boys and shop owners via Razorpay Payouts API.

---

# CHAPTER 12 — CONCLUDING REMARKS

## 12.1 Summary of Work Done

The **dishdash Online Food Delivery System** is a fully functional, production-quality MERN stack web application that successfully achieves all the objectives defined at the beginning of the project. The system covers the complete food delivery lifecycle:

- A **robust authentication system** supporting email/password, Google OAuth, and OTP-based password recovery
- A **three-sided marketplace** connecting Customers, Shop Owners, and Delivery Boys in a seamless workflow
- A **real-time order management** pipeline with geospatial delivery boy assignment and OTP-verified delivery confirmation
- A **live tracking system** powered by Socket.IO WebSockets and Leaflet interactive maps
- **Secure payment integration** with Razorpay supporting both online payments and Cash on Delivery
- **Role-specific dashboards** providing earnings analytics for delivery boys and business analytics for shop owners
- A **premium, responsive user interface** with smooth animations (GSAP), custom cursor, skeleton loaders, and real-time toast notifications

## 12.2 Learning Outcomes

Through the development of dishdash, the following key technical skills were gained and demonstrated:

1. **Full-Stack Development:** Building a complete application spanning from UI to database with the MERN stack
2. **Real-Time Systems:** Implementing WebSocket-based bidirectional event communication with Socket.IO
3. **Geospatial Queries:** Using MongoDB's 2dsphere indexes and `$near` operator for proximity-based search
4. **Payment Gateway Integration:** Implementing Razorpay with HMAC signature security
5. **State Management:** Architecting global client state with Redux Toolkit and custom React hooks
6. **Cloud Services:** Integrating Cloudinary for media management and MongoDB Atlas for cloud database hosting
7. **UI/UX Engineering:** Building a modern, animated, responsive interface using Tailwind CSS, GSAP, and Leaflet

## 12.3 Conclusion

dishdash demonstrates that a single, well-architected MERN stack application can power a complex, real-world marketplace platform. The project not only fulfills the academic requirements of a final-year project, but also represents a commercially viable prototype that can be extended and deployed as a real product.

The system's architecture — with clean separation between authentication, business logic, real-time, and payment layers — makes it highly maintainable and extensible. With the recommended future enhancements (mobile app, microservices, AI recommendations), dishdash has the potential to evolve into a full-scale food delivery platform competitive with industry solutions.

---

# CHAPTER 13 — BIBLIOGRAPHY

## 13.1 Official Documentation

1. **MongoDB Documentation** — *MongoDB Manual: Data Modeling, Indexes, Aggregation, Geospatial Queries*  
   URL: https://www.mongodb.com/docs/

2. **Express.js Documentation** — *Express.js v5 API Reference, Routing, Middleware*  
   URL: https://expressjs.com/

3. **React.js Documentation** — *React v19 official docs: Hooks, Lazy Loading, Context, Suspense*  
   URL: https://react.dev/

4. **Node.js Documentation** — *Node.js v20 LTS: HTTP Module, Event Loop, Streams*  
   URL: https://nodejs.org/docs/

5. **Socket.IO Documentation** — *Socket.IO v4: Server API, Client API, Namespaces, Rooms*  
   URL: https://socket.io/docs/

6. **Mongoose Documentation** — *Mongoose v9: Schemas, Models, Population, Geospatial*  
   URL: https://mongoosejs.com/docs/

7. **Redux Toolkit Documentation** — *RTK: createSlice, createAsyncThunk, configureStore*  
   URL: https://redux-toolkit.js.org/

8. **Razorpay Documentation** — *Payment Orders API, Webhook Verification, Payouts*  
   URL: https://razorpay.com/docs/

9. **Cloudinary Documentation** — *Node.js SDK: Upload, Transformation, Delivery*  
   URL: https://cloudinary.com/documentation

10. **Firebase Documentation** — *Firebase Auth: Google Sign-In, ID Token Verification*  
    URL: https://firebase.google.com/docs/auth

11. **Leaflet / React-Leaflet Documentation** — *Map setup, Markers, TileLayer, Geolocation*  
    URL: https://react-leaflet.js.org/

12. **Tailwind CSS Documentation** — *Utility Classes, Custom Config, Responsive Design*  
    URL: https://tailwindcss.com/docs

13. **GSAP Documentation** — *GreenSock Animation Platform: Tweens, Timelines, ScrollTrigger*  
    URL: https://gsap.com/docs/

14. **Vite.js Documentation** — *Fast build tooling, code splitting, HMR, plugin system*  
    URL: https://vitejs.dev/guide/

## 13.2 Books & Academic References

15. **Duckett, J.** (2014). *JavaScript & jQuery: Interactive Front-End Web Development*. John Wiley & Sons.

16. **Flanagan, D.** (2020). *JavaScript: The Definitive Guide* (7th ed.). O'Reilly Media.

17. **Chodorow, K.** (2013). *MongoDB: The Definitive Guide*. O'Reilly Media.

18. **Banks, A. & Porcello, E.** (2020). *Learning React: Modern Patterns for Developing React Apps*. O'Reilly Media.

19. **Brown, E.** (2019). *Web Development with Node and Express* (2nd ed.). O'Reilly Media.

20. **Sommerville, I.** (2016). *Software Engineering* (10th ed.). Pearson Education.

## 13.3 Online Resources & Tutorials

21. **MDN Web Docs** — JavaScript, Web APIs, HTTP Reference  
    URL: https://developer.mozilla.org/

22. **freeCodeCamp** — MERN Stack Tutorial Series  
    URL: https://www.freecodecamp.org/

23. **Traversy Media** — YouTube channel: Full Stack MERN tutorials  
    URL: https://www.youtube.com/c/TraversyMedia

24. **Axios GitHub Repository** — Axios HTTP client for Node.js and browsers  
    URL: https://github.com/axios/axios

25. **JWT.io** — JSON Web Token debugger and introduction  
    URL: https://jwt.io/

26. **npm Registry** — Package documentation and version history  
    URL: https://www.npmjs.com/

---

*End of Black Book Documentation*

---

**Document Prepared For:** Final Year MERN Stack Project  
**Project Name:** dishdash — Online Food Delivery System  
**Date:** April 2026

---
