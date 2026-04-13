import React from 'react';
import { themeInfo } from './theme';
// Provide a generic placeholder until the actual asset is dropped into the assets folder
const bridgeImage = "https://via.placeholder.com/800x400?text=Bridge+Cross+Section";

const BridgeCrossSection = () => {
  return (
    <div style={{ flex: 1, backgroundColor: themeInfo.bgPanel, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        backgroundColor: themeInfo.green,
        color: '#fff',
        padding: '5px 15px',
        borderRadius: '20px',
        fontWeight: 'bold',
        marginBottom: '20px'
      }}>
        BRIDGE CROSS SECTION (For Nomenclature only)
      </div>
      <div style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', borderRadius: '8px' }}>
        {/* Assumes image exists, otherwise shows alt text gracefully */}
        <img src={bridgeImage} alt="Bridge Cross Section" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
        {/* Placeholder if image is missing */}
        <span style={{ position: 'absolute', color: themeInfo.textMuted, zIndex: 0 }}>
          [ BRIDGE CROSS SECTION IMAGE ]
        </span>
      </div>
    </div>
  );
};

export default BridgeCrossSection;
