# Book Review API

A RESTful API built with Node.js and Express for a basic Book Review system. This API allows users to register, login, add books, write reviews, and search for books.

## Features

- User authentication with JWT
- CRUD operations for books and reviews
- Search functionality for books by title or author
- Pagination for books and reviews
- Average rating calculation for books

## Tech Stack

- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing

## Project Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd mini_assignment
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/book_review_api
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=90d
```

### Running the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- **POST /api/signup** - Register a new user
  ```bash
  curl -X POST http://localhost:3000/api/signup \
    -H "Content-Type: application/json" \
    -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
  ```

- **POST /api/login** - Login and get JWT token
  ```bash
  curl -X POST http://localhost:3000/api/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@asif.com","password":"password123"}'
  ```

### Books

- **POST /api/books** - Add a new book (Authenticated)
  ```bash
  curl -X POST http://localhost:3000/api/books \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -d '{"title":"Godan","author":"Munshi Premchand","genre":"Fiction","description":"A classic Hindi novel depicting the struggles of Indian farmers and rural society","publishedYear":1925}'
  ```

- **GET /api/books** - Get all books (with pagination and filters)
  ```bash
  # Basic request
  curl http://localhost:3000/api/books
  
  # With pagination
  curl http://localhost:3000/api/books?page=1&limit=10
  
  # With filters
  curl http://localhost:3000/api/books?genre=Fiction&author=Fitzgerald
  ```

- **GET /api/books/:id** - Get book details by ID
  ```bash
  curl http://localhost:3000/api/books/BOOK_ID
  ```

### Reviews

- **POST /api/books/:id/reviews** - Submit a review (Authenticated)
  ```bash
  curl -X POST http://localhost:3000/api/books/BOOK_ID/reviews \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -d '{"rating":5,"title":"Amazing book","comment":"One of the best books I have ever read"}'
  ```

- **PUT /api/reviews/:id** - Update your review (Authenticated)
  ```bash
  curl -X PUT http://localhost:3000/api/reviews/REVIEW_ID \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -d '{"rating":4,"title":"Good book","comment":"I enjoyed reading this book"}'
  ```

- **DELETE /api/reviews/:id** - Delete your review (Authenticated)
  ```bash
  curl -X DELETE http://localhost:3000/api/reviews/REVIEW_ID \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
  ```

### Search

- **GET /api/search** - Search books by title or author
  ```bash
  curl http://localhost:3000/api/search?query=Fitzgerald
  ```

## Database Schema

### User
- **name**: String (required)
- **email**: String (required, unique)
- **password**: String (required, hashed)
- **timestamps**: Created at, Updated at

### Book
- **title**: String (required)
- **author**: String (required)
- **genre**: String (required, enum)
- **description**: String (required)
- **publishedYear**: Number
- **user**: ObjectId (reference to User)
- **timestamps**: Created at, Updated at
- **virtual**: reviews (array of Review objects)

### Review
- **rating**: Number (required, 1-5)
- **title**: String (required)
- **comment**: String (required)
- **book**: ObjectId (reference to Book)
- **user**: ObjectId (reference to User)
- **timestamps**: Created at, Updated at

## Design Decisions

1. **Authentication**: JWT-based authentication was chosen for its stateless nature and ease of implementation.

2. **Database**: MongoDB was chosen for its flexibility with document-based data and ease of use with Node.js.

3. **Pagination**: Implemented pagination for both books and reviews to improve performance and user experience.

4. **Validation**: Added validation for all inputs to ensure data integrity.

5. **Error Handling**: Comprehensive error handling for better debugging and user feedback.

6. **Virtual Properties**: Used Mongoose virtual properties for the reviews to avoid data duplication.

7. **Middleware**: Implemented middleware for authentication and request processing.

## Assumptions

1. Users can only submit one review per book.
2. Only the user who created a review can update or delete it.
3. Book genres are limited to a predefined set of options.
4. The API assumes that the MongoDB server is running and accessible.