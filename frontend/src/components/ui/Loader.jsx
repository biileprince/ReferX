import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default Loader;