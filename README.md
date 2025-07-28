# Online Grocery Ordering System

**Version:** 1.0.0  
**Author:** Chirag Singhal (`chirag127`)  
**Last Updated:** 2025-07-28T15:55:11.822Z  
**License:** MIT

## Project Overview

This is a comprehensive online grocery ordering system built as an educational MVP (Minimum Viable Product). The system features a modern React frontend and a robust Spring Boot backend, demonstrating core e-commerce functionalities including user authentication, product management, shopping cart, and order processing.

## 🚀 Features

### Customer Features
- **User Registration & Authentication** - Secure JWT-based authentication
- **Product Browsing & Search** - Browse and search products by name
- **Shopping Cart** - Add/remove items, manage quantities
- **Order Placement** - Simulated checkout process
- **Order History** - View past orders and details
- **Profile Management** - Update personal information

### Admin Features
- **Product Management** - Full CRUD operations for products
- **Customer Search** - Search customers by name
- **Admin Dashboard** - Dedicated interface for administrative tasks

### Security Features
- **Password Hashing** - BCrypt encryption for secure password storage
- **JWT Authentication** - Stateless authentication with JSON Web Tokens
- **Role-based Access Control** - Separate permissions for customers and administrators
- **SQL Injection Protection** - Parameterized queries via JPA/Hibernate

## 🛠 Technical Stack

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.4.0** - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Data persistence
- **H2 Database** - Development database
- **PostgreSQL** - Production database
- **Maven** - Dependency management

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Styling and responsive design

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Frontend web server

## 📋 Prerequisites

- **Docker** and **Docker Compose** (recommended)
- **Java 17+** (for local development)
- **Node.js 18+** (for local development)
- **Maven 3.6+** (for local development)

## 🚀 Quick Start with Docker

1. **Clone the repository:**
   ```bash
   git clone https://github.com/chirag127/sprint2-2.git
   cd sprint2-2
   ```

2. **Start the application:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - H2 Console (dev): http://localhost:8080/h2-console

## 🔧 Local Development Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Run the Spring Boot application:**
   ```bash
   ./mvnw spring-boot:run
   ```

   The backend will start on http://localhost:8080

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The frontend will start on http://localhost:3000

## 🔐 Environment Variables

Create a `.env` file in the root directory for production deployment:

```env
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/grocerydb
DB_USERNAME=admin
DB_PASSWORD=secret

# JWT Configuration
JWT_SECRET=your-super-secret-key-that-is-long-and-secure-for-production-use
JWT_EXPIRATION_MS=86400000
```

For development, the application uses H2 in-memory database by default.

## 🎯 Demo Credentials

### Administrator Access
- **Email:** admin@grocery.com
- **Password:** admin123

### Customer Access
Register a new account or use any registered customer credentials.

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and get JWT token

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/search?name={name}` - Search products by name
- `GET /api/products/{id}` - Get product by ID

### Order Endpoints (Authenticated)
- `POST /api/orders` - Place a new order
- `GET /api/orders/my-history` - Get user's order history

### Admin Endpoints (Admin Only)
- `GET /api/admin/users/search?name={name}` - Search customers by name
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product

## 🏗 Project Structure

```
project-root/
├── backend/                 # Spring Boot application
│   ├── src/main/java/com/example/grocerystore/
│   │   ├── model/          # JPA entities
│   │   ├── controller/     # REST controllers
│   │   ├── service/        # Business logic
│   │   ├── repository/     # Data access layer
│   │   ├── config/         # Configuration classes
│   │   ├── security/       # Security components
│   │   └── dto/            # Data transfer objects
│   └── pom.xml
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React contexts
│   │   └── assets/         # Static assets
│   └── package.json
├── docker-compose.yml      # Docker orchestration
├── .env.example           # Environment variables template
└── README.md              # Project documentation
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
./mvnw test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Production Deployment with Docker
```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment-specific Configurations
- **Development:** Uses H2 in-memory database
- **Production:** Uses PostgreSQL database with environment variables

## 🔒 Security Considerations

- All passwords are hashed using BCrypt
- JWT tokens are used for stateless authentication
- SQL injection protection through JPA parameterized queries
- CORS configuration for cross-origin requests
- Role-based access control for admin functions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful UI library
- All open-source contributors who made this project possible

## 📞 Support

For support, email chirag127@example.com or create an issue in the GitHub repository.

---

**Built with ❤️ by Chirag Singhal**
