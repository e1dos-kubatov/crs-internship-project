import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LangProvider } from './context/LangContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CarsPage from './components/CarsPage';
import CarDetails from './components/CarDetails';
import Offices from './components/Offices';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import StaticPage from './components/StaticPage';
import Footer from './components/Footer';
import Register from "./components/Register"
import ClientDashboard from './components/ClientDashboard';
import CancelBooking from './components/CancelBooking';
import PaymentPage from './components/PaymentPage';

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen grid place-items-center bg-stone-50 text-slate-700">Loading workspace...</div>;

  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;

  return children;
};

const ClientProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen grid place-items-center bg-stone-50 text-slate-700">Loading workspace...</div>;

  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;

  return children;
};

const staticPageMap = {
  about: 'aboutUs',
  feedback: 'feedback',
  destinations: 'destinations',
  fleet: 'fleet',
  privacy: 'privacy',
  legal: 'legal',
  terms: 'terms',
  policies: 'policies',
  'modify-booking': 'modifyBooking',
  'cancel-booking': 'cancelBooking',
};

const StaticPageWrapper = () => {
  const { page } = useParams();
  return <StaticPage page={staticPageMap[page] || page} />;
};

function AppContent() {
  return (
    <LangProvider>
      <Router>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff7ed_0,#f8fafc_42%,#eef2ff_100%)]">
          <Header />
          <main>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/*" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/account/*" element={<ClientProtectedRoute><ClientDashboard /></ClientProtectedRoute>} />
              <Route path="/" element={<Hero />} />
              <Route path="/cars" element={<CarsPage />} />
              <Route path="/cars/:id" element={<CarDetails />} />
              <Route path="/offices" element={<Offices />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/cancel-booking" element={<ProtectedRoute><CancelBooking /></ProtectedRoute>} />
              <Route path="/payment/:rentalId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path="/account/modify-booking" element={<ProtectedRoute><StaticPage page="modifyBooking" /></ProtectedRoute>} />
              <Route path="/:page" element={<StaticPageWrapper />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LangProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App;




