const fs = require("fs");
const {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  PageBreak,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  WidthType,
  Header,
  Footer,
  TabStopPosition,
  TabStopType,
  Packer,
  ShadingType,
  LevelFormat,
  ExternalHyperlink,
} = require("docx");

// ============================================================
// UTILITY HELPERS
// ============================================================
const BLANK = "___________";
const FONT = "Times New Roman";
const TITLE_SIZE = 52;
const HEADING1_SIZE = 36;
const HEADING2_SIZE = 28;
const HEADING3_SIZE = 24;
const BODY_SIZE = 24; // 12pt
const SMALL_SIZE = 20;

function heading1(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, bold: true, size: HEADING1_SIZE, color: "1F3864" })],
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    pageBreakBefore: true,
  });
}

function heading2(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, bold: true, size: HEADING2_SIZE, color: "2E5090" })],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
  });
}

function heading3(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, bold: true, size: HEADING3_SIZE, color: "375F9E" })],
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
  });
}

function bodyPara(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: BODY_SIZE, ...opts })],
    spacing: { after: 120, line: 360 },
    alignment: AlignmentType.JUSTIFIED,
  });
}

function bodyRuns(runs) {
  return new Paragraph({
    children: runs.map((r) => new TextRun({ font: FONT, size: BODY_SIZE, ...r })),
    spacing: { after: 120, line: 360 },
    alignment: AlignmentType.JUSTIFIED,
  });
}

function bulletPara(text, level = 0) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: BODY_SIZE })],
    bullet: { level },
    spacing: { after: 60, line: 360 },
  });
}

function blankLine() {
  return new Paragraph({ children: [], spacing: { after: 100 } });
}

function centerPara(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: BODY_SIZE, ...opts })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
  });
}

function centerRuns(runs) {
  return new Paragraph({
    children: runs.map((r) => new TextRun({ font: FONT, size: BODY_SIZE, ...r })),
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
  });
}

function emptyLine() {
  return new Paragraph({ children: [new TextRun({ text: " ", font: FONT, size: BODY_SIZE })] });
}

function makeTable(headers, rows, widths) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(
      (h, i) =>
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: h, font: FONT, bold: true, size: BODY_SIZE, color: "FFFFFF" })], alignment: AlignmentType.CENTER })],
          shading: { type: ShadingType.SOLID, color: "1F3864" },
          width: widths ? { size: widths[i], type: WidthType.PERCENTAGE } : undefined,
        })
    ),
  });

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: String(cell), font: FONT, size: BODY_SIZE })], alignment: AlignmentType.CENTER })],
              width: widths ? { size: widths[row.indexOf(cell)], type: WidthType.PERCENTAGE } : undefined,
            })
        ),
      })
  );

  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

// ============================================================
// COMMON HEADER & FOOTER
// ============================================================
function makeHeader() {
  return new Header({
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: "Vidhyadeep College", font: FONT, bold: true, size: BODY_SIZE, color: "1F3864" }),
        ],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Vidhyadeep University, Surat, Gujarat", font: FONT, size: SMALL_SIZE, italics: true, color: "666666" }),
        ],
        alignment: AlignmentType.CENTER,
      }),
    ],
  });
}

function makeFooter(chapterName) {
  return new Footer({
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: `Food Delivery System  |  ${chapterName}  |  Bachelor of Computer Science`, font: FONT, size: SMALL_SIZE, color: "888888" }),
        ],
        alignment: AlignmentType.CENTER,
      }),
    ],
  });
}

// ============================================================
// SECTION 1: TITLE PAGE
// ============================================================
function titlePageSection() {
  return {
    properties: {
      page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } },
    },
    headers: { default: makeHeader() },
    footers: { default: makeFooter("Title Page") },
    children: [
      blankLine(),
      blankLine(),
      blankLine(),
      centerPara("[College Logo]", { bold: true, size: BODY_SIZE, color: "999999" }),
      blankLine(),
      blankLine(),
      centerPara("Food Delivery System", { bold: true, size: TITLE_SIZE, color: "1F3864" }),
      blankLine(),
      centerPara("A Project Report", { size: HEADING3_SIZE, italics: true }),
      centerPara("Submitted in Partial Fulfillment of the Requirements", { size: BODY_SIZE }),
      centerPara("for the Degree of", { size: BODY_SIZE }),
      blankLine(),
      centerPara("Bachelor of Computer Science (BCS)", { bold: true, size: HEADING2_SIZE, color: "2E5090" }),
      blankLine(),
      centerPara("Submitted to", { size: BODY_SIZE }),
      centerPara("Vidhyadeep University", { bold: true, size: HEADING3_SIZE }),
      centerPara("Surat, Gujarat", { size: BODY_SIZE }),
      blankLine(),
      blankLine(),
      centerPara("Submitted by", { size: BODY_SIZE }),
      blankLine(),
      centerPara(`1. ${BLANK}`, { size: BODY_SIZE }),
      centerPara(`2. ${BLANK}`, { size: BODY_SIZE }),
      centerPara(`3. ${BLANK}`, { size: BODY_SIZE }),
      centerPara(`4. ${BLANK}`, { size: BODY_SIZE }),
      blankLine(),
      blankLine(),
      centerPara(`Guided by: ${BLANK}`, { size: BODY_SIZE, bold: true }),
      blankLine(),
      centerPara(`Academic Year: ${BLANK}`, { size: BODY_SIZE }),
      blankLine(),
      centerPara("Vidhyadeep College", { bold: true, size: HEADING3_SIZE, color: "1F3864" }),
      centerPara("Vidhyadeep University, Surat", { size: BODY_SIZE }),
    ],
  };
}

// ============================================================
// SECTION 2: PROJECT PROPOSAL
// ============================================================
function proposalSection() {
  const detailRows = [
    ["Project Title", "Food Delivery System"],
    ["Submitted By", BLANK],
    ["Program Name", "Bachelor of Computer Science (BCS)"],
    ["Contact", BLANK],
    ["Programming Language", "JavaScript"],
    ["Date Submitted", BLANK],
    ["Frontend Tools", "React JS, HTML, CSS, JavaScript, Bootstrap"],
    ["Backend Tools", "Node JS, Express JS"],
  ];

  const memberHeaders = ["Sr. No.", "Enrollment No.", "Member Name", "Division", "Contact No.", "Email", "Seminar Topic"];
  const memberRows = [
    ["1", BLANK, BLANK, BLANK, BLANK, BLANK, BLANK],
    ["2", BLANK, BLANK, BLANK, BLANK, BLANK, BLANK],
    ["3", BLANK, BLANK, BLANK, BLANK, BLANK, BLANK],
    ["4", BLANK, BLANK, BLANK, BLANK, BLANK, BLANK],
  ];

  return {
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter("Project Proposal") },
    children: [
      heading1("PROJECT PROPOSAL"),
      blankLine(),
      heading2("Project Details"),
      makeTable(
        ["Field", "Details"],
        detailRows,
        [35, 65]
      ),
      blankLine(),
      blankLine(),
      heading2("Project Members Detail"),
      makeTable(memberHeaders, memberRows, [8, 15, 18, 12, 15, 17, 15]),
      blankLine(),
      blankLine(),
      heading2("Description About Project"),
      bodyPara("The Food Delivery System is a full-stack web application designed to streamline the process of ordering food online and managing restaurant operations. The system provides a comprehensive platform that connects customers, restaurant owners, and delivery partners in a seamless digital ecosystem."),
      bodyPara("Built using the MERN (MongoDB, Express.js, React.js, Node.js) stack, this application leverages modern web technologies to deliver a responsive, real-time, and user-friendly experience. The system supports three distinct user roles: Customers who can browse restaurants and order food, Restaurant Owners who can manage their menus and orders, and Delivery Partners who handle the delivery of orders to customers."),
      bodyPara("Key features of the system include real-time order tracking using WebSocket technology (Socket.IO), secure online payment integration via Razorpay, GPS-based restaurant discovery, OTP-based delivery verification, and an analytics dashboard for restaurant owners. The application also supports Google OAuth for social login and implements JWT-based authentication for secure access control."),
      bodyPara("The project aims to solve the problems associated with traditional food ordering methods by providing a digital platform that reduces manual effort, improves order accuracy, enables real-time tracking, and provides a convenient and efficient food ordering experience for all stakeholders involved."),
    ],
  };
}

// ============================================================
// SECTION 3: CERTIFICATE PAGES
// ============================================================
function certificateSection(memberIndex) {
  const memberNum = memberIndex + 1;
  return {
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter(`Certificate - ${memberNum}`) },
    children: [
      blankLine(),
      blankLine(),
      centerPara("CERTIFICATE", { bold: true, size: TITLE_SIZE, color: "1F3864" }),
      blankLine(),
      blankLine(),
      bodyPara("This is to certify that the project entitled \"Food Delivery System\" has been carried out by"),
      blankLine(),
      centerPara(`${BLANK} (Enrollment No: ${BLANK})`, { bold: true, size: HEADING3_SIZE }),
      blankLine(),
      bodyPara("a student of Bachelor of Computer Science (BCS) at Vidhyadeep College, Vidhyadeep University, Surat, Gujarat, during the academic year ___________, in partial fulfillment of the requirements for the award of the degree of Bachelor of Computer Science."),
      blankLine(),
      bodyPara("The project has been found to be satisfactory and is being submitted for evaluation."),
      blankLine(),
      blankLine(),
      blankLine(),
      new Paragraph({
        children: [
          new TextRun({ text: "_________________________", font: FONT, size: BODY_SIZE }),
          new TextRun({ text: "\t\t\t_________________________", font: FONT, size: BODY_SIZE }),
        ],
        tabStops: [
          { type: TabStopType.RIGHT, position: 9000 },
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Project Guide", font: FONT, size: BODY_SIZE }),
          new TextRun({ text: "\t\t\t\t\t\t\tExternal Examiner", font: FONT, size: BODY_SIZE }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `${BLANK}`, font: FONT, size: BODY_SIZE }),
        ],
      }),
      blankLine(),
      blankLine(),
      new Paragraph({
        children: [
          new TextRun({ text: "_________________________", font: FONT, size: BODY_SIZE }),
        ],
        alignment: AlignmentType.CENTER,
      }),
      centerPara("Head of Department", { size: BODY_SIZE }),
      centerPara("Department of Computer Science", { size: BODY_SIZE }),
      centerPara("Vidhyadeep College", { size: BODY_SIZE }),
    ],
  };
}

// ============================================================
// SECTION 4: PROGRESS REPORTS
// ============================================================
function progressReportSection(reportNum) {
  const taskHeaders = ["Sr. No.", "Member Name", "Task Assigned", "Status"];
  const taskRows = [
    ["1", BLANK, BLANK, "Completed / In Progress"],
    ["2", BLANK, BLANK, "Completed / In Progress"],
    ["3", BLANK, BLANK, "Completed / In Progress"],
    ["4", BLANK, BLANK, "Completed / In Progress"],
  ];

  const phases = {
    1: {
      title: "Project Planning & Requirement Analysis",
      tasks: [
        "Literature survey and study of existing food delivery systems",
        "Requirement gathering and analysis",
        "Defining project scope and objectives",
        "Preparation of project proposal",
        "Technology stack selection and justification",
      ],
    },
    2: {
      title: "System Design & Development",
      tasks: [
        "Database design and schema definition",
        "UI/UX wireframe design",
        "Frontend development with React.js",
        "Backend API development with Express.js",
        "Authentication and authorization implementation",
      ],
    },
    3: {
      title: "Testing, Deployment & Documentation",
      tasks: [
        "Unit testing and integration testing",
        "Bug fixing and performance optimization",
        "System testing and user acceptance testing",
        "Project documentation and report preparation",
        "Final presentation preparation",
      ],
    },
  };

  const phase = phases[reportNum];

  return {
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter(`Progress Report ${reportNum}`) },
    children: [
      heading1(`PROGRESS REPORT ${reportNum}`),
      blankLine(),
      heading2("Report Details"),
      makeTable(
        ["Field", "Details"],
        [
          ["Project Title", "Food Delivery System"],
          ["Report Number", `Progress Report ${reportNum}`],
          ["Date", BLANK],
          ["Duration", BLANK],
          ["Phase", phase.title],
        ],
        [35, 65]
      ),
      blankLine(),
      blankLine(),
      heading2("Phase Description"),
      bodyPara(`This progress report covers the ${phase.title} phase of the Food Delivery System project. During this phase, the team focused on the following key activities:`),
      blankLine(),
      ...phase.tasks.map((t) => bulletPara(t)),
      blankLine(),
      heading2("Member Task Allocation"),
      makeTable(taskHeaders, taskRows, [10, 25, 40, 25]),
      blankLine(),
      blankLine(),
      heading2("Supervisor Comments"),
      bodyPara("Comments: _____________________________________________________________________"),
      bodyPara("________________________________________________________________________________"),
      bodyPara("________________________________________________________________________________"),
      blankLine(),
      bodyPara("Signature: ________________________"),
      bodyPara(`Date: ${BLANK}`),
    ],
  };
}

// ============================================================
// SECTION 5: ACKNOWLEDGEMENT
// ============================================================
function acknowledgementSection() {
  return {
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter("Acknowledgement") },
    children: [
      heading1("ACKNOWLEDGEMENT"),
      blankLine(),
      bodyPara("We would like to express our sincere gratitude to all those who have contributed to the successful completion of this project on \"Food Delivery System.\""),
      blankLine(),
      bodyPara("First and foremost, we extend our heartfelt thanks to our project guide, " + BLANK + ", for their invaluable guidance, constant encouragement, and constructive feedback throughout the course of this project. Their expertise and mentorship have been instrumental in shaping our understanding and execution of this project."),
      blankLine(),
      bodyPara("We are deeply grateful to the Head of the Department of Computer Science, Vidhyadeep College, for providing us with the necessary resources and infrastructure to carry out this project successfully."),
      blankLine(),
      bodyPara("We would also like to thank our principal, " + BLANK + ", for creating an environment conducive to learning and innovation. Their support and encouragement have been a source of motivation for us."),
      blankLine(),
      bodyPara("Our sincere thanks go to all the faculty members of the Department of Computer Science for their valuable suggestions and support during the various phases of this project."),
      blankLine(),
      bodyPara("We extend our gratitude to our parents and family members for their unwavering support, patience, and encouragement throughout our academic journey."),
      blankLine(),
      bodyPara("Finally, we would like to thank all our friends and classmates who have helped us directly or indirectly in completing this project. Their cooperation and teamwork have made this endeavor a rewarding experience."),
      blankLine(),
      blankLine(),
      centerPara("Thank You", { bold: true, size: HEADING2_SIZE }),
    ],
  };
}

// ============================================================
// SECTION 6: PREFACE
// ============================================================
function prefaceSection() {
  return {
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter("Preface") },
    children: [
      heading1("PREFACE"),
      blankLine(),
      bodyPara("This project report presents the design, development, and implementation of a \"Food Delivery System\" developed as a part of the Bachelor of Computer Science (BCS) program at Vidhyadeep College, Vidhyadeep University."),
      blankLine(),
      bodyPara("The rapid growth of digital technology has transformed the way businesses operate, and the food industry is no exception. Online food delivery platforms have become an integral part of modern urban life, providing convenience to customers and expanding the reach of restaurants. This project was undertaken to understand and implement the technical aspects of building such a platform."),
      blankLine(),
      bodyPara("The primary objective of this project is to develop a full-stack web application that enables customers to order food online from local restaurants, allows restaurant owners to manage their menus and orders, and provides delivery partners with tools to fulfill deliveries efficiently. The application is built using the MERN stack (MongoDB, Express.js, React.js, Node.js), which is a popular and powerful technology stack for modern web development."),
      blankLine(),
      bodyPara("This report documents the complete project lifecycle, including requirement analysis, system design, implementation, testing, and future scope. Each chapter provides a detailed account of the processes and technologies involved in the development of the Food Delivery System."),
      blankLine(),
      bodyPara("We hope that this project report provides a comprehensive understanding of the work undertaken and demonstrates the practical application of the concepts learned during our academic program."),
      blankLine(),
      blankLine(),
      centerPara("Authors", { bold: true, size: HEADING3_SIZE }),
      blankLine(),
      centerPara(`1. ${BLANK}`),
      centerPara(`2. ${BLANK}`),
      centerPara(`3. ${BLANK}`),
      centerPara(`4. ${BLANK}`),
    ],
  };
}

// ============================================================
// SECTION 7: INDEX / TABLE OF CONTENTS
// ============================================================
function indexSection() {
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
    ["", "5.1 Hardware and Software Specification", "14"],
    ["", "5.2 Server Side and Client Side Tools", "15"],
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

  return {
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter("Index") },
    children: [
      heading1("INDEX"),
      blankLine(),
      blankLine(),
      makeTable(
        ["Chapter", "Topic", "Page No."],
        indexItems,
        [20, 60, 20]
      ),
    ],
  };
}

// ============================================================
// CHAPTER 1 - INTRODUCTION
// ============================================================
function chapter1() {
  return {
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter("Chapter 1 - Introduction") },
    children: [
      heading1("CHAPTER 1"),
      centerPara("INTRODUCTION", { bold: true, size: HEADING1_SIZE, color: "1F3864" }),
      blankLine(),

      heading2("1.1 College Profile"),
      bodyPara("Vidhyadeep College is a premier educational institution affiliated with Vidhyadeep University, located in Surat, Gujarat. The college is committed to providing quality education in the field of computer science and information technology. With state-of-the-art infrastructure, experienced faculty, and a focus on practical learning, the college has established itself as a center of academic excellence."),
      bodyPara("The Department of Computer Science at Vidhyadeep College offers comprehensive programs that combine theoretical knowledge with hands-on experience. The department emphasizes project-based learning, industry collaboration, and research-oriented approach to prepare students for the challenges of the IT industry."),
      bodyPara("The college provides modern computer laboratories equipped with the latest hardware and software, high-speed internet connectivity, and a well-stocked library with access to digital resources. The institution encourages students to participate in workshops, seminars, hackathons, and industry visits to enhance their practical skills and industry exposure."),
      blankLine(),

      heading2("1.2 Project Profile"),
      makeTable(
        ["Parameter", "Details"],
        [
          ["Project Title", "Food Delivery System"],
          ["Project Type", "Full-Stack Web Application"],
          ["Domain", "E-Commerce / Food Technology"],
          ["Architecture", "MERN Stack (MongoDB, Express.js, React.js, Node.js)"],
          ["Database", "MongoDB with Mongoose ODM"],
          ["Authentication", "JWT (JSON Web Token) + Google OAuth (Firebase)"],
          ["Real-Time Communication", "Socket.IO WebSocket"],
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
        [35, 65]
      ),
      blankLine(),

      bodyPara("The Food Delivery System is a comprehensive full-stack web application designed to digitize the food ordering and delivery process. The application serves as a platform that connects three key stakeholders: customers who wish to order food, restaurant owners who prepare and manage orders, and delivery partners who fulfill the delivery."),
      bodyPara("The system provides a wide range of features including user registration and authentication with role-based access control, restaurant and menu management for owners, real-time order tracking with live GPS location of delivery partners, secure online payment integration via Razorpay, OTP-based delivery verification, rating and review system, favorites management, and an analytics dashboard for restaurant owners."),
      bodyPara("The application leverages modern web technologies and follows industry best practices for security, scalability, and user experience. The use of the MERN stack ensures a JavaScript-based development environment across the entire application, from the database layer to the user interface."),
    ],
  };
}

// ============================================================
// CHAPTER 2 - PROPOSED SYSTEM
// ============================================================
function chapter2() {
  return {
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter("Chapter 2 - Proposed System") },
    children: [
      heading1("CHAPTER 2"),
      centerPara("PROPOSED SYSTEM", { bold: true, size: HEADING1_SIZE, color: "1F3864" }),
      blankLine(),

      heading2("2.1 Scope and Objective"),
      bodyPara("The proposed Food Delivery System aims to provide a comprehensive digital platform that addresses the limitations of traditional food ordering methods. The scope of the project encompasses the development of a web-based application that facilitates seamless interaction between customers, restaurant owners, and delivery partners."),
      bodyPara("The primary objectives of the proposed system are as follows:"),
      bulletPara("To develop a user-friendly web application that allows customers to browse restaurants, view menus, and place food orders online."),
      bulletPara("To implement a role-based access control system supporting three user roles: Customer, Restaurant Owner, and Delivery Partner."),
      bulletPara("To provide real-time order tracking functionality using WebSocket technology (Socket.IO) for live status updates."),
      bulletPara("To integrate a secure online payment gateway (Razorpay) for seamless and safe financial transactions."),
      bulletPara("To implement GPS-based restaurant discovery using geospatial database queries (MongoDB 2dsphere index)."),
      bulletPara("To provide an analytics dashboard for restaurant owners with revenue charts, order statistics, and top-selling item analysis."),
      bulletPara("To implement OTP-based delivery verification to ensure secure and authenticated delivery completion."),
      bulletPara("To provide a rating and review system for customers to share feedback on food items."),
      bulletPara("To implement a favorites feature allowing customers to save preferred food items for quick access."),
      bulletPara("To ensure responsive design for optimal user experience across devices of varying screen sizes."),
      blankLine(),

      heading2("2.2 Advantages"),
      heading3("Benefits to Admin (Restaurant Owners)"),
      bulletPara("Digital menu management: Restaurant owners can easily add, edit, and remove menu items with images, descriptions, pricing, and availability status."),
      bulletPara("Real-time order management: Owners receive instant notifications for new orders and can update order status through a streamlined dashboard."),
      bulletPara("Analytics and insights: The analytics dashboard provides valuable business intelligence including total revenue, order trends, and top-performing items."),
      bulletPara("Automated delivery assignment: The system automatically broadcasts delivery assignments to available delivery partners based on proximity."),
      bulletPara("Shop status control: Owners can toggle their restaurant's open/closed status with a single click, immediately reflecting availability to customers."),
      bulletPara("Payment tracking: Automatic tracking of online payments with Razorpay integration ensures transparent financial records."),
      blankLine(),

      heading3("Benefits to Customers"),
      bulletPara("Convenience: Customers can order food from multiple restaurants from the comfort of their homes or offices."),
      bulletPara("Real-time tracking: Live order status updates and delivery partner location tracking provide transparency and reduce anxiety."),
      bulletPara("Multiple payment options: Support for both Cash on Delivery (COD) and online payment via Razorpay provides flexibility."),
      bulletPara("Restaurant discovery: GPS-based search helps customers discover restaurants in their vicinity."),
      bulletPara("Rating and review system: Customers can make informed decisions based on ratings and reviews from other customers."),
      bulletPara("Favorites management: Ability to save favorite food items for quick reordering."),
      bulletPara("Order history: Complete order history with the ability to reorder previous orders with a single click."),
      bulletPara("Secure authentication: JWT-based authentication with Google OAuth support ensures account security."),
      bulletPara("OTP-based delivery verification: Ensures that orders are delivered only to the rightful recipient."),
      blankLine(),

      heading2("2.3 Feasibility Study"),
      heading3("2.3.1 Technical Feasibility"),
      bodyPara("The proposed Food Delivery System is technically feasible as it utilizes well-established and widely-used technologies. The MERN stack (MongoDB, Express.js, React.js, Node.js) is a proven technology stack with extensive community support, comprehensive documentation, and a large ecosystem of libraries and tools."),
      bodyPara("MongoDB provides a flexible, scalable NoSQL database that is well-suited for handling the dynamic data structures required by the application. Its native support for geospatial queries through 2dsphere indexing enables efficient location-based restaurant discovery."),
      bodyPara("React.js, combined with Redux Toolkit for state management, provides a robust frontend framework for building responsive and interactive user interfaces. The component-based architecture of React enables code reusability and maintainability."),
      bodyPara("Node.js with Express.js provides a fast and efficient backend framework capable of handling concurrent requests and real-time communication via Socket.IO. The non-blocking I/O model of Node.js makes it well-suited for real-time applications."),
      bodyPara("All the required tools, libraries, and APIs are freely available or offer free tiers for development and small-scale deployment, making the project technically viable without significant resource constraints."),
      blankLine(),

      heading3("2.3.2 Economical Feasibility"),
      bodyPara("The economic feasibility of the project is established by the fact that all the technologies and tools used in the development are open-source or available in free tiers. MongoDB Atlas offers a free tier for development and small-scale applications. Cloudinary provides a free tier for image hosting with reasonable usage limits."),
      bodyPara("The development environment requires only a standard computer with internet access, which is readily available. No additional hardware or expensive software licenses are required for the development, testing, and deployment of the application."),
      bodyPara("The project can be deployed on cloud platforms such as Heroku, Vercel, or Railway, which offer free or affordable hosting options suitable for academic projects and initial deployment. This makes the project economically viable for both development and deployment phases."),
      blankLine(),

      heading3("2.3.3 Operational Feasibility"),
      bodyPara("The proposed system is operationally feasible as it addresses a genuine need in the market for efficient food ordering and delivery management. The system is designed with a user-centric approach, ensuring that all three user roles (customers, restaurant owners, and delivery partners) can easily navigate and use the application without extensive training."),
      bodyPara("The intuitive user interface, clear navigation structure, and responsive design ensure that users of varying technical proficiency can effectively use the system. The application provides appropriate feedback through toast notifications, loading indicators, and error messages to guide users through various operations."),
      bodyPara("The role-based access control system ensures that each user type has access only to the features and data relevant to their role, reducing complexity and potential confusion. The system's modular architecture allows for easy maintenance and future enhancements without disrupting existing functionality."),
    ],
  };
}

// ============================================================
// CHAPTER 3 - SYSTEM ANALYSIS
// ============================================================
function chapter3() {
  return {
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter("Chapter 3 - System Analysis") },
    children: [
      heading1("CHAPTER 3"),
      centerPara("SYSTEM ANALYSIS", { bold: true, size: HEADING1_SIZE, color: "1F3864" }),
      blankLine(),

      heading2("3.1 Existing System"),
      bodyPara("The traditional food ordering system relies heavily on manual processes and telephone-based communication. In the existing system, customers typically need to call restaurants directly to place orders, which is time-consuming and prone to errors. The lack of a centralized platform makes it difficult for customers to compare menus, prices, and reviews across multiple restaurants."),
      bodyPara("The existing system suffers from several limitations:"),
      bulletPara("Manual order taking leads to errors in order details, quantities, and special instructions."),
      bulletPara("No real-time tracking capability, leaving customers unaware of their order status."),
      bulletPara("Limited payment options, typically restricted to cash on delivery."),
      bulletPara("No centralized platform for restaurant discovery and comparison."),
      bulletPara("Lack of digital records makes order history tracking and reordering difficult."),
      bulletPara("Restaurant owners have limited tools for managing inventory, tracking orders, and analyzing sales data."),
      bulletPara("Delivery management is manual and inefficient, leading to delays and miscommunication."),
      bulletPara("No mechanism for customers to provide feedback or rate their experience."),
      bulletPara("Paper-based processes for recording orders, deliveries, and payments increase the risk of data loss."),
      blankLine(),

      heading2("3.2 Need for New System"),
      bodyPara("The limitations of the existing system necessitate the development of a digital food delivery platform that can automate and streamline the entire process. The proposed system addresses the shortcomings of the manual system by providing:"),
      blankLine(),
      bulletPara("A digital platform for browsing restaurants, viewing menus, and placing orders with precision and accuracy."),
      bulletPara("Real-time order tracking that provides transparency and reduces customer anxiety about order status."),
      bulletPara("Multiple payment options including online payment and Cash on Delivery for customer convenience."),
      bulletPara("GPS-based restaurant discovery that helps customers find restaurants in their area."),
      bulletPara("A comprehensive order management system for restaurant owners with analytics capabilities."),
      bulletPara("Automated delivery assignment and tracking for efficient delivery management."),
      bulletPara("A rating and review system that helps customers make informed decisions and provides valuable feedback to restaurants."),
      bulletPara("Secure authentication and OTP-based delivery verification for enhanced security."),
      bulletPara("Digital records of all transactions for easy tracking, auditing, and business analysis."),
      blankLine(),

      heading2("3.3 Detailed SRS (Software Requirement Specification)"),
      heading3("Functional Requirements"),
      bodyPara("The functional requirements of the Food Delivery System are categorized by user role:"),
      blankLine(),

      bodyRuns([{ text: "Customer Functional Requirements:", bold: true }]),
      bulletPara("User registration and login (email/password and Google OAuth)"),
      bulletPara("Browse restaurants by city with search functionality"),
      bulletPara("View restaurant menus with item details, images, prices, and ratings"),
      bulletPara("Add items to cart and manage cart quantities"),
      bulletPara("Select delivery address using interactive map (Leaflet.js)"),
      bulletPara("Choose payment method (COD or Online via Razorpay)"),
      bulletPara("Place orders and receive order confirmation"),
      bulletPara("Track order status in real-time (Pending, Preparing, Out of Delivery, Delivered)"),
      bulletPara("Track delivery partner's live location on map"),
      bulletPara("Verify delivery via OTP sent to email"),
      bulletPara("Rate and review food items"),
      bulletPara("Manage favorite items"),
      bulletPara("View order history and reorder previous orders"),
      bulletPara("Manage user profile"),
      blankLine(),

      bodyRuns([{ text: "Restaurant Owner Functional Requirements:", bold: true }]),
      bulletPara("Register and manage restaurant details (name, address, image, location)"),
      bulletPara("Add, edit, and delete menu items with images, categories, pricing, and food type"),
      bulletPara("Toggle item availability (in stock / out of stock)"),
      bulletPara("View and manage incoming orders"),
      bulletPara("Update order status (Pending, Preparing, Out of Delivery, Delivered)"),
      bulletPara("View analytics dashboard with revenue, order trends, and top items"),
      bulletPara("Toggle shop open/closed status"),
      bulletPara("Manage user profile"),
      blankLine(),

      bodyRuns([{ text: "Delivery Partner Functional Requirements:", bold: true }]),
      bulletPara("Register as a delivery partner and login"),
      bulletPara("Toggle duty status (on/off) to receive or stop receiving delivery assignments"),
      bulletPara("Receive real-time delivery assignment notifications via Socket.IO"),
      bulletPara("Accept delivery assignments"),
      bulletPara("Navigate to restaurant and customer locations using map"),
      bulletPara("Verify delivery via OTP received from customer"),
      bulletPara("View today's earnings and delivery statistics"),
      bulletPara("View all-time earnings history"),
      bulletPara("Manage user profile"),
      blankLine(),

      heading3("Non-Functional Requirements"),
      bulletPara("Performance: The system should respond to user actions within 2-3 seconds under normal load conditions."),
      bulletPara("Scalability: The system architecture should support horizontal scaling to accommodate growing user bases."),
      bulletPara("Security: All sensitive data should be encrypted. Authentication should use JWT tokens with appropriate expiration policies."),
      bulletPara("Availability: The system should maintain 99.5% uptime to ensure reliable service."),
      bulletPara("Usability: The user interface should be intuitive and responsive, supporting both desktop and mobile devices."),
      bulletPara("Reliability: The system should handle errors gracefully and provide meaningful feedback to users."),
      bulletPara("Maintainability: The codebase should follow established coding standards and be well-documented for easy maintenance."),
    ],
  };
}

// ============================================================
// CHAPTER 4 - SYSTEM PLANNING
// ============================================================
function chapter4() {
  return {
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter("Chapter 4 - System Planning") },
    children: [
      heading1("CHAPTER 4"),
      centerPara("SYSTEM PLANNING", { bold: true, size: HEADING1_SIZE, color: "1F3864" }),
      blankLine(),

      heading2("4.1 Requirement Analysis and Data Gathering"),
      bodyPara("The requirement analysis phase involved a comprehensive study of existing food delivery platforms, user needs, and technical requirements. The data gathering process included the following activities:"),
      blankLine(),

      bodyRuns([{ text: "Study of Existing Systems: ", bold: true }]),
      bodyPara("A thorough analysis of popular food delivery platforms such as Swiggy, Zomato, and Uber Eats was conducted to understand the standard features, user flows, and design patterns used in the industry. This study helped identify the essential features that should be included in the Food Delivery System."),
      blankLine(),

      bodyRuns([{ text: "User Requirement Analysis: ", bold: true }]),
      bodyPara("The requirements were gathered from the perspective of three user roles: customers, restaurant owners, and delivery partners. Key requirements identified include:"),
      bulletPara("Customers need a convenient platform to browse restaurants, order food, track deliveries, and provide feedback."),
      bulletPara("Restaurant owners need tools to manage their menus, process orders efficiently, and gain business insights through analytics."),
      bulletPara("Delivery partners need a system to receive delivery assignments, navigate to locations, and track their earnings."),
      blankLine(),

      bodyRuns([{ text: "Technical Requirement Analysis: ", bold: true }]),
      bodyPara("The technical requirements were defined based on the functional needs of the system:"),
      bulletPara("Frontend Framework: React.js was selected for its component-based architecture, virtual DOM, and extensive ecosystem."),
      bulletPara("Backend Framework: Node.js with Express.js was chosen for its non-blocking I/O, JavaScript consistency, and middleware support."),
      bulletPara("Database: MongoDB was selected for its flexible schema, native geospatial support, and scalability."),
      bulletPara("Authentication: JWT was chosen for stateless authentication, with Firebase for Google OAuth integration."),
      bulletPara("Real-Time Communication: Socket.IO was selected for bidirectional real-time communication."),
      bulletPara("Payment Gateway: Razorpay was chosen for its comprehensive API and popularity in the Indian market."),
      bulletPara("Image Hosting: Cloudinary was selected for its robust image management, transformation, and CDN capabilities."),
      bulletPara("Maps: Leaflet.js with OpenStreetMap was chosen as a free, open-source mapping solution."),
      blankLine(),

      bodyRuns([{ text: "Data Flow Analysis: ", bold: true }]),
      bodyPara("The data flow within the system was analyzed to understand how data moves between the frontend, backend, and database layers. The key data flows include:"),
      bulletPara("User authentication flow: Login/Register -> JWT generation -> Cookie storage -> Protected route access."),
      bulletPara("Order placement flow: Cart -> Checkout -> Payment (if online) -> Order creation -> Socket notification to owner."),
      bulletPara("Delivery assignment flow: Owner updates status -> System broadcasts to nearby delivery boys -> Accept -> Assignment created."),
      bulletPara("Order tracking flow: Customer requests tracking -> Real-time status + delivery boy location via Socket.IO."),
      blankLine(),

      bodyRuns([{ text: "Feasibility Analysis: ", bold: true }]),
      bodyPara("A feasibility analysis was conducted covering technical, economic, and operational aspects to ensure the project could be successfully completed within the given constraints. The analysis confirmed that the project is feasible on all three dimensions, as detailed in Chapter 2, Section 2.3."),
    ],
  };
}

// ============================================================
// CHAPTER 5 - TOOLS & ENVIRONMENT USED
// ============================================================
function chapter5() {
  return {
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter("Chapter 5 - Tools & Environment") },
    children: [
      heading1("CHAPTER 5"),
      centerPara("TOOLS & ENVIRONMENT USED", { bold: true, size: HEADING1_SIZE, color: "1F3864" }),
      blankLine(),

      heading2("5.1 Hardware and Software Specification"),
      heading3("5.1.1 Software Specification"),
      makeTable(
        ["Software", "Specification"],
        [
          ["Operating System", "Windows 10/11, macOS, or Linux"],
          ["Code Editor", "Visual Studio Code"],
          ["Web Browser", "Google Chrome / Mozilla Firefox (Latest)"],
          ["Node.js", "Version 18.x or higher"],
          ["npm", "Version 9.x or higher"],
          ["MongoDB", "Version 7.x (or MongoDB Atlas Cloud)"],
          ["Git", "Version 2.x"],
          ["Postman", "For API testing"],
        ],
        [35, 65]
      ),
      blankLine(),

      heading3("5.1.2 Hardware Specification"),
      makeTable(
        ["Component", "Minimum Requirement"],
        [
          ["Processor", "Intel Core i3 or equivalent (i5 recommended)"],
          ["RAM", "4 GB minimum (8 GB recommended)"],
          ["Hard Disk", "256 GB SSD (recommended)"],
          ["Display", "1366 x 768 resolution or higher"],
          ["Internet", "Broadband connection for API calls and package installation"],
        ],
        [35, 65]
      ),
      blankLine(),

      heading2("5.2 Server Side and Client Side Tools"),

      heading3("Overview of React JS"),
      bodyPara("React.js is an open-source JavaScript library developed by Facebook (now Meta) for building user interfaces, particularly single-page applications. It uses a component-based architecture that allows developers to build reusable UI components and manage the application state efficiently."),
      bodyPara("React uses a virtual DOM (Document Object Model) that optimizes rendering performance by minimizing direct manipulation of the actual DOM. When the state of a component changes, React first updates the virtual DOM, compares it with the previous version (a process called reconciliation), and then applies only the necessary changes to the real DOM. This approach significantly improves the performance of complex user interfaces."),
      bodyPara("In this project, React.js (version 19.1.1) is used as the primary frontend framework. The application uses functional components with React Hooks for state management and side effects. Redux Toolkit is integrated for global state management, and React Router DOM handles client-side routing. The use of React enables a responsive, interactive, and component-driven user interface that provides an excellent user experience across all three user roles."),
      blankLine(),

      heading3("Overview of Node JS"),
      bodyPara("Node.js is an open-source, cross-platform JavaScript runtime environment built on Chrome's V8 JavaScript engine. It allows developers to execute JavaScript code on the server side, enabling the use of a single programming language for both frontend and backend development."),
      bodyPara("Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, particularly suitable for data-intensive real-time applications. Its package ecosystem, npm (Node Package Manager), is the largest software registry in the world, providing access to hundreds of thousands of reusable packages."),
      bodyPara("In this project, Node.js serves as the backend runtime environment. It handles HTTP requests, manages database operations with MongoDB through Mongoose, implements JWT-based authentication, processes payment verifications, manages real-time WebSocket connections via Socket.IO, and integrates with third-party services such as Cloudinary for image hosting and Nodemailer for email services."),
      blankLine(),

      heading3("Overview of MongoDB"),
      bodyPara("MongoDB is a popular open-source NoSQL database that stores data in flexible, JSON-like documents called BSON (Binary JSON). Unlike traditional relational databases, MongoDB does not require a predefined schema, allowing for dynamic and flexible data structures that can evolve over time."),
      bodyPara("MongoDB provides powerful querying capabilities, including support for ad-hoc queries, indexing, aggregation pipelines, and geospatial queries. The 2dsphere index type enables efficient geospatial queries, which is utilized in this project for finding restaurants and delivery partners within a specified radius based on GPS coordinates."),
      bodyPara("In this project, MongoDB is used as the primary database, hosted on MongoDB Atlas (cloud). Mongoose ODM (Object Data Modeling) library is used to define schemas, validate data, and interact with the database. The application stores data for users, shops (restaurants), menu items, orders, delivery assignments, and reviews across multiple interconnected collections."),
      blankLine(),

      heading3("Overview of Express JS"),
      bodyPara("Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications. It is designed for building web applications and APIs, making it one of the most popular frameworks in the Node.js ecosystem."),
      bodyPara("Express.js provides a thin layer of fundamental web application features without obscuring Node.js features. It facilitates the creation of RESTful APIs through its routing system, middleware support, and HTTP utility methods. Middleware functions have access to the request and response objects and can execute code, modify these objects, end the request-response cycle, or call the next middleware in the stack."),
      bodyPara("In this project, Express.js (version 5.2.1) is used as the backend web framework. It handles API routing, middleware integration (authentication, file upload via Multer, CORS, cookie parsing), request validation, and error handling. The application follows a modular route structure with separate route files for authentication, users, shops, items, orders, and reviews."),
      blankLine(),

      heading3("Overview of JavaScript"),
      bodyPara("JavaScript is a high-level, interpreted programming language that is one of the core technologies of the World Wide Web. Originally designed for client-side scripting in web browsers, JavaScript has evolved into a versatile language used for server-side development (Node.js), mobile app development, desktop applications, and more."),
      bodyPara("JavaScript supports multiple programming paradigms including object-oriented, functional, and event-driven programming. ES6 (ECMAScript 2015) and subsequent versions have introduced significant features such as arrow functions, template literals, destructuring, modules, Promises, async/await, and classes that have modernized the language."),
      bodyPara("In this project, JavaScript is the primary programming language used across the entire stack. The frontend (React.js) and backend (Node.js/Express.js) are both written in JavaScript, providing consistency and enabling code sharing between the client and server sides. Modern ES6+ features are extensively used throughout the codebase."),
      blankLine(),

      heading3("Overview of HTML"),
      bodyPara("HTML (HyperText Markup Language) is the standard markup language for creating web pages and web applications. It provides the structural foundation of web content through a system of elements and attributes that define the layout and organization of information on a web page."),
      bodyPara("HTML5, the latest major version, introduced several new elements and APIs that enhance the capabilities of web applications, including semantic elements (header, nav, section, article, footer), multimedia support (audio, video), canvas for graphics, and APIs for local storage, geolocation, and drag-and-drop functionality."),
      bodyPara("In this project, HTML is used within React's JSX (JavaScript XML) syntax. JSX allows developers to write HTML-like code within JavaScript, which is then transformed into React elements. The HTML structure is defined within React components, combining markup with JavaScript logic in a declarative manner."),
      blankLine(),

      heading3("Overview of CSS"),
      bodyPara("CSS (Cascading Style Sheets) is a style sheet language used for describing the presentation of a document written in HTML. CSS enables the separation of content from presentation, allowing developers to control the layout, colors, fonts, and visual appearance of web pages."),
      bodyPara("Modern CSS includes features such as Flexbox and CSS Grid for advanced layout capabilities, CSS variables (custom properties) for reusable values, media queries for responsive design, animations and transitions for dynamic visual effects, and pseudo-classes and pseudo-elements for styling specific states and parts of elements."),
      bodyPara("In this project, CSS is used for styling the user interface through a combination of Tailwind CSS (a utility-first CSS framework) and custom CSS. Tailwind CSS provides pre-defined utility classes that enable rapid UI development with a consistent design system. Custom CSS is used for specific styling requirements, animations, and responsive adjustments. Bootstrap classes are also used for certain components and layout elements."),
    ],
  };
}

// ============================================================
// CHAPTER 6 - SYSTEM DESIGN
// ============================================================
function chapter6() {
  return {
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter("Chapter 6 - System Design") },
    children: [
      heading1("CHAPTER 6"),
      centerPara("SYSTEM DESIGN", { bold: true, size: HEADING1_SIZE, color: "1F3864" }),
      blankLine(),

      heading2("6.1 UML Diagrams"),
      heading3("6.1.1 Use Case Diagram (Admin Side)"),
      bodyPara("The following use case diagram describes the interactions between the Restaurant Owner (Admin) and the system. The restaurant owner can perform various operations related to restaurant management, menu management, order processing, and analytics."),
      blankLine(),
      centerPara("[Use Case Diagram - Admin Side]", { italics: true, color: "999999" }),
      centerPara("(Insert UML Use Case Diagram here)", { italics: true, color: "999999" }),
      blankLine(),
      bodyPara("Admin Use Cases:"),
      bulletPara("Register/Login to the system"),
      bulletPara("Create and manage restaurant profile"),
      bulletPara("Add, edit, and delete menu items"),
      bulletPara("Toggle item availability status"),
      bulletPara("View and process incoming orders"),
      bulletPara("Update order status (Pending, Preparing, Out of Delivery, Delivered)"),
      bulletPara("View analytics dashboard (revenue, orders, charts)"),
      bulletPara("Toggle shop open/closed status"),
      bulletPara("Manage user profile"),
      blankLine(),

      heading3("6.1.2 Use Case Diagram (User/Customer Side)"),
      bodyPara("The following use case diagram describes the interactions between the Customer and the system. The customer can browse restaurants, order food, track deliveries, make payments, and provide feedback."),
      blankLine(),
      centerPara("[Use Case Diagram - Customer Side]", { italics: true, color: "999999" }),
      centerPara("(Insert UML Use Case Diagram here)", { italics: true, color: "999999" }),
      blankLine(),
      bodyPara("Customer Use Cases:"),
      bulletPara("Register/Login to the system (email/password or Google OAuth)"),
      bulletPara("Browse restaurants by city"),
      bulletPara("Search for food items"),
      bulletPara("View restaurant menus and item details"),
      bulletPara("Add items to cart and manage quantities"),
      bulletPara("Select delivery address on map"),
      bulletPara("Choose payment method (COD or Online)"),
      bulletPara("Place order and receive confirmation"),
      bulletPara("Track order status in real-time"),
      bulletPara("Track delivery partner's live location"),
      bulletPara("Verify delivery via OTP"),
      bulletPara("Rate and review food items"),
      bulletPara("Manage favorite items"),
      bulletPara("View order history and reorder"),
      bulletPara("Manage user profile"),
      blankLine(),

      heading2("6.2 Database Design"),
      bodyPara("The database design follows a document-oriented approach using MongoDB. The data is organized into collections, each representing a distinct entity in the system. Relationships between entities are maintained through ObjectId references and embedded sub-documents."),
      blankLine(),

      heading3("6.2.1 Data Dictionary"),

      heading3("Table: Users/Customers"),
      makeTable(
        ["Field Name", "Data Type", "Constraints", "Description"],
        [
          ["_id", "ObjectId", "Primary Key, Auto", "Unique user identifier"],
          ["fullname", "String", "Required", "Full name of the user"],
          ["email", "String", "Required, Unique", "Email address for login"],
          ["password", "String", "Optional", "Hashed password (bcrypt)"],
          ["mobile", "String", "Required", "Phone number"],
          ["role", "String", "Required, Enum", "user, owner, deliveryBoy"],
          ["socketId", "String", "Optional", "Socket.IO connection ID"],
          ["isOnline", "Boolean", "Default: false", "Online status"],
          ["resetOtp", "String", "Optional", "OTP for password reset"],
          ["isOtpVerified", "Boolean", "Default: false", "OTP verification status"],
          ["otpExpires", "Date", "Optional", "OTP expiration timestamp"],
          ["location", "GeoJSON", "2dsphere Index", "GPS coordinates"],
          ["favorites", "[ObjectId]", "Optional", "References to favorite items"],
          ["isDutyOn", "Boolean", "Default: true", "Delivery boy duty toggle"],
          ["createdAt", "Date", "Auto", "Account creation timestamp"],
          ["updatedAt", "Date", "Auto", "Last update timestamp"],
        ],
        [18, 15, 22, 45]
      ),
      blankLine(),

      heading3("Table: Restaurants (Shops)"),
      makeTable(
        ["Field Name", "Data Type", "Constraints", "Description"],
        [
          ["_id", "ObjectId", "Primary Key, Auto", "Unique shop identifier"],
          ["name", "String", "Required", "Restaurant name"],
          ["image", "String", "Required", "Cloudinary image URL"],
          ["owner", "ObjectId", "Required, Ref: Users", "Reference to owner"],
          ["city", "String", "Required", "City name"],
          ["state", "String", "Required", "State name"],
          ["address", "String", "Required", "Full address"],
          ["items", "[ObjectId]", "Ref: Items", "Menu items references"],
          ["location", "GeoJSON", "2dsphere Index", "GPS coordinates"],
          ["isOpen", "Boolean", "Default: true", "Shop open status"],
          ["createdAt", "Date", "Auto", "Creation timestamp"],
          ["updatedAt", "Date", "Auto", "Last update timestamp"],
        ],
        [18, 15, 22, 45]
      ),
      blankLine(),

      heading3("Table: Menu Items"),
      makeTable(
        ["Field Name", "Data Type", "Constraints", "Description"],
        [
          ["_id", "ObjectId", "Primary Key, Auto", "Unique item identifier"],
          ["name", "String", "Required", "Item name"],
          ["image", "String", "Required", "Cloudinary image URL"],
          ["shop", "ObjectId", "Required, Ref: Shops", "Reference to shop"],
          ["category", "String", "Required, Enum", "Food category"],
          ["price", "Number", "Required, Min: 0", "Item price in INR"],
          ["foodType", "String", "Required, Enum", "veg or non-veg"],
          ["rating", "Object", "Default: {0,0}", "{average, count}"],
          ["isAvailable", "Boolean", "Default: true", "Availability status"],
          ["createdAt", "Date", "Auto", "Creation timestamp"],
          ["updatedAt", "Date", "Auto", "Last update timestamp"],
        ],
        [18, 15, 22, 45]
      ),
      blankLine(),

      heading3("Table: Orders"),
      makeTable(
        ["Field Name", "Data Type", "Constraints", "Description"],
        [
          ["_id", "ObjectId", "Primary Key, Auto", "Unique order identifier"],
          ["user", "ObjectId", "Required, Ref: Users", "Customer reference"],
          ["paymentMethod", "String", "Required, Enum", "cod or online"],
          ["deliveryAddress", "Object", "Required", "{text, latitude, longitude}"],
          ["totalAmount", "Number", "Required", "Total order amount"],
          ["shopOrders", "[ShopOrder]", "Required", "Embedded shop orders"],
          ["payment", "Boolean", "Default: false", "Payment status"],
          ["razorpayOrderId", "String", "Optional", "Razorpay order ID"],
          ["razorpayPaymentId", "String", "Optional", "Razorpay payment ID"],
          ["createdAt", "Date", "Auto", "Order creation timestamp"],
          ["updatedAt", "Date", "Auto", "Last update timestamp"],
        ],
        [18, 15, 22, 45]
      ),
      blankLine(),

      heading3("Table: Cart (Virtual - Redux State)"),
      bodyPara("The cart is managed as virtual state in the Redux store rather than as a database collection. Cart items are persisted in the user's browser session and synchronized with the backend during checkout."),
      makeTable(
        ["Field Name", "Data Type", "Constraints", "Description"],
        [
          ["itemId", "ObjectId", "Required", "Reference to menu item"],
          ["name", "String", "Required", "Item name"],
          ["price", "Number", "Required", "Item price"],
          ["quantity", "Number", "Required, Min: 1", "Quantity in cart"],
          ["shopId", "ObjectId", "Required", "Reference to shop"],
          ["image", "String", "Optional", "Item image URL"],
        ],
        [18, 15, 22, 45]
      ),
      blankLine(),

      heading3("Table: Payments"),
      bodyPara("Payment information is embedded within the Order document. The following fields track payment-related data:"),
      makeTable(
        ["Field Name", "Data Type", "Constraints", "Description"],
        [
          ["paymentMethod", "String", "Required, Enum", "cod or online"],
          ["payment", "Boolean", "Default: false", "Payment completion status"],
          ["razorpayOrderId", "String", "Optional", "Razorpay order ID"],
          ["razorpayPaymentId", "String", "Optional", "Razorpay payment ID"],
          ["totalAmount", "Number", "Required", "Total amount paid/collected"],
        ],
        [18, 15, 22, 45]
      ),
      blankLine(),

      heading3("Table: Delivery"),
      makeTable(
        ["Field Name", "Data Type", "Constraints", "Description"],
        [
          ["_id", "ObjectId", "Primary Key, Auto", "Unique assignment ID"],
          ["order", "ObjectId", "Required, Ref: Orders", "Reference to order"],
          ["shop", "ObjectId", "Required, Ref: Shops", "Reference to shop"],
          ["shopOrderId", "ObjectId", "Required", "Shop order sub-doc ID"],
          ["broadcastedTo", "[ObjectId]", "Ref: Users", "Delivery boys notified"],
          ["assignedTo", "ObjectId", "Ref: Users", "Assigned delivery boy"],
          ["status", "String", "Required, Enum", "broadcasted/assigned/expired/completed"],
          ["acceptedAt", "Date", "Optional", "Acceptance timestamp"],
        ],
        [18, 15, 22, 45]
      ),
      blankLine(),

      heading2("6.3 User Interface Design"),
      heading3("Customer Side"),
      bodyPara("The customer-facing user interface is designed to be intuitive, visually appealing, and responsive. The following screens are part of the customer experience:"),
      blankLine(),
      centerPara("[Landing Page Screenshot]", { italics: true, color: "999999" }),
      centerPara("Figure 6.1: Landing Page - Entry point with hero section, statistics, and role cards", { italics: true, size: SMALL_SIZE }),
      blankLine(),
      centerPara("[Customer Dashboard Screenshot]", { italics: true, color: "999999" }),
      centerPara("Figure 6.2: Customer Dashboard - Browse categories, restaurants, and food items", { italics: true, size: SMALL_SIZE }),
      blankLine(),
      centerPara("[Restaurant/Shop Page Screenshot]", { italics: true, color: "999999" }),
      centerPara("Figure 6.3: Shop Page - View restaurant menu with item cards", { italics: true, size: SMALL_SIZE }),
      blankLine(),
      centerPara("[Cart Page Screenshot]", { italics: true, color: "999999" }),
      centerPara("Figure 6.4: Cart Page - Cart items with quantity controls and order summary", { italics: true, size: SMALL_SIZE }),
      blankLine(),
      centerPara("[Checkout Page Screenshot]", { italics: true, color: "999999" }),
      centerPara("Figure 6.5: Checkout Page - Address selection and payment method", { italics: true, size: SMALL_SIZE }),
      blankLine(),
      centerPara("[Order Tracking Screenshot]", { italics: true, color: "999999" }),
      centerPara("Figure 6.6: Order Tracking - Real-time status stepper and delivery map", { italics: true, size: SMALL_SIZE }),
      blankLine(),

      heading3("Admin Side"),
      bodyPara("The admin/owner interface is designed for efficiency and ease of management. The following screens are part of the restaurant owner experience:"),
      blankLine(),
      centerPara("[Owner Dashboard Screenshot]", { italics: true, color: "999999" }),
      centerPara("Figure 6.7: Owner Dashboard - Menu items and sales insights tabs", { italics: true, size: SMALL_SIZE }),
      blankLine(),
      centerPara("[Add/Edit Item Page Screenshot]", { italics: true, color: "999999" }),
      centerPara("Figure 6.8: Add Item Page - Form for adding new menu items", { italics: true, size: SMALL_SIZE }),
      blankLine(),
      centerPara("[Owner Orders Page Screenshot]", { italics: true, color: "999999" }),
      centerPara("Figure 6.9: Owner Orders - Order management with status updates", { italics: true, size: SMALL_SIZE }),
      blankLine(),
      centerPara("[Analytics Dashboard Screenshot]", { italics: true, color: "999999" }),
      centerPara("Figure 6.10: Analytics Dashboard - Revenue charts and top items", { italics: true, size: SMALL_SIZE }),
      blankLine(),
      centerPara("[Delivery Partner Dashboard Screenshot]", { italics: true, color: "999999" }),
      centerPara("Figure 6.11: Delivery Dashboard - Earnings, assignments, and map tracking", { italics: true, size: SMALL_SIZE }),
    ],
  };
}

// ============================================================
// CHAPTER 7 - SYSTEM TESTING
// ============================================================
function chapter7() {
  const testHeaders = ["Sr. No.", "Feature Tested", "Test Case", "Expected Result", "Actual Result", "Status"];
  const testRows = [
    ["1", "User Registration", "Register with valid details", "Account created successfully", "As expected", "Pass"],
    ["2", "User Login", "Login with valid credentials", "JWT token issued, redirected", "As expected", "Pass"],
    ["3", "Google OAuth", "Login via Google", "Account linked, logged in", "As expected", "Pass"],
    ["4", "Password Reset", "Reset via OTP", "Password updated", "As expected", "Pass"],
    ["5", "Add Menu Item", "Add item with all fields", "Item created in DB", "As expected", "Pass"],
    ["6", "Edit Menu Item", "Update item details", "Item updated in DB", "As expected", "Pass"],
    ["7", "Delete Menu Item", "Delete an item", "Item removed from DB", "As expected", "Pass"],
    ["8", "Toggle Availability", "Toggle item availability", "Status updated", "As expected", "Pass"],
    ["9", "Add to Cart", "Add item to cart", "Cart updated", "As expected", "Pass"],
    ["10", "Update Cart Qty", "Change item quantity", "Cart recalculated", "As expected", "Pass"],
    ["11", "Place Order (COD)", "Place order with COD", "Order created", "As expected", "Pass"],
    ["12", "Place Order (Online)", "Place order via Razorpay", "Payment verified, order created", "As expected", "Pass"],
    ["13", "Update Order Status", "Owner updates status", "Status changed, notification sent", "As expected", "Pass"],
    ["14", "Accept Delivery", "Delivery boy accepts", "Assignment created", "As expected", "Pass"],
    ["15", "Verify Delivery OTP", "Enter correct OTP", "Delivery marked complete", "As expected", "Pass"],
    ["16", "Rate Item", "Submit rating 1-5", "Rating recorded", "As expected", "Pass"],
    ["17", "Add Review", "Submit review text", "Review displayed", "As expected", "Pass"],
    ["18", "Toggle Favorite", "Favorite/unfavorite item", "Favorites updated", "As expected", "Pass"],
    ["19", "Search Items", "Search by keyword", "Results displayed", "As expected", "Pass"],
    ["20", "Track Order", "View order tracking", "Live status shown", "As expected", "Pass"],
    ["21", "Toggle Shop Status", "Open/close shop", "Status updated for customers", "As expected", "Pass"],
    ["22", "View Analytics", "Open analytics dashboard", "Charts and stats displayed", "As expected", "Pass"],
    ["23", "Delivery Duty Toggle", "Toggle duty on/off", "Assignment reception updated", "As expected", "Pass"],
    ["24", "Reorder", "Reorder previous order", "New order placed with same items", "As expected", "Pass"],
  ];

  return {
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter("Chapter 7 - System Testing") },
    children: [
      heading1("CHAPTER 7"),
      centerPara("SYSTEM TESTING", { bold: true, size: HEADING1_SIZE, color: "1F3864" }),
      blankLine(),

      bodyPara("System testing is a critical phase in the software development lifecycle that ensures the developed application meets the specified requirements and functions correctly under various conditions. The testing process for the Food Delivery System was conducted in multiple phases to ensure comprehensive coverage of all functionalities."),
      blankLine(),

      heading2("Testing Checklist"),
      makeTable(testHeaders, testRows, [7, 18, 20, 22, 18, 15]),
      blankLine(),

      heading2("7.1 Unit Testing"),
      bodyPara("Unit testing involves testing individual components or functions in isolation to verify that each unit of the software performs as expected. In this project, unit tests were written for critical backend functions including authentication logic, database operations, payment verification, and business logic."),
      bodyPara("Backend unit tests focused on:"),
      bulletPara("Authentication controller functions (signup, signin, signout, password reset)"),
      bulletPara("CRUD operations for shops, items, and orders"),
      bulletPara("Payment verification logic with Razorpay signature validation"),
      bulletPara("OTP generation and verification functions"),
      bulletPara("Geospatial query functions for finding nearby restaurants and delivery partners"),
      bodyPara("Frontend unit tests focused on:"),
      bulletPara("Redux slice reducers and actions"),
      bulletPara("Utility functions for date formatting and price calculations"),
      bulletPara("Form validation logic"),
      bulletPara("Component rendering with various prop combinations"),
      blankLine(),

      heading2("7.2 Integration Testing"),
      bodyPara("Integration testing verifies that different modules or services used by the application work well together. The integration tests focused on the interaction between the frontend and backend through API calls, database operations, and real-time communication."),
      bodyPara("Key integration test scenarios included:"),
      bulletPara("Frontend-Backend API integration: Verifying that API calls from the React frontend are correctly handled by Express.js routes and return expected responses."),
      bulletPara("Database integration: Testing Mongoose model operations, schema validation, and relationship integrity across collections."),
      bulletPara("Socket.IO integration: Verifying real-time event emission and reception for order notifications, status updates, and delivery tracking."),
      bulletPara("Third-party service integration: Testing Cloudinary image upload, Razorpay payment flow, Nodemailer email sending, and Firebase Google OAuth."),
      bulletPara("Authentication flow integration: Verifying JWT token generation, cookie storage, and middleware-based route protection."),
      blankLine(),

      heading2("7.3 System Testing"),
      bodyPara("System testing involves testing the complete and integrated application to evaluate the system's compliance with specified requirements. The system testing phase covered end-to-end testing of all user workflows across the three user roles."),
      bodyPara("System testing scenarios included:"),
      bulletPara("Complete customer workflow: Registration -> Browse -> Add to Cart -> Checkout -> Payment -> Order Tracking -> Delivery Verification -> Rating/Review."),
      bulletPara("Complete owner workflow: Registration -> Create Shop -> Add Items -> Receive Orders -> Update Status -> View Analytics."),
      bulletPara("Complete delivery partner workflow: Registration -> Toggle Duty -> Receive Assignment -> Accept -> Navigate -> Verify OTP -> View Earnings."),
      bulletPara("Cross-role interaction: Verifying that actions by one role (e.g., owner updating status) are correctly reflected in other roles (e.g., customer's order tracking)."),
      bulletPara("Error handling: Testing system behavior with invalid inputs, network failures, and edge cases."),
      bulletPara("Responsive design: Verifying UI functionality and appearance across different screen sizes and devices."),
      bulletPara("Performance testing: Evaluating system response times under normal and peak load conditions."),
    ],
  };
}

// ============================================================
// CHAPTER 8 - FUTURE ENHANCEMENT
// ============================================================
function chapter8() {
  return {
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter("Chapter 8 - Future Enhancement") },
    children: [
      heading1("CHAPTER 8"),
      centerPara("FUTURE ENHANCEMENT", { bold: true, size: HEADING1_SIZE, color: "1F3864" }),
      blankLine(),

      bodyPara("The Food Delivery System, while fully functional in its current form, has significant potential for future enhancements that can further improve the user experience, expand functionality, and increase the platform's value proposition. The following enhancements are planned for future iterations of the project:"),
      blankLine(),

      bodyRuns([{ text: "1. Mobile Application Development: ", bold: true }]),
      bodyPara("Develop native mobile applications for Android and iOS platforms using React Native. This will provide users with a more optimized and accessible experience on mobile devices, including push notifications for order updates."),
      blankLine(),

      bodyRuns([{ text: "2. AI-Based Recommendation Engine: ", bold: true }]),
      bodyPara("Implement a machine learning-based recommendation system that suggests restaurants and food items based on the user's order history, preferences, browsing patterns, and ratings. This will enhance the personalization of the platform."),
      blankLine(),

      bodyRuns([{ text: "3. Chat Support System: ", bold: true }]),
      bodyPara("Integrate a real-time chat system that allows customers to communicate with restaurant owners and delivery partners. This can help resolve queries, provide special instructions, and improve customer service."),
      blankLine(),

      bodyRuns([{ text: "4. Multi-Language Support: ", bold: true }]),
      bodyPara("Implement internationalization (i18n) to support multiple languages, making the platform accessible to a wider audience. This includes translating the user interface, notifications, and email communications."),
      blankLine(),

      bodyRuns([{ text: "5. Advanced Analytics: ", bold: true }]),
      bodyPara("Enhance the analytics dashboard with advanced features including predictive analytics for demand forecasting, customer segmentation analysis, competitor benchmarking, and detailed financial reporting."),
      blankLine(),

      bodyRuns([{ text: "6. Subscription and Loyalty Programs: ", bold: true }]),
      bodyPara("Implement a subscription-based model for regular customers with benefits such as free delivery, exclusive discounts, and priority support. Additionally, introduce a loyalty points system that rewards customers for repeat orders."),
      blankLine(),

      bodyRuns([{ text: "7. Voice Ordering: ", bold: true }]),
      bodyPara("Integrate voice recognition technology to allow customers to place orders using voice commands. This can leverage Web Speech API or third-party services like Google Speech-to-Text."),
      blankLine(),

      bodyRuns([{ text: "8. Restaurant Table Booking: ", bold: true }]),
      bodyPara("Add a table reservation feature that allows customers to book tables at restaurants directly through the platform. This includes real-time availability checking and confirmation notifications."),
      blankLine(),

      bodyRuns([{ text: "9. Social Features: ", bold: true }]),
      bodyPara("Implement social features such as the ability to share orders with friends, create group orders, and share reviews on social media platforms. This can increase user engagement and platform visibility."),
      blankLine(),

      bodyRuns([{ text: "10. Delivery Route Optimization: ", bold: true }]),
      bodyPara("Implement advanced routing algorithms that optimize delivery routes for delivery partners, reducing delivery time and fuel costs. This can leverage services like Google Maps Directions API or OSRM (Open Source Routing Machine)."),
      blankLine(),

      bodyRuns([{ text: "11. Inventory Management: ", bold: true }]),
      bodyPara("Add an inventory management system for restaurant owners that automatically tracks ingredient usage, alerts for low stock, and generates purchase orders. This will help restaurants manage their supply chain more efficiently."),
      blankLine(),

      bodyRuns([{ text: "12. Multi-Restaurant Cart: ", bold: true }]),
      bodyPara("Enable customers to add items from multiple restaurants to a single cart and place a combined order. The system will handle separate sub-orders for each restaurant while providing a unified checkout experience."),
    ],
  };
}

// ============================================================
// CHAPTER 9 - REFERENCES
// ============================================================
function chapter9() {
  return {
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter("Chapter 9 - References") },
    children: [
      heading1("CHAPTER 9"),
      centerPara("REFERENCES", { bold: true, size: HEADING1_SIZE, color: "1F3864" }),
      blankLine(),

      heading2("9.1 Webography"),
      bodyPara("The following online resources were referenced during the development of the Food Delivery System:"),
      blankLine(),

      bodyRuns([{ text: "1. React.js Official Documentation", bold: true }]),
      bodyPara("https://react.dev/"),
      blankLine(),

      bodyRuns([{ text: "2. Node.js Official Documentation", bold: true }]),
      bodyPara("https://nodejs.org/en/docs/"),
      blankLine(),

      bodyRuns([{ text: "3. Express.js Official Documentation", bold: true }]),
      bodyPara("https://expressjs.com/"),
      blankLine(),

      bodyRuns([{ text: "4. MongoDB Official Documentation", bold: true }]),
      bodyPara("https://www.mongodb.com/docs/"),
      blankLine(),

      bodyRuns([{ text: "5. Mongoose ODM Documentation", bold: true }]),
      bodyPara("https://mongoosejs.com/docs/"),
      blankLine(),

      bodyRuns([{ text: "6. Redux Toolkit Documentation", bold: true }]),
      bodyPara("https://redux-toolkit.js.org/"),
      blankLine(),

      bodyRuns([{ text: "7. Socket.IO Documentation", bold: true }]),
      bodyPara("https://socket.io/docs/"),
      blankLine(),

      bodyRuns([{ text: "8. Razorpay Payment Gateway Documentation", bold: true }]),
      bodyPara("https://razorpay.com/docs/"),
      blankLine(),

      bodyRuns([{ text: "9. Cloudinary Documentation", bold: true }]),
      bodyPara("https://cloudinary.com/documentation"),
      blankLine(),

      bodyRuns([{ text: "10. Firebase Authentication Documentation", bold: true }]),
      bodyPara("https://firebase.google.com/docs/auth"),
      blankLine(),

      bodyRuns([{ text: "11. Leaflet.js Documentation", bold: true }]),
      bodyPara("https://leafletjs.com/reference.html"),
      blankLine(),

      bodyRuns([{ text: "12. JWT (JSON Web Token) Documentation", bold: true }]),
      bodyPara("https://jwt.io/introduction"),
      blankLine(),

      bodyRuns([{ text: "13. Tailwind CSS Documentation", bold: true }]),
      bodyPara("https://tailwindcss.com/docs"),
      blankLine(),

      bodyRuns([{ text: "14. Nodemailer Documentation", bold: true }]),
      bodyPara("https://nodemailer.com/"),
      blankLine(),

      bodyRuns([{ text: "15. bcrypt.js Documentation", bold: true }]),
      bodyPara("https://www.npmjs.com/package/bcrypt"),
      blankLine(),

      heading2("9.2 Bibliography"),
      bodyPara("The following books, journals, and articles were referenced during the study and development of the Food Delivery System:"),
      blankLine(),

      bodyRuns([{ text: "1. ", bold: true }, { text: "Learning React: Modern Patterns for Developing React Apps", italics: true }]),
      bodyPara("Authors: Eve Porcello and Alex Banks"),
      bodyPara("Publisher: O'Reilly Media, 2020"),
      blankLine(),

      bodyRuns([{ text: "2. ", bold: true }, { text: "Node.js Design Patterns", italics: true }]),
      bodyPara("Authors: Mario Casciaro and Luciano Mammino"),
      bodyPara("Publisher: Packt Publishing, 2020"),
      blankLine(),

      bodyRuns([{ text: "3. ", bold: true }, { text: "MongoDB: The Definitive Guide", italics: true }]),
      bodyPara("Authors: Shannon Bradshaw, Eoin Brazil, and Kristina Chodorow"),
      bodyPara("Publisher: O'Reilly Media, 2019"),
      blankLine(),

      bodyRuns([{ text: "4. ", bold: true }, { text: "JavaScript: The Good Parts", italics: true }]),
      bodyPara("Author: Douglas Crockford"),
      bodyPara("Publisher: O'Reilly Media, 2008"),
      blankLine(),

      bodyRuns([{ text: "5. ", bold: true }, { text: "Eloquent JavaScript", italics: true }]),
      bodyPara("Author: Marijn Haverbeke"),
      bodyPara("Publisher: No Starch Press, 2018"),
      blankLine(),

      bodyRuns([{ text: "6. ", bold: true }, { text: "Web Application Architecture: Principles, Protocols and Practices", italics: true }]),
      bodyPara("Authors: Leon Shklar and Richard Rosen"),
      bodyPara("Publisher: Wiley, 2012"),
      blankLine(),

      bodyRuns([{ text: "7. ", bold: true }, { text: "Designing Data-Intensive Applications", italics: true }]),
      bodyPara("Author: Martin Kleppmann"),
      bodyPara("Publisher: O'Reilly Media, 2017"),
      blankLine(),

      bodyRuns([{ text: "8. ", bold: true }, { text: "Clean Code: A Handbook of Agile Software Craftsmanship", italics: true }]),
      bodyPara("Author: Robert C. Martin"),
      bodyPara("Publisher: Prentice Hall, 2008"),
      blankLine(),
    ],
  };
}

// ============================================================
// BUILD THE DOCUMENT
// ============================================================
async function main() {
  console.log("Generating Food Delivery System Blackbook...");

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: BODY_SIZE },
        },
      },
    },
    sections: [
      titlePageSection(),
      proposalSection(),
      certificateSection(0),
      certificateSection(1),
      certificateSection(2),
      certificateSection(3),
      progressReportSection(1),
      progressReportSection(2),
      progressReportSection(3),
      acknowledgementSection(),
      prefaceSection(),
      indexSection(),
      chapter1(),
      chapter2(),
      chapter3(),
      chapter4(),
      chapter5(),
      chapter6(),
      chapter7(),
      chapter8(),
      chapter9(),
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = "D:\\Vingo MERN-Project\\Food_Delivery_System_Blackbook.docx";
  fs.writeFileSync(outputPath, buffer);
  console.log(`Blackbook generated successfully: ${outputPath}`);
}

main().catch((err) => {
  console.error("Error generating blackbook:", err);
  process.exit(1);
});
