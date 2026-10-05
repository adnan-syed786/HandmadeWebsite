# E-Commerce Application

A full-stack e-commerce application built with Node.js, Express, and React.

## Project Structure

- **Backend**: Node.js/Express API server
- **Frontend**: React application with Vite

## Features

- User authentication and authorization
- Product catalog and management
- Shopping cart functionality
- Order management
- Admin dashboard
- Payment processing
- Product reviews

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Ecommerce
```

2. Install Backend dependencies:
```bash
cd Backend
npm install
```

3. Install Frontend dependencies:
```bash
cd fronted
npm install
```

### Configuration

1. Create a `.env` file in the Backend directory with the following variables:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Running the Application

1. Start the Backend server:
```bash
cd Backend
npm start
```

2. Start the Frontend development server:
```bash
cd fronted
npm run dev
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### Frontend
- React
- Vite
- Tailwind CSS
- Context API for state management

## License

This project is licensed under the MIT License.
