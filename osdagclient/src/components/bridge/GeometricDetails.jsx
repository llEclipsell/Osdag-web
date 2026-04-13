import React, { useState } from 'react';
import { themeInfo } from './theme';
import { validateGeometry } from '../../api/bridgeApi';
import ModifyGeometryModal from './ModifyGeometryModal';

const GeometricDetails = ({ carriagewayWidth, setCarriagewayWidth, disabled }) => {
  const [span, setSpan] = useState('');
  const [footpath, setFootpath] = useState('None');
  const [skewAngle, setSkewAngle] = useState('');
  
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [girderData, setGirderData] = useState({ girderSpacing: 0, numGirders: 0, deckOverhangWidth: 0 });

  const handleBlur = async () => {
    try {
      const res = await validateGeometry({
        span: span || undefined,
        carriageway_width: carriagewayWidth || undefined,
        skew_angle: skewAngle || undefined
      });
      if (res.data) {
        setErrors(res.data.errors || {});
      }
    } catch (err) {
      console.error("Geometry validation query failed", err);
    }
  };

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
  const errorStyle = { color: themeInfo.red, fontSize: '0.8em', marginTop: '4px' };

  return (
    <div style={{ marginBottom: '20px', opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ textDecoration: 'underline', margin: 0, color: themeInfo.textLight }}>Geometric Details</h3>
        <button 
          type="button" 
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: themeInfo.greenDark, color: '#fff', fontSize: '0.85em', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Modify Additional Geometry
        </button>
      </div>

      <div style={rowStyle}>
        <label>Span (m)</label>
        <input type="number" style={inputStyle} value={span} onChange={e => setSpan(e.target.value)} onBlur={handleBlur} />
        {errors.span && <div style={errorStyle}>{errors.span}</div>}
      </div>

      <div style={rowStyle}>
        <label>Carriageway Width (m)</label>
        <input type="number" style={inputStyle} value={carriagewayWidth} onChange={e => setCarriagewayWidth(e.target.value)} onBlur={handleBlur} />
        {errors.carriageway_width && <div style={errorStyle}>{errors.carriageway_width}</div>}
      </div>

      <div style={rowStyle}>
        <label>Footpath</label>
        <select style={inputStyle} value={footpath} onChange={e => setFootpath(e.target.value)}>
          <option value="None">None</option>
          <option value="Single-sided">Single-sided</option>
          <option value="Both">Both</option>
        </select>
      </div>

      <div style={rowStyle}>
        <label>Skew Angle (degrees)</label>
        <input type="number" style={inputStyle} value={skewAngle} onChange={e => setSkewAngle(e.target.value)} onBlur={handleBlur} />
        {errors.skew_angle && <div style={errorStyle}>{errors.skew_angle}</div>}
      </div>
      
      {girderData.numGirders > 0 && (
         <div style={{ fontSize: '0.85em', color: themeInfo.textMuted }}>
           Saved Modal Geometry - Spacing: {girderData.girderSpacing}m, Girders: {girderData.numGirders}, Overhang: {girderData.deckOverhangWidth}m
         </div>
      )}

      {showModal && (
        <ModifyGeometryModal
          carriagewayWidth={carriagewayWidth}
          initialValues={girderData}
          onSave={(gs, ng, dow) => {
            setGirderData({ girderSpacing: gs, numGirders: ng, deckOverhangWidth: dow });
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default GeometricDetails;
