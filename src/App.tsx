import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
import Navbar from './components/Navbar.tsx';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/Dashboard.tsx';
import BiddingPage from './pages/BiddingPage.tsx';
import CreateBidRequest from './pages/CreateBidRequest.tsx';
import BidRequestDetailsPage from './pages/BidRequestDetailsPage.tsx';
import FactoryBiddingPage from './pages/FactoryBiddingPage.tsx';
import Orders from './pages/Orders.tsx';
import Tracking from './pages/Tracking.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/bidding" 
                element={
                  <ProtectedRoute>
                    <BiddingPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/bidding/create" 
                element={
                  <ProtectedRoute>
                    <CreateBidRequest />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/bidding/requests/:requestId" 
                element={
                  <ProtectedRoute>
                    <BidRequestDetailsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/bidding/requests/:requestId/submit-bid" 
                element={
                  <ProtectedRoute>
                    <FactoryBiddingPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/tracking" 
                element={
                  <ProtectedRoute>
                    <Tracking />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
