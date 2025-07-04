<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# BidConnect - Bidding System for Warehouses and Factories

This is a full-stack bidding system that connects warehouses with factories for efficient product ordering and bidding.

## Project Structure

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express + TypeScript + MongoDB
- **Authentication**: JWT-based authentication
- **Database**: MongoDB with Mongoose ODM

## Key Features

- User authentication for warehouses and factories
- Smart search algorithm that considers both price and distance
- Real-time bidding and order management
- Responsive and modern UI design
- Location-based factory discovery
- Order tracking and management
- Dashboard with statistics and analytics

## Technical Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, React Router, Axios, React Hook Form, Zod
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcryptjs
- **Development**: ESLint, PostCSS, Autoprefixer

## Code Style Guidelines

- Use TypeScript for type safety
- Follow React functional components with hooks
- Use TailwindCSS for styling with custom component classes
- Implement proper error handling and loading states
- Use async/await for asynchronous operations
- Follow REST API conventions for backend endpoints
- Use proper MongoDB schema design with Mongoose

## Key Components

- Authentication system with role-based access control
- Smart search functionality for factories and products
- Real-time bidding and negotiation system
- Dashboard with comprehensive statistics
- Order management with status tracking
- Responsive design for mobile and desktop

## Environment Setup

The project requires:
- Node.js and npm
- MongoDB database
- Environment variables for JWT secret and database connection
