import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SubHeader from '../components/SubHeader';

const PageLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="website-content d-flex">
        <Sidebar />
        <div className="w-100">
          <SubHeader />
          <div className="module-data-section mt-2 w-100">
            {children} {/* This ensures the dynamic content is rendered */}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PageLayout;
