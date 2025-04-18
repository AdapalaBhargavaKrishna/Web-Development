import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00000A_1px)] bg-[size:20px_20px]"></div>
      {children}
    </div>
  );
};

export default Layout;