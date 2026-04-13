import React, { useState } from 'react';
import { themeInfo } from './theme';
import BasicInputsTab from './BasicInputsTab';
import AdditionalInputsTab from './AdditionalInputsTab';
import BridgeCrossSection from './BridgeCrossSection';

const GroupDesign = () => {
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'additional'

  const tabStyle = (isActive) => ({
    flex: 1,
    padding: '10px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: isActive ? themeInfo.greenDark : 'transparent',
    color: isActive ? '#fff' : themeInfo.textLight,
    border: `1px solid ${isActive ? themeInfo.greenDark : themeInfo.border}`,
    borderBottom: 'none',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    fontWeight: isActive ? 'bold' : 'normal'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: themeInfo.bg, color: themeInfo.textLight, fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: themeInfo.bgPanel, padding: '15px 20px', borderBottom: `1px solid ${themeInfo.border}`, fontSize: '1.2em', fontWeight: 'bold' }}>
        Group Design
      </div>

      {/* Main Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Panel */}
        <div style={{ width: '35%', minWidth: '350px', borderRight: `1px solid ${themeInfo.border}`, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', padding: '10px 10px 0 10px', borderBottom: `1px solid ${themeInfo.border}` }}>
            <div style={tabStyle(activeTab === 'basic')} onClick={() => setActiveTab('basic')}>
              Basic Inputs
            </div>
            <div style={tabStyle(activeTab === 'additional')} onClick={() => setActiveTab('additional')}>
              Additional Inputs
            </div>
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1 }}>
            {activeTab === 'basic' ? <BasicInputsTab /> : <AdditionalInputsTab />}
          </div>

        </div>

        {/* Right Panel */}
        <div style={{ width: '65%', display: 'flex', padding: '20px' }}>
          <BridgeCrossSection />
        </div>
      </div>
    </div>
  );
};

export default GroupDesign;
