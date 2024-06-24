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
import Choose from './screens/Photo/Choose';
import Filter from './screens/Filter';
import Sticker from './screens/Sticker';
import Print from './screens/Print';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaymentNumber from './screens/Payment/PaymentNumber';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/frame" element={<Frame />} />
        <Route path="/background" element={<Background />} />
        <Route path="/layout" element={<Layout />} />
        <Route path="/payment-number" element={<PaymentNumber />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-result" element={<Result />} />
        <Route path="/payment-cash" element={<Cash />} />
        <Route path="/payment-qr" element={<QR />} />
        <Route path="/payment-promo" element={<Promo />} />
        <Route path="/photo" element={<Photo />} />
        <Route path="/photo-choose" element={<Choose />} />
        <Route path="/filter" element={<Filter />} />
        <Route path="/sticker" element={<Sticker />} />
        <Route path="/print" element={<Print />} />
        
      </Routes>
    </Router>
  );
}

export default App;
