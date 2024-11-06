// Header.jsx
import React from 'react';
import { usePageTitle } from '../Pages/PageTitleContext';

const Header = () => {
  const { pageTitle } = usePageTitle(); // Get the current page title

  return (
    <header className="bg-light py-3 shadow-sm">
      <div className="container">
        <h1 className="m-0">{pageTitle}</h1> {/* Display the page title */}
      </div>
    </header>
  );
}; 

export default Header;
