# BidConnect - Smart Bidding System

A comprehensive bidding platform that connects warehouses with factories for efficient product ordering and procurement. The system features intelligent matching based on price and location, real-time bidding, and streamlined order management.

## 🚀 Features

- **Smart Search**: Intelligent algorithm that finds the best deals considering both price and proximity
- **Real-time Bidding**: Instant communication between warehouses and factories
- **Role-based Authentication**: Separate login systems for warehouses and factories
- **Location-aware Matching**: GPS-based factory discovery and distance calculation
- **Order Management**: Complete order lifecycle tracking from request to completion
- **Modern UI**: Clean, responsive interface built with React and TailwindCSS
- **Dashboard Analytics**: Comprehensive statistics and insights

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for modern styling
- **React Router** for navigation
- **React Hook Form** with Zod validation
- **Axios** for API communication
- **Lucide React** for icons

### Backend
- **Node.js** with Express and TypeScript
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd bidding-system
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
```

### 4. Environment Setup
Create a `.env` file in the `server` directory:
```env
MONGODB_URI=mongodb://localhost:27017/bidding-system
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### 5. Start MongoDB
Make sure MongoDB is running on your system.

### 6. Run the Application

#### Start Backend Server
```bash
cd server
npm run dev
```

#### Start Frontend Development Server
```bash
# In the root directory
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🏗️ Project Structure

```
bidding-system/
├── src/                    # Frontend source code
│   ├── components/         # Reusable React components
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── pages/             # Page components
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── server/                # Backend source code
│   └── src/
│       ├── models/        # MongoDB models
│       ├── routes/        # API routes
│       ├── middleware/    # Express middleware
│       └── controllers/   # Route controllers
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Factories
- `GET /api/factories` - Get all factories
- `GET /api/factories/:id` - Get factory by ID
- `POST /api/factories/search` - Smart search with location and price optimization

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Factory only)
- `PUT /api/products/:id` - Update product (Factory only)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order (Warehouse only)
- `PATCH /api/orders/:id/status` - Update order status (Factory only)
- `PATCH /api/orders/:id/cancel` - Cancel order (Warehouse only)

## 👥 User Roles

### Warehouse
- Browse and search factories
- View product catalogs
- Place orders with specifications
- Track order status
- Manage order history

### Factory
- List products with specifications
- Receive and respond to orders
- Make counter-offers
- Update order status
- Manage production pipeline

## 🎯 Smart Search Algorithm

The system uses an intelligent ranking algorithm that considers:
- **Price competitiveness**: Lower prices rank higher
- **Geographic proximity**: Closer factories rank higher
- **Combined score**: Balanced weighting of price and distance

## 🚀 Deployment

### Frontend (Vite)
```bash
npm run build
npm run preview
```

### Backend
```bash
cd server
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Integration with logistics providers
- [ ] AI-powered demand forecasting
- [ ] Blockchain-based smart contracts

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
