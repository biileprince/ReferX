// src/components/ui/Tabs.jsx
import React from 'react';

const Tabs = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex overflow-x-auto border-b border-gray-200 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex items-center px-4 py-2 text-sm font-medium whitespace-nowrap ${
            activeTab === tab.id
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onChange(tab.id)}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;