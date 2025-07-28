# Masterplan for Online Grocery Ordering System

**Document Version:** 1.0
**Owner:** Chirag Singhal
**Status:** Final
**Prepared for:** augment code assistant
**Prepared by:** Chirag Singhal

---

## Project Overview
This project is an online grocery ordering system designed as an educational Minimum Viable Product (MVP). The system will feature a modern web-based user interface and a robust backend. The primary goal is to implement the core functionalities of an e-commerce platform, including user authentication, product management, product discovery, and a simulated ordering process. The project will be built using a decoupled architecture with a React frontend and a Spring Boot backend, containerized with Docker for ease of deployment and scalability.

## Project Goals
*   To build a functional MVP of an online grocery store.
*   To create a secure application with clear separation between customer and administrator roles.
*   To develop a clean, modern, and intuitive user interface.
*   To ensure the backend is secure, particularly against common vulnerabilities like SQL injection.
*   To establish a solid technical foundation (codebase, architecture, deployment) that can be extended with more advanced features in the future.

## Technical Stack
*   **Frontend**: React (with React Router for navigation and Axios for API calls)
*   **Backend**: Java 17, Spring Boot 3.x (with Spring Web, Spring Data JPA, Spring Security)
*   **Database**: H2 (for development), PostgreSQL (for production)
*   **Deployment**: Docker & Docker Compose

## Project Scope
### In Scope
*   User registration with validation (email format, password strength).
*   User authentication (login/logout) using JWT.
*   Role-based access control (Customer vs. Administrator).
*   Administrator ability to create, read, update, and delete products (CRUD).
*   Administrator ability to search for customer details by name.
*   Customer ability to view and search for products by name.
*   A functional shopping cart (add/remove items, view cart).
*   A simulated checkout process that creates an order in the database.
*   Customer ability to view their order history.
*   A dedicated, integrated UI section for administrator functions.
*   Secure password storage using bcrypt hashing.
*   Protection against SQL injection using parameterized queries (JPA/Hibernate).

### Out of Scope
*   Real payment gateway integration (e.g., Stripe, PayPal).
*   Advanced inventory management (e.g., stock level tracking).
*   Real-time order tracking.
*   Product reviews and ratings.
*   Password recovery ("Forgot Password" feature).
*   Social media logins (Google, Facebook, etc.).
*   Shipping cost calculation and third-party logistics integration.

## Functional Requirements

### Feature Area 1: User & Authentication Management

*   **FR1.1 (US001/US002):** A new user can register for an account by providing a full name, a unique email address, a strong password, a delivery address, and a 10-digit contact number.
*   **FR1.2 (US001):** Registered users can log in with their email and password. The system will use JWT for authentication. Unsuccessful login attempts will show an error.
*   **FR1.3 (US010):** The system will enforce role-based access. Admin-specific functions will be inaccessible to regular customers.
*   **FR1.4 (US003):** An authenticated customer can update their own profile information (name, password, address, contact number).

### Feature Area 2: Product Management (Admin)

*   **FR2.1 (US007):** An administrator can register a new product by providing a name, price, and quantity. The system will generate a unique product ID.
*   **FR2.2 (US008):** An administrator can update the details of an existing product (name, price, quantity).
*   **FR2.3 (US009):** An administrator can delete a product from the system using its product ID.
*   **FR2.4 (US005):** An administrator can search for registered customers by their full or partial name (case-insensitive). The search result will display all customer details except for the password, which should be masked.

### Feature Area 3: Customer & Ordering Functionality

*   **FR3.1 (US006):** A customer can search for products by name (case-insensitive). Search results will show the product name, price, quantity, and an "Add to Cart" button.
*   **FR3.2:** A customer can add products to a shopping cart, view the items in the cart, and remove items from it.
*   **FR3.3:** A customer can proceed through a simulated checkout process, which will create an order record in the database linked to their account.
*   **FR3.4 (US004):** A customer can view a history of all their past orders, including order ID, date, products, and total amount.

## Non-Functional Requirements (NFR)
*   **7.1. Performance:** The API endpoints should respond within 500ms under normal load. The website should load initially in under 3 seconds.
*   **7.2. Scalability:** The application will be containerized using Docker, allowing it to be scaled horizontally by running multiple instances of the backend and frontend containers.
*   **7.3. Security:**
    *   All user passwords must be hashed using bcrypt before being stored in the database.
    *   All API endpoints that require authentication must be secured using JWT and Spring Security.
    *   Spring Data JPA (or Hibernate) must be used to prevent SQL injection vulnerabilities by default through the use of parameterized queries.
*   **7.4. Maintainability:** The code should be modular, well-commented, and follow the principles outlined in the Development Guidelines section.

## Implementation Plan

This section outlines the detailed implementation plan.

### Phase 1: Setup & Foundation
*   **Task 1: Project Initialization**
    *   Create a root project directory.
    *   Inside the root, create `backend/` and `frontend/` subdirectories.
    *   Initialize a Spring Boot project in `backend/` using Spring Initializr with the following dependencies: Spring Web, Spring Data JPA, Spring Security, PostgreSQL Driver, H2 Database, Lombok.
    *   Initialize a React project in `frontend/` using `npx create-react-app frontend`.
*   **Task 2: Docker Configuration**
    *   Create a `Dockerfile` for the Spring Boot application to build a JAR and run it in a container.
    *   Create a `Dockerfile` for the React application for a multi-stage build to serve the static files via Nginx.
    *   Create a `docker-compose.yml` file in the root directory to orchestrate the backend, frontend, and PostgreSQL services.
*   **Task 3: Database & Backend Configuration**
    *   Configure the Spring Boot `application.properties` to use the H2 in-memory database for the `dev` profile and PostgreSQL for the `prod` profile.
    *   Initialize the project structure in the backend following standard Java package conventions (e.g., `com.example.grocerystore.controller`, `...service`, `...repository`, `...model`, `...config`, `...security`).

### Phase 2: Backend - User Authentication & Security
*   **Task 1: Data Models**
    *   Create JPA entity classes for `User` (with fields like id, name, email, password, address, phone number) and `Role`. A user can have multiple roles (e.g., `ROLE_USER`, `ROLE_ADMIN`).
*   **Task 2: Spring Security Configuration**
    *   Implement a `SecurityConfig` class.
    *   Configure a `PasswordEncoder` bean using `BCryptPasswordEncoder`.
    *   Set up security rules to protect endpoints. Public endpoints: `/api/auth/**`. Secured endpoints: `/api/admin/**` (for ADMIN role), `/api/orders/**` (for USER role).
*   **Task 3: JWT Implementation**
    *   Create a `JwtUtil` class to handle token generation and validation.
    *   Implement a `JwtRequestFilter` to intercept requests, validate the token, and set the authentication context.
*   **Task 4: Authentication Controller**
    *   Create an `AuthController` with endpoints for `/api/auth/register` and `/api/auth/login`.
    *   The register endpoint will validate input, hash the password, and save the new user to the database.
    *   The login endpoint will authenticate the user and return a JWT upon success.

### Phase 3: Backend - Core Business Logic
*   **Task 1: Product Management (Admin)**
    *   Create a `Product` JPA entity (id, name, price, quantity).
    *   Create `ProductRepository`, `ProductService`, and `AdminProductController`.
    *   Implement REST endpoints for CRUD operations on products (`POST`, `GET`, `PUT`, `DELETE` at `/api/admin/products`).
*   **Task 2: Customer Management (Admin)**
    *   Create an `AdminUserController` with an endpoint `GET /api/admin/users/search?name={name}` to search for users by name.
*   **Task 3: Product Search (Customer)**
    *   Create a public `ProductController` with an endpoint `GET /api/products/search?name={name}` for customers to search for products.
*   **Task 4: Order Management**
    *   Create `Order` and `OrderItem` JPA entities. An `Order` belongs to a `User` and contains multiple `OrderItems`.
    *   Create a `OrderController` with endpoints:
        *   `POST /api/orders`: To place a new (simulated) order.
        *   `GET /api/orders/my-history`: To fetch the order history for the logged-in customer.

### Phase 4: Frontend Development (React)
*   **Task 1: Setup & Structure**
    *   Install necessary libraries: `axios`, `react-router-dom`.
    *   Structure the `src/` folder: `components/`, `pages/`, `services/`, `context/`, `assets/`.
    *   Set up a global context for managing authentication state (user info, JWT).
    *   Create a centralized `api.js` service for `axios` configurations, including interceptors to attach the JWT to headers.
*   **Task 2: Authentication Pages**
    *   Create `LoginPage` and `RegisterPage` components with forms.
    *   Implement form submission logic that calls the backend auth endpoints.
    *   On successful login, store the JWT in localStorage and update the auth context.
*   **Task 3: Core Customer Pages**
    *   Create a `HomePage` displaying a list of products.
    *   Create a `ProductSearchPage` with a search bar and results display.
    *   Implement the "Add to Cart" functionality.
    *   Create a `CartPage` displaying cart items, with options to remove items.
    *   Create a `CheckoutPage` with a simple form for address confirmation, leading to an "Order Placed" confirmation screen.
    *   Create an `OrderHistoryPage` to display the user's past orders.
*   **Task 4: Admin Dashboard**
    *   Create a protected route for `/admin`.
    *   Build an `AdminDashboard` page with two main sections:
        *   **Product Management:** A table of all products with buttons to Add, Edit, and Delete. This will involve creating forms for adding/editing products.
        *   **Customer Search:** A search bar to find customers by name and display the results.

### Phase 5: Testing & Documentation
*   **Task 1: Backend Testing**
    *   Write unit tests for service layer logic using JUnit and Mockito.
    *   Write integration tests for controllers using `@SpringBootTest` and `MockMvc`.
*   **Task 2: Frontend Testing**
    *   Write basic component tests using Jest and React Testing Library.
*   **Task 3: Documentation**
    *   Create a comprehensive `README.md` with project overview and setup instructions.
    *   Create a `.env.example` file.
    *   Ensure all code is well-commented.

## API Endpoints (if applicable)
*   `POST /api/auth/register` - Register a new user.
*   `POST /api/auth/login` - Authenticate a user and get a JWT.
*   `GET /api/products` - Get a list of all products.
*   `GET /api/products/search?name={name}` - Search for products by name.
*   `GET /api/products/{id}` - Get a single product by ID.
*   `GET /api/orders/my-history` - Get the order history for the authenticated user.
*   `POST /api/orders` - Place a new simulated order.
*   `GET /api/admin/users/search?name={name}` - (Admin) Search for users by name.
*   `POST /api/admin/products` - (Admin) Create a new product.
*   `PUT /api/admin/products/{id}` - (Admin) Update an existing product.
*   `DELETE /api/admin/products/{id}` - (Admin) Delete a product.

## Data Models (if applicable)
### User
*   `id`: Long (Primary Key, Auto-generated)
*   `name`: String
*   `email`: String (Unique)
*   `password`: String (Hashed)
*   `address`: String
*   `contactNumber`: String
*   `roles`: Set<Role> (Many-to-Many relationship)

### Product
*   `id`: Long (Primary Key, Auto-generated)
*   `name`: String
*   `price`: Double
*   `quantity`: Integer

### Order
*   `id`: Long (Primary Key, Auto-generated)
*   `orderDate`: LocalDateTime
*   `totalAmount`: Double
*   `user`: User (Many-to-One relationship)
*   `orderItems`: List<OrderItem> (One-to-Many relationship)

## Project Structure
```
project-root/
├── backend/
│   ├── src/main/java/com/example/grocerystore/
│   │   ├── model/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── config/
│   │   └── security/
│   └── pom.xml
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── context/
│       └── assets/
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Environment Variables
```
# Required environment variables for backend (in .env file)
# For production PostgreSQL connection
DB_URL=jdbc:postgresql://db:5432/grocerydb
DB_USERNAME=admin
DB_PASSWORD=secret
# For JWT
JWT_SECRET=your-super-secret-key-that-is-long-and-secure
JWT_EXPIRATION_MS=86400000

# No environment variables required for the frontend at this stage
```

## Testing Strategy
The testing strategy will be multi-layered. The backend will use **JUnit 5** for unit testing services and **Mockito** for mocking dependencies. Integration tests for the REST API will be written using **Spring Boot's MockMvc**. The frontend will use **Jest** and **React Testing Library** to test components and user interactions, ensuring the UI behaves as expected.

## Deployment Strategy
The application will be deployed using **Docker**. The `docker-compose.yml` file will define three services: `backend` (the Spring Boot app), `frontend` (an Nginx server for the React build), and `db` (a PostgreSQL database). This containerized approach ensures a consistent environment and simplifies the deployment process on any Docker-supported host.

## Maintenance Plan
Post-deployment, maintenance will involve monitoring application logs, regularly updating dependencies (Java, Spring, Node.js packages) to patch security vulnerabilities, and performing database backups. Future feature development will follow the same structured approach of updating this masterplan.

## Risks and Mitigations
| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Scope Creep | Medium | Medium | Adhere strictly to the In-Scope/Out-of-Scope definitions. Any new feature requires a formal change request and update to this masterplan. |
| Integration Issues | High | Low | Use Docker Compose to ensure frontend and backend can communicate seamlessly in a production-like environment from the start of development. |
| Security Flaws | High | Medium | Follow security best practices diligently: use Spring Security, JWT, bcrypt, and prepared statements (via JPA). Conduct security reviews of the code. |

## Future Enhancements
*   Integration with a real payment gateway like Stripe.
*   A "Forgot Password" feature with secure token-based email reset.
*   Real-time inventory management.
*   A product review and rating system.
*   Deployment to a cloud provider (e.g., AWS, Azure, Google Cloud).

## Development Guidelines
### Code Quality & Design Principles
-   Follow industry-standard coding best practices (clean code, modularity, error handling, security, scalability)
-   Apply SOLID, DRY (via abstraction), and KISS principles
-   Design modular, reusable components/functions
-   Optimize for code readability and maintainable structure
-   Add concise, useful function-level comments
-   Implement comprehensive error handling (try-catch, custom errors, async handling)
### Frontend Development
-   Provide modern, clean, professional, and intuitive UI designs
-   Adhere to UI/UX principles (clarity, consistency, simplicity, feedback, accessibility/WCAG)
-   Use appropriate CSS frameworks/methodologies (e.g., Tailwind, BEM)
### Data Handling & APIs
-   Integrate with real, live data sources and APIs as specified or implied
-   Prohibit placeholder, mock, or dummy data/API responses in the final code
-   Accept credentials/config exclusively via environment variables
-   Use `.env` files for local secrets/config with a template `.env.example` file
-   Centralize all API endpoint URLs in a single location (config file, constants module, or environment variables)
-   Never hardcode API endpoint URLs directly in service/component files
### Asset Generation
-   Do not use placeholder images or icons
-   Create necessary graphics as SVG and convert to PNG using the sharp library
-   Write build scripts to handle asset generation
-   Reference only the generated PNG files within the application code
### Documentation Requirements
-   Create a comprehensive README.md including project overview, setup instructions, and other essential information
-   Maintain a CHANGELOG.md to document changes using semantic versioning
-   Document required API keys/credentials clearly
-   Ensure all documentation is well-written, accurate, and reflects the final code

## Tool Usage Instructions
### MCP Servers and Tools
-   Use the context7 MCP server to gather contextual information about the current task, including relevant libraries, frameworks, and APIs
-   Use the clear thought MCP servers for various problem-solving approaches:
    -   `mentalmodel_clear_thought`: For applying structured problem-solving approaches (First Principles Thinking, Opportunity Cost Analysis, Error Propagation Understanding, Rubber Duck Debugging, Pareto Principle, Occam's Razor)
    -   `designpattern_clear_thought`: For applying software architecture and implementation patterns (Modular Architecture, API Integration Patterns, State Management, Asynchronous Processing, Scalability Considerations, Security Best Practices, Agentic Design Patterns)
    -   `programmingparadigm_clear_thought`: For applying different programming approaches (Imperative Programming, Procedural Programming, Object-Oriented Programming, Functional Programming, Declarative Programming, Logic Programming, Event-Driven Programming, Aspect-Oriented Programming, Concurrent Programming, Reactive Programming)
    -   `debuggingapproach_clear_thought`: For systematic debugging of technical issues (Binary Search, Reverse Engineering, Divide and Conquer, Backtracking, Cause Elimination, Program Slicing)
    -   `collaborativereasoning_clear_thought`: For simulating expert collaboration with diverse perspectives and expertise (Multi-persona problem-solving, Diverse expertise integration, Structured debate and consensus building, Perspective synthesis)
    -   `decisionframework_clear_thought`: For structured decision analysis and rational choice theory (Structured decision analysis, Multiple evaluation methodologies, Criteria weighting, Risk and uncertainty handling)
    -   `metacognitivemonitoring_clear_thought`: For tracking knowledge boundaries and reasoning quality (Metacognitive Monitoring, Knowledge boundary assessment, Claim certainty evaluation, Reasoning bias detection, Confidence calibration, Uncertainty identification)
    -   `scientificmethod_clear_thought`: For applying formal scientific reasoning to questions and problems (Structured hypothesis testing, Variable identification, Prediction formulation, Experimental design, Evidence evaluation)
    -   `structuredargumentation_clear_thought`: For dialectical reasoning and argument analysis (Thesis-antithesis-synthesis, Argument strength analysis, Premise evaluation, Logical structure mapping)
    -   `visualreasoning_clear_thought`: For visual thinking, problem-solving, and communication (Diagrammatic representation, Visual problem-solving, Spatial relationship analysis, Conceptual mapping, Visual insight generation)
    -   `sequentialthinking_clear_thought`: For breaking down complex problems into manageable steps (Structured thought process, Revision and branching support, Progress tracking, Context maintenance)
-   Use the date and time MCP server:
    -   Use `getCurrentDateTime_node` tool to get the current date and time in UTC format
    -   Add last updated date and time in UTC format to the `README.md` file
-   Use the websearch tool to find information on the internet when needed
### System & Environment Considerations
-   Target system: Windows 11 Home Single Language 23H2
-   Use semicolon (`;`) as the command separator in PowerShell commands, not `&&`
-   Use `New-Item -ItemType Directory -Path "path1", "path2", ... -Force` for creating directories in PowerShell
-   Use language-native path manipulation libraries (e.g., Node.js `path`) for robust path handling
-   Use package manager commands via the launch-process tool to add dependencies; do not edit package.json directly
### Error Handling & Debugging
-   First attempt to resolve errors autonomously using available tools
-   Perform systematic debugging: consult web resources, documentation, modify code, adjust configuration, retry
-   Report back only if an insurmountable blocker persists after exhausting all self-correction efforts

## Conclusion
This masterplan provides a comprehensive blueprint for developing the Online Grocery Ordering System. By following the defined phases, requirements, and guidelines, the AI code assistant will be able to construct a high-quality, secure, and maintainable application that meets all the objectives of this sprint. The resulting product will serve as an excellent foundation for future enhancements.