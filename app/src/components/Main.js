import React from 'react';
import Menu from './Menu';
import Body from './Body';
import Footer from './Footer';
import './Main.css';

function MainComponent() {
  return (
    <div className="content">
      <Menu />
      <Body />
      <Footer />
    </div>
  );
}

export default MainComponent;
