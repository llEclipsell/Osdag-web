import React, { useState } from 'react';
import { themeInfo } from './theme';
import { validateGirderGeometry } from '../../api/bridgeApi';

const ModifyGeometryModal = ({ carriagewayWidth, initialValues, onSave, onClose }) => {
  const [data, setData] = useState({
    girder_spacing: initialValues?.girderSpacing || 0,
    num_girders: initialValues?.numGirders || 0,
    deck_overhang_width: initialValues?.deckOverhangWidth || 0,
  });
  
  const [errors, setErrors] = useState([]);

  const handleChange = async (field, value) => {
    const newData = { ...data, [field]: value };
    setData(newData);

    try {
      const res = await validateGirderGeometry({
        carriageway_width: carriagewayWidth,
        girder_spacing: String(newData.girder_spacing),
        num_girders: String(newData.num_girders),
        deck_overhang_width: String(newData.deck_overhang_width),
        changed_field: field
      });

      if (res.data) {
        setData({
          girder_spacing: res.data.girder_spacing,
          num_girders: res.data.num_girders,
          deck_overhang_width: res.data.deck_overhang_width
        });
        setErrors(res.data.errors || []);
      }
    } catch (err) {
      console.error("Geometry validation failed", err);
    }
  };

  const inputStyle = {
    backgroundColor: themeInfo.inputBg,
    color: '#fff',
    border: `1px solid ${themeInfo.border}`,
    padding: '5px',
    borderRadius: '4px',
    width: '100%',
    marginBottom: '10px'
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{ backgroundColor: themeInfo.bgPanel, padding: '20px', borderRadius: '8px', minWidth: '350px' }}>
        <h3 style={{ marginTop: 0, color: themeInfo.textLight }}>Modify Girder Geometry</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Girder Spacing (m) [1 dec place]</label>
          <input 
            type="number" step="0.1" style={inputStyle} 
            value={data.girder_spacing} 
            onChange={e => handleChange('girder_spacing', e.target.value)} 
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>No. of Girders [Integer]</label>
          <input 
            type="number" step="1" style={inputStyle} 
            value={data.num_girders} 
            onChange={e => handleChange('num_girders', e.target.value)} 
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Deck Overhang Width (m) [1 dec place]</label>
          <input 
            type="number" step="0.1" style={inputStyle} 
            value={data.deck_overhang_width} 
            onChange={e => handleChange('deck_overhang_width', e.target.value)} 
          />
        </div>

        {errors.length > 0 && (
          <div style={{ color: themeInfo.red, fontSize: '0.85em', marginBottom: '10px' }}>
            {errors.map((e, i) => <div key={i}>{e}</div>)}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button type="button" onClick={onClose}>Cancel</button>
          <button 
            type="button" 
            onClick={() => onSave(data.girder_spacing, data.num_girders, data.deck_overhang_width)} 
            style={{ backgroundColor: themeInfo.green, color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px' }}
            disabled={errors.length > 0}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyGeometryModal;
