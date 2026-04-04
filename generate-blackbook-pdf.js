const PdfPrinter = require("pdfmake");
const fs = require("fs");
const path = require("path");

const BLANK = "___________";

// Use built-in pdfmake fonts (Roboto)
const vfsFonts = require("pdfmake/build/vfs_fonts.js");
const printer = new PdfPrinter({
  Roboto: {
    normal: Buffer.from(vfsFonts["Roboto-Regular.ttf"], "base64"),
    bold: Buffer.from(vfsFonts["Roboto-Medium.ttf"], "base64"),
    italics: Buffer.from(vfsFonts["Roboto-Italic.ttf"], "base64"),
    bolditalics: Buffer.from(vfsFonts["Roboto-MediumItalic.ttf"], "base64"),
  },
});

// --- Helpers ---
function centerText(text, opts = {}) {
  return { text, alignment: "center", ...opts };
}

function headerFooter(chapterName) {
  return {
    header: {
      margin: [0, 10, 0, 5],
      columns: [
        {
          stack: [
            { text: "Vidhyadeep College", alignment: "center", bold: true, fontSize: 10, color: "1F3864" },
            { text: "Vidhyadeep University, Surat, Gujarat", alignment: "center", fontSize: 8, italics: true, color: "666666" },
          ],
        },
      ],
    },
    footer: {
      margin: [0, 5, 0, 10],
      columns: [
        {
          text: `Food Delivery System  |  ${chapterName}  |  Bachelor of Computer Science`,
          alignment: "center",
          fontSize: 7,
          color: "888888",
        },
      ],
    },
  };
}

function heading1(text) {
  return { text, fontSize: 20, bold: true, color: "1F3864", margin: [0, 20, 0, 10], pageBreak: "before" };
}

function heading2(text) {
  return { text, fontSize: 15, bold: true, color: "2E5090", margin: [0, 15, 0, 8] };
}

function heading3(text) {
  return { text, fontSize: 12, bold: true, color: "375F9E", margin: [0, 10, 0, 5] };
}

function bodyPara(text) {
  return { text, fontSize: 11, margin: [0, 0, 0, 6], alignment: "justify", lineHeight: 1.5 };
}

function bulletItem(text) {
  return { text, fontSize: 11, margin: [15, 0, 0, 4], bulletIndent: 5, lineHeight: 1.4 };
}

function blankLine() {
  return { text: " ", fontSize: 11, margin: [0, 2, 0, 2] };
}

function tableDef(headers, rows, widths) {
  return {
    table: {
      headerRows: 1,
      widths: widths || headers.map(() => "*"),
      body: [
        headers.map((h) => ({ text: h, bold: true, fontSize: 9, color: "FFFFFF", fillColor: "1F3864", alignment: "center" })),
        ...rows.map((row) => row.map((cell) => ({ text: String(cell), fontSize: 9, alignment: "center" }))),
      ],
    },
    margin: [0, 5, 0, 10],
    layout: {
      fillColor: function (rowIndex) {
        return rowIndex === 0 ? "1F3864" : rowIndex % 2 === 0 ? "F2F6FC" : null;
      },
      hLineColor: () => "#CCCCCC",
      vLineColor: () => "#CCCCCC",
    },
  };
}

function smallTable(headers, rows, widths) {
  return {
    table: {
      headerRows: 1,
      widths: widths || headers.map(() => "*"),
      body: [
        headers.map((h) => ({ text: h, bold: true, fontSize: 8, color: "FFFFFF", fillColor: "1F3864", alignment: "center" })),
        ...rows.map((row) => row.map((cell) => ({ text: String(cell), fontSize: 8, alignment: "center" }))),
      ],
    },
    margin: [0, 5, 0, 10],
    layout: {
      fillColor: function (rowIndex) {
        return rowIndex === 0 ? "1F3864" : rowIndex % 2 === 0 ? "F2F6FC" : null;
      },
      hLineColor: () => "#CCCCCC",
      vLineColor: () => "#CCCCCC",
    },
  };
}

function placeholderImage(text) {
  return {
    canvas: [
      { type: "rect", x: 0, y: 0, w: 450, h: 180, lineColor: "#999999", lineWidth: 1 },
    ],
    margin: [40, 5, 40, 5],
  };
}

function placeholderLabel(text) {
  return { text, alignment: "center", fontSize: 9, italics: true, color: "999999", margin: [0, 2, 0, 12] };
}

// ============================================================
// BUILD DOCUMENT DEFINITION
// ============================================================
function buildDoc() {
  const content = [];

  // ==================== TITLE PAGE ====================
  content.push({
    ...headerFooter("Title Page"),
    pageBreak: "before",
    stack: [
      blankLine(), blankLine(), blankLine(), blankLine(),
      centerText("[College Logo]", { fontSize: 11, color: "999999", bold: true }),
      blankLine(), blankLine(), blankLine(),
      centerText("Food Delivery System", { fontSize: 28, bold: true, color: "1F3864" }),
      blankLine(),
      centerText("A Project Report", { fontSize: 14, italics: true }),
      centerText("Submitted in Partial Fulfillment of the Requirements", { fontSize: 11 }),
      centerText("for the Degree of", { fontSize: 11 }),
      blankLine(),
      centerText("Bachelor of Computer Science (BCS)", { fontSize: 16, bold: true, color: "2E5090" }),
      blankLine(),
      centerText("Submitted to", { fontSize: 11 }),
      centerText("Vidhyadeep University", { fontSize: 14, bold: true }),
      centerText("Surat, Gujarat", { fontSize: 11 }),
      blankLine(), blankLine(),
      centerText("Submitted by", { fontSize: 11 }),
      blankLine(),
      centerText(`1. ${BLANK}`, { fontSize: 11 }),
      centerText(`2. ${BLANK}`, { fontSize: 11 }),
      centerText(`3. ${BLANK}`, { fontSize: 11 }),
      centerText(`4. ${BLANK}`, { fontSize: 11 }),
      blankLine(), blankLine(),
      centerText(`Guided by: ${BLANK}`, { fontSize: 11, bold: true }),
      blankLine(),
      centerText(`Academic Year: ${BLANK}`, { fontSize: 11 }),
      blankLine(), blankLine(),
      centerText("Vidhyadeep College", { fontSize: 14, bold: true, color: "1F3864" }),
      centerText("Vidhyadeep University, Surat", { fontSize: 11 }),
    ],
  });

  // ==================== PROJECT PROPOSAL ====================
  content.push({
    ...headerFooter("Project Proposal"),
    pageBreak: "before",
    stack: [
      heading1("PROJECT PROPOSAL"),
      heading2("Project Details"),
      tableDef(
        ["Field", "Details"],
        [
          ["Project Title", "Food Delivery System"],
          ["Submitted By", BLANK],
          ["Program Name", "Bachelor of Computer Science (BCS)"],
          ["Contact", BLANK],
          ["Programming Language", "JavaScript"],
          ["Date Submitted", BLANK],
          ["Frontend Tools", "React JS, HTML, CSS, JavaScript, Bootstrap"],
          ["Backend Tools", "Node JS, Express JS"],
        ],
        ["30%", "70%"]
      ),
      blankLine(),
      heading2("Project Members Detail"),
      smallTable(
        ["Sr.", "Enrollment No.", "Member Name", "Division", "Contact No.", "Email", "Seminar Topic"],
        [
          ["1", BLANK, BLANK, BLANK, BLANK, BLANK, BLANK],
          ["2", BLANK, BLANK, BLANK, BLANK, BLANK, BLANK],
          ["3", BLANK, BLANK, BLANK, BLANK, BLANK, BLANK],
          ["4", BLANK, BLANK, BLANK, BLANK, BLANK, BLANK],
        ],
        ["6%", "14%", "16%", "12%", "14%", "20%", "18%"]
      ),
      blankLine(),
      heading2("Description About Project"),
      bodyPara("The Food Delivery System is a full-stack web application designed to streamline the process of ordering food online and managing restaurant operations. The system provides a comprehensive platform that connects customers, restaurant owners, and delivery partners in a seamless digital ecosystem."),
      bodyPara("Built using the MERN (MongoDB, Express.js, React.js, Node.js) stack, this application leverages modern web technologies to deliver a responsive, real-time, and user-friendly experience. The system supports three distinct user roles: Customers who can browse restaurants and order food, Restaurant Owners who can manage their menus and orders, and Delivery Partners who handle the delivery of orders to customers."),
      bodyPara("Key features of the system include real-time order tracking using WebSocket technology (Socket.IO), secure online payment integration via Razorpay, GPS-based restaurant discovery, OTP-based delivery verification, and an analytics dashboard for restaurant owners. The application also supports Google OAuth for social login and implements JWT-based authentication for secure access control."),
      bodyPara("The project aims to solve the problems associated with traditional food ordering methods by providing a digital platform that reduces manual effort, improves order accuracy, enables real-time tracking, and provides a convenient and efficient food ordering experience for all stakeholders involved."),
    ],
  });

  // ==================== CERTIFICATES (x4) ====================
  for (let i = 1; i <= 4; i++) {
    content.push({
      ...headerFooter(`Certificate - ${i}`),
      pageBreak: "before",
      stack: [
        blankLine(), blankLine(), blankLine(),
        centerText("CERTIFICATE", { fontSize: 28, bold: true, color: "1F3864" }),
        blankLine(), blankLine(), blankLine(),
        bodyPara('This is to certify that the project entitled "Food Delivery System" has been carried out by'),
        blankLine(),
        centerText(`${BLANK} (Enrollment No: ${BLANK})`, { fontSize: 14, bold: true }),
        blankLine(),
        bodyPara("a student of Bachelor of Computer Science (BCS) at Vidhyadeep College, Vidhyadeep University, Surat, Gujarat, during the academic year ___________, in partial fulfillment of the requirements for the award of the degree of Bachelor of Computer Science."),
        blankLine(),
        bodyPara("The project has been found to be satisfactory and is being submitted for evaluation."),
        blankLine(), blankLine(), blankLine(), blankLine(),
        {
          columns: [
            { text: "_________________________", fontSize: 11 },
            {},
            { text: "_________________________", fontSize: 11, alignment: "right" },
          ],
          columnGap: 20,
        },
        {
          columns: [
            { text: "Project Guide", fontSize: 11 },
            {},
            { text: "External Examiner", fontSize: 11, alignment: "right" },
          ],
          columnGap: 20,
        },
        blankLine(), blankLine(),
        centerText("_________________________", { fontSize: 11 }),
        centerText("Head of Department", { fontSize: 11 }),
        centerText("Department of Computer Science", { fontSize: 11 }),
        centerText("Vidhyadeep College", { fontSize: 11 }),
      ],
    });
  }

  // ==================== PROGRESS REPORTS (x3) ====================
  const phases = [
    {
      title: "Project Planning & Requirement Analysis",
      tasks: [
        "Literature survey and study of existing food delivery systems",
        "Requirement gathering and analysis",
        "Defining project scope and objectives",
        "Preparation of project proposal",
        "Technology stack selection and justification",
      ],
    },
    {
      title: "System Design & Development",
      tasks: [
        "Database design and schema definition",
        "UI/UX wireframe design",
        "Frontend development with React.js",
        "Backend API development with Express.js",
        "Authentication and authorization implementation",
      ],
    },
    {
      title: "Testing, Deployment & Documentation",
      tasks: [
        "Unit testing and integration testing",
        "Bug fixing and performance optimization",
        "System testing and user acceptance testing",
        "Project documentation and report preparation",
        "Final presentation preparation",
      ],
    },
  ];

  phases.forEach((phase, idx) => {
    const num = idx + 1;
    content.push({
      ...headerFooter(`Progress Report ${num}`),
      pageBreak: "before",
      stack: [
        heading1(`PROGRESS REPORT ${num}`),
        heading2("Report Details"),
        tableDef(
          ["Field", "Details"],
          [
            ["Project Title", "Food Delivery System"],
            ["Report Number", `Progress Report ${num}`],
            ["Date", BLANK],
            ["Duration", BLANK],
            ["Phase", phase.title],
          ],
          ["30%", "70%"]
        ),
        blankLine(),
        heading2("Phase Description"),
        bodyPara(`This progress report covers the ${phase.title} phase of the Food Delivery System project. During this phase, the team focused on the following key activities:`),
        blankLine(),
        ...phase.tasks.map((t) => bulletItem(`\u2022  ${t}`)),
        blankLine(),
        heading2("Member Task Allocation"),
        tableDef(
          ["Sr. No.", "Member Name", "Task Assigned", "Status"],
          [
            ["1", BLANK, BLANK, "Completed / In Progress"],
            ["2", BLANK, BLANK, "Completed / In Progress"],
            ["3", BLANK, BLANK, "Completed / In Progress"],
            ["4", BLANK, BLANK, "Completed / In Progress"],
          ],
          ["10%", "25%", "40%", "25%"]
        ),
        blankLine(),
        heading2("Supervisor Comments"),
        bodyPara("Comments: _____________________________________________________________________"),
        bodyPara("________________________________________________________________________________"),
        bodyPara("________________________________________________________________________________"),
        blankLine(),
        bodyPara("Signature: ________________________"),
        bodyPara(`Date: ${BLANK}`),
      ],
    });
  });

  // ==================== ACKNOWLEDGEMENT ====================
  content.push({
    ...headerFooter("Acknowledgement"),
    pageBreak: "before",
    stack: [
      heading1("ACKNOWLEDGEMENT"),
      blankLine(),
      bodyPara('We would like to express our sincere gratitude to all those who have contributed to the successful completion of this project on "Food Delivery System."'),
      bodyPara("First and foremost, we extend our heartfelt thanks to our project guide, " + BLANK + ", for their invaluable guidance, constant encouragement, and constructive feedback throughout the course of this project. Their expertise and mentorship have been instrumental in shaping our understanding and execution of this project."),
      bodyPara("We are deeply grateful to the Head of the Department of Computer Science, Vidhyadeep College, for providing us with the necessary resources and infrastructure to carry out this project successfully."),
      bodyPara("We would also like to thank our principal, " + BLANK + ", for creating an environment conducive to learning and innovation. Their support and encouragement have been a source of motivation for us."),
      bodyPara("Our sincere thanks go to all the faculty members of the Department of Computer Science for their valuable suggestions and support during the various phases of this project."),
      bodyPara("We extend our gratitude to our parents and family members for their unwavering support, patience, and encouragement throughout our academic journey."),
      bodyPara("Finally, we would like to thank all our friends and classmates who have helped us directly or indirectly in completing this project. Their cooperation and teamwork have made this endeavor a rewarding experience."),
      blankLine(), blankLine(),
      centerText("Thank You", { fontSize: 16, bold: true }),
    ],
  });

  // ==================== PREFACE ====================
  content.push({
    ...headerFooter("Preface"),
    pageBreak: "before",
    stack: [
      heading1("PREFACE"),
      blankLine(),
      bodyPara('This project report presents the design, development, and implementation of a "Food Delivery System" developed as a part of the Bachelor of Computer Science (BCS) program at Vidhyadeep College, Vidhyadeep University.'),
      bodyPara("The rapid growth of digital technology has transformed the way businesses operate, and the food industry is no exception. Online food delivery platforms have become an integral part of modern urban life, providing convenience to customers and expanding the reach of restaurants. This project was undertaken to understand and implement the technical aspects of building such a platform."),
      bodyPara("The primary objective of this project is to develop a full-stack web application that enables customers to order food online from local restaurants, allows restaurant owners to manage their menus and orders, and provides delivery partners with tools to fulfill deliveries efficiently. The application is built using the MERN stack (MongoDB, Express.js, React.js, Node.js), which is a popular and powerful technology stack for modern web development."),
      bodyPara("This report documents the complete project lifecycle, including requirement analysis, system design, implementation, testing, and future scope. Each chapter provides a detailed account of the processes and technologies involved in the development of the Food Delivery System."),
      bodyPara("We hope that this project report provides a comprehensive understanding of the work undertaken and demonstrates the practical application of the concepts learned during our academic program."),
      blankLine(), blankLine(),
      centerText("Authors", { fontSize: 13, bold: true }),
      blankLine(),
      centerText(`1. ${BLANK}`),
      centerText(`2. ${BLANK}`),
      centerText(`3. ${BLANK}`),
      centerText(`4. ${BLANK}`),
    ],
  });

  // ==================== INDEX ====================
  const indexItems = [
    ["Chapter 1", "Introduction", "1"],
    ["", "1.1 College Profile", "1"],
    ["", "1.2 Project Profile", "2"],
    ["Chapter 2", "Proposed System", "4"],
    ["", "2.1 Scope and Objective", "4"],
    ["", "2.2 Advantages", "5"],
    ["", "2.3 Feasibility Study", "6"],
    ["Chapter 3", "System Analysis", "8"],
    ["", "3.1 Existing System", "8"],
    ["", "3.2 Need for New System", "9"],
    ["", "3.3 Detailed SRS", "10"],
    ["Chapter 4", "System Planning", "12"],
    ["", "4.1 Requirement Analysis and Data Gathering", "12"],
    ["Chapter 5", "Tools & Environment Used", "14"],
    ["", "5.1 HW/SW Specification", "14"],
    ["", "5.2 Server/Client Side Tools", "15"],
    ["Chapter 6", "System Design", "18"],
    ["", "6.1 UML Diagrams", "18"],
    ["", "6.2 Database Design", "20"],
    ["", "6.3 User Interface Design", "23"],
    ["Chapter 7", "System Testing", "25"],
    ["", "7.1 Unit Testing", "25"],
    ["", "7.2 Integration Testing", "26"],
    ["", "7.3 System Testing", "27"],
    ["Chapter 8", "Future Enhancement", "28"],
    ["Chapter 9", "References", "29"],
    ["", "9.1 Webography", "29"],
    ["", "9.2 Bibliography", "30"],
  ];

  content.push({
    ...headerFooter("Index"),
    pageBreak: "before",
    stack: [
      heading1("INDEX"),
      blankLine(),
      tableDef(["Chapter", "Topic", "Page No."], indexItems, ["20%", "60%", "20%"]),
    ],
  });

  // ==================== CHAPTER 1 - INTRODUCTION ====================
  content.push({
    ...headerFooter("Chapter 1 - Introduction"),
    pageBreak: "before",
    stack: [
      heading1("CHAPTER 1"),
      centerText("INTRODUCTION", { fontSize: 20, bold: true, color: "1F3864" }),
      blankLine(),
      heading2("1.1 College Profile"),
      bodyPara("Vidhyadeep College is a premier educational institution affiliated with Vidhyadeep University, located in Surat, Gujarat. The college is committed to providing quality education in the field of computer science and information technology. With state-of-the-art infrastructure, experienced faculty, and a focus on practical learning, the college has established itself as a center of academic excellence."),
      bodyPara("The Department of Computer Science at Vidhyadeep College offers comprehensive programs that combine theoretical knowledge with hands-on experience. The department emphasizes project-based learning, industry collaboration, and research-oriented approach to prepare students for the challenges of the IT industry."),
      bodyPara("The college provides modern computer laboratories equipped with the latest hardware and software, high-speed internet connectivity, and a well-stocked library with access to digital resources. The institution encourages students to participate in workshops, seminars, hackathons, and industry visits to enhance their practical skills and industry exposure."),
      blankLine(),
      heading2("1.2 Project Profile"),
      tableDef(
        ["Parameter", "Details"],
        [
          ["Project Title", "Food Delivery System"],
          ["Project Type", "Full-Stack Web Application"],
          ["Domain", "E-Commerce / Food Technology"],
          ["Architecture", "MERN Stack"],
          ["Database", "MongoDB with Mongoose ODM"],
          ["Authentication", "JWT + Google OAuth (Firebase)"],
          ["Real-Time", "Socket.IO WebSocket"],
          ["Payment Gateway", "Razorpay"],
          ["Image Hosting", "Cloudinary"],
          ["Maps & Location", "Leaflet.js with OpenStreetMap"],
          ["Frontend", "React JS, HTML, CSS, JavaScript, Bootstrap"],
          ["Backend", "Node JS, Express JS"],
          ["State Management", "Redux Toolkit"],
          ["Course", "Bachelor of Computer Science (BCS)"],
          ["University", "Vidhyadeep University"],
          ["College", "Vidhyadeep College"],
          ["Academic Year", BLANK],
          ["Guide Name", BLANK],
        ],
        ["35%", "65%"]
      ),
      blankLine(),
      bodyPara("The Food Delivery System is a comprehensive full-stack web application designed to digitize the food ordering and delivery process. The application serves as a platform that connects three key stakeholders: customers who wish to order food, restaurant owners who prepare and manage orders, and delivery partners who fulfill the delivery."),
      bodyPara("The system provides a wide range of features including user registration and authentication with role-based access control, restaurant and menu management for owners, real-time order tracking with live GPS location of delivery partners, secure online payment integration via Razorpay, OTP-based delivery verification, rating and review system, favorites management, and an analytics dashboard for restaurant owners."),
      bodyPara("The application leverages modern web technologies and follows industry best practices for security, scalability, and user experience. The use of the MERN stack ensures a JavaScript-based development environment across the entire application, from the database layer to the user interface."),
    ],
  });

  // ==================== CHAPTER 2 - PROPOSED SYSTEM ====================
  content.push({
    ...headerFooter("Chapter 2 - Proposed System"),
    pageBreak: "before",
    stack: [
      heading1("CHAPTER 2"),
      centerText("PROPOSED SYSTEM", { fontSize: 20, bold: true, color: "1F3864" }),
      blankLine(),
      heading2("2.1 Scope and Objective"),
      bodyPara("The proposed Food Delivery System aims to provide a comprehensive digital platform that addresses the limitations of traditional food ordering methods. The scope of the project encompasses the development of a web-based application that facilitates seamless interaction between customers, restaurant owners, and delivery partners."),
      bodyPara("The primary objectives of the proposed system are as follows:"),
      bulletItem("\u2022  Develop a user-friendly web application for browsing restaurants, viewing menus, and placing food orders online."),
      bulletItem("\u2022  Implement a role-based access control system supporting Customer, Restaurant Owner, and Delivery Partner roles."),
      bulletItem("\u2022  Provide real-time order tracking using WebSocket technology (Socket.IO)."),
      bulletItem("\u2022  Integrate a secure online payment gateway (Razorpay) for safe financial transactions."),
      bulletItem("\u2022  Implement GPS-based restaurant discovery using MongoDB 2dsphere geospatial queries."),
      bulletItem("\u2022  Provide an analytics dashboard for restaurant owners with revenue charts and order statistics."),
      bulletItem("\u2022  Implement OTP-based delivery verification for secure delivery completion."),
      bulletItem("\u2022  Provide a rating and review system for customers to share feedback."),
      bulletItem("\u2022  Implement a favorites feature for customers to save preferred food items."),
      bulletItem("\u2022  Ensure responsive design for optimal experience across all devices."),
      blankLine(),
      heading2("2.2 Advantages"),
      heading3("Benefits to Admin (Restaurant Owners)"),
      bulletItem("\u2022  Digital menu management: Easily add, edit, and remove menu items with images, pricing, and availability."),
      bulletItem("\u2022  Real-time order management: Instant notifications and streamlined status updates."),
      bulletItem("\u2022  Analytics dashboard: Revenue, order trends, and top-performing item analysis."),
      bulletItem("\u2022  Automated delivery assignment to available delivery partners based on proximity."),
      bulletItem("\u2022  Shop status control: Toggle open/closed status with immediate customer visibility."),
      bulletItem("\u2022  Payment tracking: Automatic tracking of online payments via Razorpay."),
      blankLine(),
      heading3("Benefits to Customers"),
      bulletItem("\u2022  Convenience: Order food from multiple restaurants from anywhere."),
      bulletItem("\u2022  Real-time tracking: Live order status and delivery partner location."),
      bulletItem("\u2022  Multiple payment options: Cash on Delivery (COD) and online payment."),
      bulletItem("\u2022  GPS-based restaurant discovery in the customer's vicinity."),
      bulletItem("\u2022  Rating and review system for informed decision making."),
      bulletItem("\u2022  Favorites management and order history with reorder capability."),
      bulletItem("\u2022  Secure JWT-based authentication with Google OAuth support."),
      bulletItem("\u2022  OTP-based delivery verification for order security."),
      blankLine(),
      heading2("2.3 Feasibility Study"),
      heading3("2.3.1 Technical Feasibility"),
      bodyPara("The proposed Food Delivery System is technically feasible as it utilizes well-established and widely-used technologies. The MERN stack is a proven technology stack with extensive community support, comprehensive documentation, and a large ecosystem of libraries and tools."),
      bodyPara("MongoDB provides a flexible, scalable NoSQL database well-suited for dynamic data structures. React.js combined with Redux Toolkit provides a robust frontend framework. Node.js with Express.js provides a fast backend capable of handling concurrent requests and real-time communication via Socket.IO."),
      bodyPara("All required tools and libraries are freely available or offer free tiers, making the project technically viable without significant resource constraints."),
      blankLine(),
      heading3("2.3.2 Economical Feasibility"),
      bodyPara("The economic feasibility is established by the fact that all technologies used are open-source or available in free tiers. MongoDB Atlas, Cloudinary, and Firebase all offer free tiers suitable for development. The development environment requires only a standard computer with internet access."),
      bodyPara("The project can be deployed on cloud platforms such as Heroku, Vercel, or Railway, which offer free or affordable hosting options. This makes the project economically viable for both development and deployment."),
      blankLine(),
      heading3("2.3.3 Operational Feasibility"),
      bodyPara("The proposed system is operationally feasible as it addresses a genuine market need. The system is designed with a user-centric approach ensuring all three user roles can easily navigate and use the application without extensive training."),
      bodyPara("The intuitive user interface, clear navigation, and responsive design ensure users of varying technical proficiency can effectively use the system. The role-based access control reduces complexity, and the modular architecture allows for easy maintenance."),
    ],
  });

  // ==================== CHAPTER 3 - SYSTEM ANALYSIS ====================
  content.push({
    ...headerFooter("Chapter 3 - System Analysis"),
    pageBreak: "before",
    stack: [
      heading1("CHAPTER 3"),
      centerText("SYSTEM ANALYSIS", { fontSize: 20, bold: true, color: "1F3864" }),
      blankLine(),
      heading2("3.1 Existing System"),
      bodyPara("The traditional food ordering system relies heavily on manual processes and telephone-based communication. Customers typically need to call restaurants directly to place orders, which is time-consuming and prone to errors. The lack of a centralized platform makes it difficult for customers to compare menus, prices, and reviews."),
      bodyPara("The existing system suffers from several limitations:"),
      bulletItem("\u2022  Manual order taking leads to errors in order details and quantities."),
      bulletItem("\u2022  No real-time tracking capability, leaving customers unaware of order status."),
      bulletItem("\u2022  Limited payment options, typically restricted to cash on delivery."),
      bulletItem("\u2022  No centralized platform for restaurant discovery and comparison."),
      bulletItem("\u2022  Lack of digital records makes order history tracking difficult."),
      bulletItem("\u2022  Restaurant owners have limited tools for managing inventory and analyzing sales."),
      bulletItem("\u2022  Delivery management is manual and inefficient, causing delays."),
      bulletItem("\u2022  No mechanism for customers to provide feedback or rate their experience."),
      blankLine(),
      heading2("3.2 Need for New System"),
      bodyPara("The limitations of the existing system necessitate the development of a digital food delivery platform:"),
      bulletItem("\u2022  A digital platform for browsing restaurants, viewing menus, and placing orders accurately."),
      bulletItem("\u2022  Real-time order tracking providing transparency and reducing customer anxiety."),
      bulletItem("\u2022  Multiple payment options including online payment and COD."),
      bulletItem("\u2022  GPS-based restaurant discovery for finding nearby restaurants."),
      bulletItem("\u2022  Comprehensive order management with analytics for restaurant owners."),
      bulletItem("\u2022  Automated delivery assignment and tracking."),
      bulletItem("\u2022  Rating and review system for informed decisions and feedback."),
      bulletItem("\u2022  Secure authentication and OTP-based delivery verification."),
      bulletItem("\u2022  Digital records for tracking, auditing, and business analysis."),
      blankLine(),
      heading2("3.3 Detailed SRS (Software Requirement Specification)"),
      heading3("Functional Requirements - Customer"),
      bulletItem("\u2022  User registration and login (email/password and Google OAuth)"),
      bulletItem("\u2022  Browse restaurants by city with search functionality"),
      bulletItem("\u2022  View restaurant menus with item details, images, prices, and ratings"),
      bulletItem("\u2022  Add items to cart and manage cart quantities"),
      bulletItem("\u2022  Select delivery address using interactive map (Leaflet.js)"),
      bulletItem("\u2022  Choose payment method (COD or Online via Razorpay)"),
      bulletItem("\u2022  Track order status in real-time (Pending, Preparing, Out of Delivery, Delivered)"),
      bulletItem("\u2022  Track delivery partner live location on map"),
      bulletItem("\u2022  Verify delivery via OTP sent to email"),
      bulletItem("\u2022  Rate and review food items, manage favorites, reorder previous orders"),
      blankLine(),
      heading3("Functional Requirements - Restaurant Owner"),
      bulletItem("\u2022  Register and manage restaurant details (name, address, image, location)"),
      bulletItem("\u2022  Add, edit, and delete menu items with images, categories, and pricing"),
      bulletItem("\u2022  Toggle item availability and shop open/closed status"),
      bulletItem("\u2022  View and manage incoming orders with status updates"),
      bulletItem("\u2022  View analytics dashboard with revenue, order trends, and top items"),
      blankLine(),
      heading3("Functional Requirements - Delivery Partner"),
      bulletItem("\u2022  Register as delivery partner, toggle duty status"),
      bulletItem("\u2022  Receive real-time delivery assignment notifications via Socket.IO"),
      bulletItem("\u2022  Accept assignments, navigate to locations, verify delivery via OTP"),
      bulletItem("\u2022  View today's earnings and delivery statistics"),
      blankLine(),
      heading3("Non-Functional Requirements"),
      bulletItem("\u2022  Performance: Response within 2-3 seconds under normal load"),
      bulletItem("\u2022  Scalability: Support horizontal scaling for growing user bases"),
      bulletItem("\u2022  Security: Encrypted data, JWT authentication with expiration policies"),
      bulletItem("\u2022  Availability: 99.5% uptime target"),
      bulletItem("\u2022  Usability: Intuitive and responsive UI for desktop and mobile"),
      bulletItem("\u2022  Reliability: Graceful error handling with meaningful user feedback"),
    ],
  });

  // ==================== CHAPTER 4 - SYSTEM PLANNING ====================
  content.push({
    ...headerFooter("Chapter 4 - System Planning"),
    pageBreak: "before",
    stack: [
      heading1("CHAPTER 4"),
      centerText("SYSTEM PLANNING", { fontSize: 20, bold: true, color: "1F3864" }),
      blankLine(),
      heading2("4.1 Requirement Analysis and Data Gathering"),
      bodyPara("The requirement analysis phase involved a comprehensive study of existing food delivery platforms, user needs, and technical requirements. The data gathering process included:"),
      blankLine(),
      heading3("Study of Existing Systems"),
      bodyPara("A thorough analysis of popular food delivery platforms such as Swiggy, Zomato, and Uber Eats was conducted to understand standard features, user flows, and design patterns used in the industry."),
      blankLine(),
      heading3("User Requirement Analysis"),
      bodyPara("Requirements were gathered from three user perspectives:"),
      bulletItem("\u2022  Customers need a convenient platform to browse restaurants, order food, track deliveries, and provide feedback."),
      bulletItem("\u2022  Restaurant owners need tools to manage menus, process orders efficiently, and gain business insights."),
      bulletItem("\u2022  Delivery partners need a system to receive assignments, navigate to locations, and track earnings."),
      blankLine(),
      heading3("Technical Requirement Analysis"),
      bulletItem("\u2022  Frontend: React.js - component-based architecture, virtual DOM, extensive ecosystem"),
      bulletItem("\u2022  Backend: Node.js with Express.js - non-blocking I/O, JavaScript consistency, middleware support"),
      bulletItem("\u2022  Database: MongoDB - flexible schema, native geospatial support, scalability"),
      bulletItem("\u2022  Authentication: JWT for stateless auth, Firebase for Google OAuth"),
      bulletItem("\u2022  Real-Time: Socket.IO for bidirectional WebSocket communication"),
      bulletItem("\u2022  Payment: Razorpay - comprehensive API, popular in Indian market"),
      bulletItem("\u2022  Image Hosting: Cloudinary - robust image management and CDN"),
      bulletItem("\u2022  Maps: Leaflet.js with OpenStreetMap - free, open-source mapping"),
      blankLine(),
      heading3("Data Flow Analysis"),
      bodyPara("Key data flows in the system:"),
      bulletItem("\u2022  Authentication flow: Login/Register -> JWT generation -> Cookie storage -> Protected routes"),
      bulletItem("\u2022  Order flow: Cart -> Checkout -> Payment -> Order creation -> Socket notification to owner"),
      bulletItem("\u2022  Delivery flow: Owner updates status -> Broadcast to nearby delivery boys -> Accept -> Assignment"),
      bulletItem("\u2022  Tracking flow: Customer requests tracking -> Real-time status + GPS via Socket.IO"),
      blankLine(),
      heading3("Feasibility Analysis"),
      bodyPara("A comprehensive feasibility analysis covering technical, economic, and operational aspects confirmed the project is viable on all dimensions, as detailed in Chapter 2, Section 2.3."),
    ],
  });

  // ==================== CHAPTER 5 - TOOLS & ENVIRONMENT ====================
  content.push({
    ...headerFooter("Chapter 5 - Tools & Environment"),
    pageBreak: "before",
    stack: [
      heading1("CHAPTER 5"),
      centerText("TOOLS & ENVIRONMENT USED", { fontSize: 20, bold: true, color: "1F3864" }),
      blankLine(),
      heading2("5.1 Hardware and Software Specification"),
      heading3("5.1.1 Software Specification"),
      tableDef(
        ["Software", "Specification"],
        [
          ["Operating System", "Windows 10/11, macOS, or Linux"],
          ["Code Editor", "Visual Studio Code"],
          ["Web Browser", "Google Chrome / Firefox (Latest)"],
          ["Node.js", "Version 18.x or higher"],
          ["npm", "Version 9.x or higher"],
          ["MongoDB", "Version 7.x (or MongoDB Atlas Cloud)"],
          ["Git", "Version 2.x"],
          ["Postman", "For API testing"],
        ],
        ["35%", "65%"]
      ),
      blankLine(),
      heading3("5.1.2 Hardware Specification"),
      tableDef(
        ["Component", "Minimum Requirement"],
        [
          ["Processor", "Intel Core i3 or equivalent (i5 recommended)"],
          ["RAM", "4 GB minimum (8 GB recommended)"],
          ["Hard Disk", "256 GB SSD (recommended)"],
          ["Display", "1366 x 768 resolution or higher"],
          ["Internet", "Broadband connection"],
        ],
        ["35%", "65%"]
      ),
      blankLine(),
      heading2("5.2 Server Side and Client Side Tools"),
      heading3("Overview of React JS"),
      bodyPara("React.js is an open-source JavaScript library developed by Facebook (Meta) for building user interfaces, particularly single-page applications. It uses a component-based architecture that allows developers to build reusable UI components and manage application state efficiently."),
      bodyPara("React uses a virtual DOM that optimizes rendering performance by minimizing direct manipulation of the actual DOM. When component state changes, React updates the virtual DOM, compares it with the previous version (reconciliation), and applies only necessary changes to the real DOM."),
      bodyPara("In this project, React.js (v19.1.1) is the primary frontend framework. The application uses functional components with React Hooks, Redux Toolkit for global state management, and React Router DOM for client-side routing."),
      blankLine(),
      heading3("Overview of Node JS"),
      bodyPara("Node.js is an open-source, cross-platform JavaScript runtime environment built on Chrome's V8 engine. It allows developers to execute JavaScript on the server side, enabling a single programming language across the entire stack."),
      bodyPara("Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient for data-intensive real-time applications. Its package ecosystem (npm) is the largest software registry in the world."),
      bodyPara("In this project, Node.js serves as the backend runtime, handling HTTP requests, database operations, JWT authentication, payment verifications, WebSocket connections via Socket.IO, and third-party service integrations."),
      blankLine(),
      heading3("Overview of MongoDB"),
      bodyPara("MongoDB is a popular NoSQL database that stores data in flexible, JSON-like documents (BSON). Unlike relational databases, it does not require a predefined schema, allowing dynamic and flexible data structures."),
      bodyPara("MongoDB provides powerful querying including ad-hoc queries, indexing, aggregation pipelines, and geospatial queries. The 2dsphere index enables efficient location-based restaurant discovery."),
      bodyPara("In this project, MongoDB is the primary database hosted on MongoDB Atlas. Mongoose ODM defines schemas, validates data, and manages relationships across Users, Shops, Items, Orders, DeliveryAssignments, and Reviews collections."),
      blankLine(),
      heading3("Overview of Express JS"),
      bodyPara("Express.js is a minimal and flexible Node.js web framework providing robust features for building web applications and APIs. It offers a thin layer over Node.js features with routing, middleware support, and HTTP utilities."),
      bodyPara("In this project, Express.js (v5.2.1) handles API routing, middleware integration (auth, Multer, CORS, cookie parsing), request validation, and error handling with a modular route structure."),
      blankLine(),
      heading3("Overview of JavaScript"),
      bodyPara("JavaScript is a high-level, interpreted programming language - a core web technology. Originally for client-side scripting, it now powers server-side (Node.js), mobile, and desktop development."),
      bodyPara("JavaScript supports object-oriented, functional, and event-driven paradigms. ES6+ features (arrow functions, destructuring, Promises, async/await, classes) are extensively used throughout the codebase."),
      blankLine(),
      heading3("Overview of HTML"),
      bodyPara("HTML (HyperText Markup Language) is the standard markup language for creating web pages. It provides structural foundation through elements and attributes defining content layout."),
      bodyPara("In this project, HTML is used within React's JSX syntax, allowing HTML-like code within JavaScript that is transformed into React elements."),
      blankLine(),
      heading3("Overview of CSS"),
      bodyPara("CSS (Cascading Style Sheets) describes the presentation of HTML documents, controlling layout, colors, fonts, and visual appearance."),
      bodyPara("In this project, CSS is used through Tailwind CSS (utility-first framework) and custom CSS. Tailwind provides pre-defined utility classes for rapid UI development, while custom CSS handles specific styling and animations. Bootstrap is also used for certain components."),
    ],
  });

  // ==================== CHAPTER 6 - SYSTEM DESIGN ====================
  content.push({
    ...headerFooter("Chapter 6 - System Design"),
    pageBreak: "before",
    stack: [
      heading1("CHAPTER 6"),
      centerText("SYSTEM DESIGN", { fontSize: 20, bold: true, color: "1F3864" }),
      blankLine(),
      heading2("6.1 UML Diagrams"),
      heading3("6.1.1 Use Case Diagram (Admin Side)"),
      bodyPara("The following describes the interactions between the Restaurant Owner (Admin) and the system:"),
      blankLine(),
      placeholderImage("Use Case Diagram - Admin"),
      placeholderLabel("[Insert UML Use Case Diagram - Admin Side]"),
      bodyPara("Admin Use Cases:"),
      bulletItem("\u2022  Register/Login to the system"),
      bulletItem("\u2022  Create and manage restaurant profile"),
      bulletItem("\u2022  Add, edit, and delete menu items"),
      bulletItem("\u2022  Toggle item availability and shop status"),
      bulletItem("\u2022  View and process incoming orders with status updates"),
      bulletItem("\u2022  View analytics dashboard (revenue, orders, charts)"),
      bulletItem("\u2022  Manage user profile"),
      blankLine(),
      heading3("6.1.2 Use Case Diagram (User/Customer Side)"),
      bodyPara("The following describes the interactions between the Customer and the system:"),
      blankLine(),
      placeholderImage("Use Case Diagram - Customer"),
      placeholderLabel("[Insert UML Use Case Diagram - Customer Side]"),
      bodyPara("Customer Use Cases:"),
      bulletItem("\u2022  Register/Login (email/password or Google OAuth)"),
      bulletItem("\u2022  Browse restaurants, search food items, view menus"),
      bulletItem("\u2022  Add to cart, select delivery address on map, choose payment"),
      bulletItem("\u2022  Place order, track status in real-time, track delivery location"),
      bulletItem("\u2022  Verify delivery via OTP, rate and review items"),
      bulletItem("\u2022  Manage favorites, view order history, reorder, manage profile"),
      blankLine(),
      heading2("6.2 Database Design"),
      bodyPara("The database follows a document-oriented approach using MongoDB. Data is organized into collections with ObjectId references and embedded sub-documents."),
      blankLine(),
      heading3("6.2.1 Data Dictionary"),
      heading3("Table: Users/Customers"),
      smallTable(
        ["Field Name", "Data Type", "Constraints", "Description"],
        [
          ["_id", "ObjectId", "PK, Auto", "Unique user identifier"],
          ["fullname", "String", "Required", "Full name of the user"],
          ["email", "String", "Required, Unique", "Email address for login"],
          ["password", "String", "Optional", "Hashed password (bcrypt)"],
          ["mobile", "String", "Required", "Phone number"],
          ["role", "String", "Enum", "user / owner / deliveryBoy"],
          ["socketId", "String", "Optional", "Socket.IO connection ID"],
          ["isOnline", "Boolean", "Default: false", "Online status"],
          ["resetOtp", "String", "Optional", "OTP for password reset"],
          ["isOtpVerified", "Boolean", "Default: false", "OTP verification"],
          ["otpExpires", "Date", "Optional", "OTP expiration time"],
          ["location", "GeoJSON", "2dsphere", "GPS coordinates"],
          ["favorites", "[ObjectId]", "Optional", "Favorite items refs"],
          ["isDutyOn", "Boolean", "Default: true", "Delivery duty toggle"],
          ["createdAt", "Date", "Auto", "Creation timestamp"],
          ["updatedAt", "Date", "Auto", "Update timestamp"],
        ],
        ["18%", "15%", "20%", "47%"]
      ),
      blankLine(),
      heading3("Table: Restaurants (Shops)"),
      smallTable(
        ["Field Name", "Data Type", "Constraints", "Description"],
        [
          ["_id", "ObjectId", "PK, Auto", "Unique shop identifier"],
          ["name", "String", "Required", "Restaurant name"],
          ["image", "String", "Required", "Cloudinary image URL"],
          ["owner", "ObjectId", "Ref: Users", "Owner reference"],
          ["city", "String", "Required", "City name"],
          ["state", "String", "Required", "State name"],
          ["address", "String", "Required", "Full address"],
          ["items", "[ObjectId]", "Ref: Items", "Menu items references"],
          ["location", "GeoJSON", "2dsphere", "GPS coordinates"],
          ["isOpen", "Boolean", "Default: true", "Shop status"],
          ["createdAt", "Date", "Auto", "Creation timestamp"],
          ["updatedAt", "Date", "Auto", "Update timestamp"],
        ],
        ["18%", "15%", "20%", "47%"]
      ),
      blankLine(),
      heading3("Table: Menu Items"),
      smallTable(
        ["Field Name", "Data Type", "Constraints", "Description"],
        [
          ["_id", "ObjectId", "PK, Auto", "Unique item identifier"],
          ["name", "String", "Required", "Item name"],
          ["image", "String", "Required", "Cloudinary image URL"],
          ["shop", "ObjectId", "Ref: Shops", "Shop reference"],
          ["category", "String", "Enum", "Food category"],
          ["price", "Number", "Min: 0", "Item price in INR"],
          ["foodType", "String", "Enum", "veg / non-veg"],
          ["rating", "Object", "Default: {0,0}", "{average, count}"],
          ["isAvailable", "Boolean", "Default: true", "Availability"],
          ["createdAt", "Date", "Auto", "Creation timestamp"],
          ["updatedAt", "Date", "Auto", "Update timestamp"],
        ],
        ["18%", "15%", "20%", "47%"]
      ),
      blankLine(),
      heading3("Table: Orders"),
      smallTable(
        ["Field Name", "Data Type", "Constraints", "Description"],
        [
          ["_id", "ObjectId", "PK, Auto", "Unique order identifier"],
          ["user", "ObjectId", "Ref: Users", "Customer reference"],
          ["paymentMethod", "String", "Enum", "cod / online"],
          ["deliveryAddress", "Object", "Required", "{text, lat, lng}"],
          ["totalAmount", "Number", "Required", "Total order amount"],
          ["shopOrders", "[ShopOrder]", "Required", "Embedded shop orders"],
          ["payment", "Boolean", "Default: false", "Payment status"],
          ["razorpayOrderId", "String", "Optional", "Razorpay order ID"],
          ["razorpayPaymentId", "String", "Optional", "Razorpay payment ID"],
          ["createdAt", "Date", "Auto", "Creation timestamp"],
          ["updatedAt", "Date", "Auto", "Update timestamp"],
        ],
        ["18%", "15%", "20%", "47%"]
      ),
      blankLine(),
      heading3("Table: Cart (Virtual - Redux State)"),
      bodyPara("Cart is managed as virtual state in Redux store, persisted in browser session and synced during checkout."),
      smallTable(
        ["Field Name", "Data Type", "Constraints", "Description"],
        [
          ["itemId", "ObjectId", "Required", "Menu item reference"],
          ["name", "String", "Required", "Item name"],
          ["price", "Number", "Required", "Item price"],
          ["quantity", "Number", "Min: 1", "Cart quantity"],
          ["shopId", "ObjectId", "Required", "Shop reference"],
          ["image", "String", "Optional", "Item image URL"],
        ],
        ["18%", "15%", "20%", "47%"]
      ),
      blankLine(),
      heading3("Table: Payments (Embedded in Orders)"),
      smallTable(
        ["Field Name", "Data Type", "Constraints", "Description"],
        [
          ["paymentMethod", "String", "Enum", "cod / online"],
          ["payment", "Boolean", "Default: false", "Completion status"],
          ["razorpayOrderId", "String", "Optional", "Razorpay order ID"],
          ["razorpayPaymentId", "String", "Optional", "Razorpay payment ID"],
          ["totalAmount", "Number", "Required", "Amount paid"],
        ],
        ["18%", "15%", "20%", "47%"]
      ),
      blankLine(),
      heading3("Table: Delivery (DeliveryAssignment)"),
      smallTable(
        ["Field Name", "Data Type", "Constraints", "Description"],
        [
          ["_id", "ObjectId", "PK, Auto", "Unique assignment ID"],
          ["order", "ObjectId", "Ref: Orders", "Order reference"],
          ["shop", "ObjectId", "Ref: Shops", "Shop reference"],
          ["shopOrderId", "ObjectId", "Required", "Shop order sub-doc ID"],
          ["broadcastedTo", "[ObjectId]", "Ref: Users", "Boys notified"],
          ["assignedTo", "ObjectId", "Ref: Users", "Assigned boy"],
          ["status", "String", "Enum", "broadcasted/assigned/expired/completed"],
          ["acceptedAt", "Date", "Optional", "Acceptance time"],
        ],
        ["18%", "15%", "20%", "47%"]
      ),
      blankLine(),
      heading2("6.3 User Interface Design"),
      heading3("Customer Side"),
      bodyPara("The customer-facing UI is designed to be intuitive, visually appealing, and responsive:"),
      blankLine(),
      placeholderImage("Landing Page"),
      placeholderLabel("Figure 6.1: Landing Page - Entry point with hero section and role cards"),
      placeholderImage("Customer Dashboard"),
      placeholderLabel("Figure 6.2: Customer Dashboard - Categories, restaurants, and food items"),
      placeholderImage("Shop Page"),
      placeholderLabel("Figure 6.3: Shop Page - Restaurant menu with item cards"),
      placeholderImage("Cart Page"),
      placeholderLabel("Figure 6.4: Cart Page - Items with quantity controls and order summary"),
      placeholderImage("Checkout Page"),
      placeholderLabel("Figure 6.5: Checkout Page - Address selection and payment method"),
      placeholderImage("Order Tracking"),
      placeholderLabel("Figure 6.6: Order Tracking - Status stepper and delivery map"),
      blankLine(),
      heading3("Admin Side"),
      bodyPara("The admin/owner interface is designed for efficiency and ease of management:"),
      blankLine(),
      placeholderImage("Owner Dashboard"),
      placeholderLabel("Figure 6.7: Owner Dashboard - Menu items and sales insights"),
      placeholderImage("Add Item"),
      placeholderLabel("Figure 6.8: Add Item Page - Form for adding menu items"),
      placeholderImage("Owner Orders"),
      placeholderLabel("Figure 6.9: Owner Orders - Order management with status updates"),
      placeholderImage("Analytics"),
      placeholderLabel("Figure 6.10: Analytics Dashboard - Revenue charts and top items"),
      placeholderImage("Delivery Dashboard"),
      placeholderLabel("Figure 6.11: Delivery Dashboard - Earnings, assignments, and tracking"),
    ],
  });

  // ==================== CHAPTER 7 - SYSTEM TESTING ====================
  const testRows = [
    ["1", "User Registration", "Register with valid details", "Account created", "As expected", "Pass"],
    ["2", "User Login", "Login with valid credentials", "JWT issued, redirected", "As expected", "Pass"],
    ["3", "Google OAuth", "Login via Google", "Account linked", "As expected", "Pass"],
    ["4", "Password Reset", "Reset via OTP", "Password updated", "As expected", "Pass"],
    ["5", "Add Menu Item", "Add item with all fields", "Item created", "As expected", "Pass"],
    ["6", "Edit Menu Item", "Update item details", "Item updated", "As expected", "Pass"],
    ["7", "Delete Menu Item", "Delete an item", "Item removed", "As expected", "Pass"],
    ["8", "Toggle Availability", "Toggle item status", "Status updated", "As expected", "Pass"],
    ["9", "Add to Cart", "Add item to cart", "Cart updated", "As expected", "Pass"],
    ["10", "Update Cart Qty", "Change quantity", "Cart recalculated", "As expected", "Pass"],
    ["11", "Place Order (COD)", "Place order with COD", "Order created", "As expected", "Pass"],
    ["12", "Place Order (Online)", "Place via Razorpay", "Payment verified", "As expected", "Pass"],
    ["13", "Update Order Status", "Owner updates status", "Status changed", "As expected", "Pass"],
    ["14", "Accept Delivery", "Delivery boy accepts", "Assignment created", "As expected", "Pass"],
    ["15", "Verify Delivery OTP", "Enter correct OTP", "Delivery complete", "As expected", "Pass"],
    ["16", "Rate Item", "Submit rating 1-5", "Rating recorded", "As expected", "Pass"],
    ["17", "Add Review", "Submit review", "Review displayed", "As expected", "Pass"],
    ["18", "Toggle Favorite", "Favorite/unfavorite", "Favorites updated", "As expected", "Pass"],
    ["19", "Search Items", "Search by keyword", "Results shown", "As expected", "Pass"],
    ["20", "Track Order", "View tracking", "Live status shown", "As expected", "Pass"],
    ["21", "Toggle Shop Status", "Open/close shop", "Status updated", "As expected", "Pass"],
    ["22", "View Analytics", "Open dashboard", "Charts displayed", "As expected", "Pass"],
    ["23", "Delivery Duty", "Toggle duty", "Assignment updated", "As expected", "Pass"],
    ["24", "Reorder", "Reorder previous", "New order placed", "As expected", "Pass"],
  ];

  content.push({
    ...headerFooter("Chapter 7 - System Testing"),
    pageBreak: "before",
    stack: [
      heading1("CHAPTER 7"),
      centerText("SYSTEM TESTING", { fontSize: 20, bold: true, color: "1F3864" }),
      blankLine(),
      bodyPara("System testing ensures the developed application meets specified requirements and functions correctly. Testing was conducted in multiple phases for comprehensive coverage."),
      blankLine(),
      heading2("Testing Checklist"),
      smallTable(
        ["Sr.", "Feature", "Test Case", "Expected", "Actual", "Status"],
        testRows,
        ["5%", "16%", "24%", "22%", "18%", "15%"]
      ),
      blankLine(),
      heading2("7.1 Unit Testing"),
      bodyPara("Unit testing involves testing individual components in isolation. Tests were written for critical backend and frontend functions."),
      bodyPara("Backend unit tests:"),
      bulletItem("\u2022  Authentication controller functions (signup, signin, signout, password reset)"),
      bulletItem("\u2022  CRUD operations for shops, items, and orders"),
      bulletItem("\u2022  Payment verification logic with Razorpay signature validation"),
      bulletItem("\u2022  OTP generation and verification functions"),
      bulletItem("\u2022  Geospatial query functions for nearby restaurants and delivery partners"),
      bodyPara("Frontend unit tests:"),
      bulletItem("\u2022  Redux slice reducers and actions"),
      bulletItem("\u2022  Utility functions for date formatting and price calculations"),
      bulletItem("\u2022  Form validation logic"),
      bulletItem("\u2022  Component rendering with various prop combinations"),
      blankLine(),
      heading2("7.2 Integration Testing"),
      bodyPara("Integration testing verifies that different modules work well together:"),
      bulletItem("\u2022  Frontend-Backend API integration: API calls correctly handled by Express.js routes"),
      bulletItem("\u2022  Database integration: Mongoose operations, schema validation, relationship integrity"),
      bulletItem("\u2022  Socket.IO integration: Real-time event emission for notifications and tracking"),
      bulletItem("\u2022  Third-party integration: Cloudinary upload, Razorpay payment, Nodemailer email, Firebase OAuth"),
      bulletItem("\u2022  Authentication flow: JWT generation, cookie storage, middleware-based protection"),
      blankLine(),
      heading2("7.3 System Testing"),
      bodyPara("System testing covered end-to-end workflows across all user roles:"),
      bulletItem("\u2022  Customer workflow: Register -> Browse -> Cart -> Checkout -> Payment -> Track -> Rate"),
      bulletItem("\u2022  Owner workflow: Register -> Create Shop -> Add Items -> Manage Orders -> Analytics"),
      bulletItem("\u2022  Delivery workflow: Register -> Toggle Duty -> Accept -> Navigate -> Verify OTP -> Earnings"),
      bulletItem("\u2022  Cross-role interaction: Actions by one role correctly reflected in other roles"),
      bulletItem("\u2022  Error handling: Invalid inputs, network failures, edge cases"),
      bulletItem("\u2022  Responsive design: UI across different screen sizes and devices"),
      bulletItem("\u2022  Performance: Response times under normal and peak load conditions"),
    ],
  });

  // ==================== CHAPTER 8 - FUTURE ENHANCEMENT ====================
  content.push({
    ...headerFooter("Chapter 8 - Future Enhancement"),
    pageBreak: "before",
    stack: [
      heading1("CHAPTER 8"),
      centerText("FUTURE ENHANCEMENT", { fontSize: 20, bold: true, color: "1F3864" }),
      blankLine(),
      bodyPara("The Food Delivery System has significant potential for future enhancements:"),
      blankLine(),
      { text: "1. Mobile Application Development", bold: true, fontSize: 11, margin: [0, 5, 0, 3] },
      bodyPara("Develop native Android and iOS apps using React Native with push notifications for order updates."),
      { text: "2. AI-Based Recommendation Engine", bold: true, fontSize: 11, margin: [0, 5, 0, 3] },
      bodyPara("Implement ML-based recommendations suggesting restaurants and items based on order history and preferences."),
      { text: "3. Chat Support System", bold: true, fontSize: 11, margin: [0, 5, 0, 3] },
      bodyPara("Integrate real-time chat for communication between customers, restaurant owners, and delivery partners."),
      { text: "4. Multi-Language Support", bold: true, fontSize: 11, margin: [0, 5, 0, 3] },
      bodyPara("Implement internationalization (i18n) for multiple languages to reach a wider audience."),
      { text: "5. Advanced Analytics", bold: true, fontSize: 11, margin: [0, 5, 0, 3] },
      bodyPara("Add predictive analytics for demand forecasting, customer segmentation, and competitor benchmarking."),
      { text: "6. Subscription and Loyalty Programs", bold: true, fontSize: 11, margin: [0, 5, 0, 3] },
      bodyPara("Implement subscription models with free delivery and a loyalty points system for repeat orders."),
      { text: "7. Voice Ordering", bold: true, fontSize: 11, margin: [0, 5, 0, 3] },
      bodyPara("Integrate voice recognition for placing orders via voice commands using Web Speech API."),
      { text: "8. Restaurant Table Booking", bold: true, fontSize: 11, margin: [0, 5, 0, 3] },
      bodyPara("Add table reservation with real-time availability checking and confirmation notifications."),
      { text: "9. Social Features", bold: true, fontSize: 11, margin: [0, 5, 0, 3] },
      bodyPara("Enable order sharing, group orders, and social media integration for reviews."),
      { text: "10. Delivery Route Optimization", bold: true, fontSize: 11, margin: [0, 5, 0, 3] },
      bodyPara("Implement advanced routing algorithms to optimize delivery routes and reduce delivery time."),
      { text: "11. Inventory Management", bold: true, fontSize: 11, margin: [0, 5, 0, 3] },
      bodyPara("Add inventory tracking with automatic low-stock alerts and purchase order generation."),
      { text: "12. Multi-Restaurant Cart", bold: true, fontSize: 11, margin: [0, 5, 0, 3] },
      bodyPara("Enable adding items from multiple restaurants to a single cart with unified checkout."),
    ],
  });

  // ==================== CHAPTER 9 - REFERENCES ====================
  content.push({
    ...headerFooter("Chapter 9 - References"),
    pageBreak: "before",
    stack: [
      heading1("CHAPTER 9"),
      centerText("REFERENCES", { fontSize: 20, bold: true, color: "1F3864" }),
      blankLine(),
      heading2("9.1 Webography"),
      bodyPara("Online resources referenced during development:"),
      blankLine(),
      { text: "1. React.js Official Documentation", bold: true, fontSize: 11, margin: [0, 3, 0, 1] },
      bodyPara("https://react.dev/"),
      { text: "2. Node.js Official Documentation", bold: true, fontSize: 11, margin: [0, 3, 0, 1] },
      bodyPara("https://nodejs.org/en/docs/"),
      { text: "3. Express.js Official Documentation", bold: true, fontSize: 11, margin: [0, 3, 0, 1] },
      bodyPara("https://expressjs.com/"),
      { text: "4. MongoDB Official Documentation", bold: true, fontSize: 11, margin: [0, 3, 0, 1] },
      bodyPara("https://www.mongodb.com/docs/"),
      { text: "5. Mongoose ODM Documentation", bold: true, fontSize: 11, margin: [0, 3, 0, 1] },
      bodyPara("https://mongoosejs.com/docs/"),
      { text: "6. Redux Toolkit Documentation", bold: true, fontSize: 11, margin: [0, 3, 0, 1] },
      bodyPara("https://redux-toolkit.js.org/"),
      { text: "7. Socket.IO Documentation", bold: true, fontSize: 11, margin: [0, 3, 0, 1] },
      bodyPara("https://socket.io/docs/"),
      { text: "8. Razorpay Payment Gateway Documentation", bold: true, fontSize: 11, margin: [0, 3, 0, 1] },
      bodyPara("https://razorpay.com/docs/"),
      { text: "9. Cloudinary Documentation", bold: true, fontSize: 11, margin: [0, 3, 0, 1] },
      bodyPara("https://cloudinary.com/documentation"),
      { text: "10. Firebase Authentication Documentation", bold: true, fontSize: 11, margin: [0, 3, 0, 1] },
      bodyPara("https://firebase.google.com/docs/auth"),
      { text: "11. Leaflet.js Documentation", bold: true, fontSize: 11, margin: [0, 3, 0, 1] },
      bodyPara("https://leafletjs.com/reference.html"),
      { text: "12. JWT (JSON Web Token) Documentation", bold: true, fontSize: 11, margin: [0, 3, 0, 1] },
      bodyPara("https://jwt.io/introduction"),
      { text: "13. Tailwind CSS Documentation", bold: true, fontSize: 11, margin: [0, 3, 0, 1] },
      bodyPara("https://tailwindcss.com/docs"),
      { text: "14. Nodemailer Documentation", bold: true, fontSize: 11, margin: [0, 3, 0, 1] },
      bodyPara("https://nodemailer.com/"),
      { text: "15. bcrypt.js Documentation", bold: true, fontSize: 11, margin: [0, 3, 0, 1] },
      bodyPara("https://www.npmjs.com/package/bcrypt"),
      blankLine(),
      heading2("9.2 Bibliography"),
      bodyPara("Books, journals, and articles referenced:"),
      blankLine(),
      { text: "1. Learning React: Modern Patterns for Developing React Apps", italics: true, bold: true, fontSize: 11 },
      bodyPara("Authors: Eve Porcello and Alex Banks | Publisher: O'Reilly Media, 2020"),
      { text: "2. Node.js Design Patterns", italics: true, bold: true, fontSize: 11, margin: [0, 5, 0, 1] },
      bodyPara("Authors: Mario Casciaro and Luciano Mammino | Publisher: Packt Publishing, 2020"),
      { text: "3. MongoDB: The Definitive Guide", italics: true, bold: true, fontSize: 11, margin: [0, 5, 0, 1] },
      bodyPara("Authors: Shannon Bradshaw, Eoin Brazil, Kristina Chodorow | Publisher: O'Reilly Media, 2019"),
      { text: "4. JavaScript: The Good Parts", italics: true, bold: true, fontSize: 11, margin: [0, 5, 0, 1] },
      bodyPara("Author: Douglas Crockford | Publisher: O'Reilly Media, 2008"),
      { text: "5. Eloquent JavaScript", italics: true, bold: true, fontSize: 11, margin: [0, 5, 0, 1] },
      bodyPara("Author: Marijn Haverbeke | Publisher: No Starch Press, 2018"),
      { text: "6. Web Application Architecture: Principles, Protocols and Practices", italics: true, bold: true, fontSize: 11, margin: [0, 5, 0, 1] },
      bodyPara("Authors: Leon Shklar and Richard Rosen | Publisher: Wiley, 2012"),
      { text: "7. Designing Data-Intensive Applications", italics: true, bold: true, fontSize: 11, margin: [0, 5, 0, 1] },
      bodyPara("Author: Martin Kleppmann | Publisher: O'Reilly Media, 2017"),
      { text: "8. Clean Code: A Handbook of Agile Software Craftsmanship", italics: true, bold: true, fontSize: 11, margin: [0, 5, 0, 1] },
      bodyPara("Author: Robert C. Martin | Publisher: Prentice Hall, 2008"),
    ],
  });

  return {
    pageSize: "A4",
    pageMargins: [72, 90, 72, 90],
    defaultStyle: {
      font: "Roboto",
      fontSize: 11,
      lineHeight: 1.5,
    },
    content,
    pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
      // Force page break before each heading1
      if (currentNode.headlineLevel === 1) return true;
      return false;
    },
  };
}

// Generate PDF
const docDefinition = buildDoc();
const pdfDoc = printer.createPdfKitDocument(docDefinition);
const outputPath = path.join(__dirname, "Food_Delivery_System_Blackbook.pdf");
const writeStream = fs.createWriteStream(outputPath);
pdfDoc.pipe(writeStream);
pdfDoc.end();
writeStream.on("finish", () => {
  console.log(`PDF generated successfully: ${outputPath}`);
  const stats = fs.statSync(outputPath);
  console.log(`File size: ${(stats.size / 1024).toFixed(1)} KB`);
});
