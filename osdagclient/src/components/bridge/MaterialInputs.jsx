import React from 'react';
import { themeInfo } from './theme';

const MaterialInputs = ({ disabled }) => {
  const inputStyle = {
    backgroundColor: themeInfo.inputBg,
    color: '#fff',
    border: `1px solid ${themeInfo.border}`,
    padding: '5px',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const rowStyle = { marginBottom: '15px' };

  return (
    <div style={{ marginBottom: '20px', opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      <h3 style={{ textDecoration: 'underline', color: themeInfo.textLight }}>Material Inputs</h3>
      
      <div style={rowStyle}>
        <label>Girder</label>
        <select style={inputStyle}>
          <option value="E250">E250</option>
          <option value="E350">E350</option>
          <option value="E450">E450</option>
        </select>
      </div>

      <div style={rowStyle}>
        <label>Cross Bracing</label>
        <select style={inputStyle}>
          <option value="E250">E250</option>
          <option value="E350">E350</option>
          <option value="E450">E450</option>
        </select>
      </div>

      <div style={rowStyle}>
        <label>Deck</label>
        <select style={inputStyle}>
          <option value="M25">M25</option>
          <option value="M30">M30</option>
          <option value="M35">M35</option>
          <option value="M40">M40</option>
          <option value="M45">M45</option>
          <option value="M50">M50</option>
          <option value="M55">M55</option>
          <option value="M60">M60</option>
        </select>
      </div>
    </div>
  );
};

export default MaterialInputs;
