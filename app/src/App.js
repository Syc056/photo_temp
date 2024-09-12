import React from 'react';
import './App.css';
import Home from './screens/Home';
import Frame from './screens/Frame/Frame';
import Background from './screens/Frame/Background';
import Layout from './screens/Frame/Layout';
import Payment from './screens/Payment/Payment';
import Cash from './screens/Payment/Cash';
import QR from './screens/Payment/QR';
import Promo from './screens/Payment/Promo';
import Result from './screens/Payment/Result';
import Photo from './screens/Photo/Photo';
import PhotoPreview from './screens/Photo/PhotoPreview';
import Choose from './screens/Photo/Choose';
import Filter from './screens/Filter';
import Sticker from './screens/Sticker';
import Print from './screens/Print';
import Landing from './screens/Landing';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaymentNumber from './screens/Payment/PaymentNumber';
import PaymentTotal from './screens/Payment/PaymentTotal';
import QrDownload from './screens/QrDownload';
import ErrorBoundary from './screens/ErrorBoundary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/frame" element={<Frame />} />
        <Route path="/background" element={<Background />} />
        <Route path="/layout" element={<Layout />} />
        <Route path="/payment-number" element={<PaymentNumber />} />
        <Route path="/payment-total" element={<PaymentTotal />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-result" element={<Result />} />
        <Route path="/payment-cash" element={<Cash />} />
        <Route path="/payment-qr" element={<QR />} />
        <Route path="/payment-promo" element={<Promo />} />
        <Route path="/photo" element={
          <ErrorBoundary>
            <Photo />
          </ErrorBoundary>
        } />
        <Route path="/photo-preview" element={<PhotoPreview />} />
        <Route path="/photo-choose" element={<Choose />} />
        <Route path="/filter" element={
          <ErrorBoundary>
            <Filter />
          </ErrorBoundary>
        } />
        <Route path="/sticker" element={
          <ErrorBoundary>
            <Sticker />
          </ErrorBoundary>
        } />
        <Route path="/print" element={<Print />} />
        <Route path="/landing" element={<Landing/>} />
        <Route path="/download" element={<QrDownload/>} />
      </Routes>
    </Router>
  );
}

export default App;
