import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PhotoShare from './pages/PhotoShare';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PhotoShare />} />
      </Routes>
    </Router>
  );
}

export default App;
