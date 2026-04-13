import React, { useState } from 'react';
import { themeInfo } from './theme';
import ProjectLocationPanel from './ProjectLocationPanel';
import GeometricDetails from './GeometricDetails';
import MaterialInputs from './MaterialInputs';

const BasicInputsTab = () => {
  const [structureType, setStructureType] = useState('Highway');
  const [carriagewayWidth, setCarriagewayWidth] = useState('');

  const isOther = structureType === 'Other';

  const inputStyle = {
    backgroundColor: themeInfo.inputBg,
    color: '#fff',
    border: `1px solid ${themeInfo.border}`,
    padding: '5px',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Type of Structure */}
      <div>
        <label style={{ display: 'block', marginBottom: '5px' }}>Type of Structure</label>
        <select 
          style={inputStyle} 
          value={structureType} 
          onChange={e => setStructureType(e.target.value)}
        >
          <option value="Highway">Highway</option>
          <option value="Other">Other</option>
        </select>
        {isOther && (
          <div style={{ color: themeInfo.red, fontSize: '0.9em', marginTop: '5px' }}>
            Other structures not included.
          </div>
        )}
      </div>

      <ProjectLocationPanel disabled={isOther} />
      
      <GeometricDetails 
        disabled={isOther} 
        carriagewayWidth={carriagewayWidth} 
        setCarriagewayWidth={setCarriagewayWidth} 
      />
      
      <MaterialInputs disabled={isOther} />

    </div>
  );
};

export default BasicInputsTab;
