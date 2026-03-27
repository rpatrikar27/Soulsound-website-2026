import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StoreLayout from './components/store/StoreLayout';
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Support from './pages/Support';
import TrackOrder from './pages/TrackOrder';
import BlogListing from './pages/BlogListing';
import BlogDetail from './pages/BlogDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Account from './pages/Account';
import PolicyPage from './pages/PolicyPage';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import OrdersList from './pages/admin/OrdersList';
import OrderDetail from './pages/admin/OrderDetail';
import ProductsList from './pages/admin/ProductsList';
import ProductEditor from './pages/admin/ProductEditor';
import CategoryManagement from './pages/admin/CategoryManagement';
import BannerManagement from './pages/admin/BannerManagement';
import CustomerManagement from './pages/admin/CustomerManagement';
import ReviewManagement from './pages/admin/ReviewManagement';
import BlogManagement from './pages/admin/BlogManagement';
import BlogEditor from './pages/admin/BlogEditor';
import CouponManagement from './pages/admin/CouponManagement';
import NewsletterManagement from './pages/admin/NewsletterManagement';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/collections/:cat" element={<Collection />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/blogs" element={<BlogListing />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/:orderNumber" element={<OrderConfirmation />} />
          <Route path="/account" element={<Account />} />
          <Route path="/pages/:slug" element={<PolicyPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="products/new" element={<ProductEditor />} />
          <Route path="products/edit/:id" element={<ProductEditor />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="banners" element={<BannerManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="reviews" element={<ReviewManagement />} />
          <Route path="blogs" element={<BlogManagement />} />
          <Route path="blogs/new" element={<BlogEditor />} />
          <Route path="blogs/edit/:id" element={<BlogEditor />} />
          <Route path="coupons" element={<CouponManagement />} />
          <Route path="newsletter" element={<NewsletterManagement />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
