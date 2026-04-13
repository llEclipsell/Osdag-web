import React, { useState, useEffect } from 'react';
import { themeInfo } from './theme';
import { getLocationData } from '../../api/bridgeApi';

const ProjectLocationPanel = ({ disabled }) => {
  const [locations, setLocations] = useState([]);
  const [mode, setMode] = useState('list'); // 'list' | 'custom'
  
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  
  const [cityData, setCityData] = useState(null);
  
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customDataDraft, setCustomDataDraft] = useState({
    windSpeed: '', seismicZone: '', zoneFactor: '', maxTemp: '', minTemp: ''
  });
  const [customData, setCustomData] = useState(null);

  useEffect(() => {
    getLocationData().then(res => {
      setLocations(res.data);
      const uniqueStates = [...new Set(res.data.map(loc => loc.state))];
      setStates(uniqueStates);
    }).catch(err => console.error("Failed to load locations", err));
  }, []);

  useEffect(() => {
    if (selectedState) {
      const stateCities = locations.filter(l => l.state === selectedState);
      setCities(stateCities);
      setSelectedCity('');
      setCityData(null);
    } else {
      setCities([]);
    }
  }, [selectedState, locations]);

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    const data = locations.find(l => l.city === cityName && l.state === selectedState);
    setCityData(data || null);
  };

  const handleSaveCustom = () => {
    setCustomData(customDataDraft);
    setShowCustomModal(false);
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
    <div style={{ marginBottom: '20px', opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      <div style={{ backgroundColor: themeInfo.yellow, color: '#000', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold', marginBottom: '10px' }}>
        Project Location Details
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input type="radio" name="locMode" checked={mode === 'list'} onChange={() => setMode('list')} />
          Enter Location Name
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input type="radio" name="locMode" checked={mode === 'custom'} onChange={() => setMode('custom')} />
          Tabulate Custom Loading Parameters
        </label>
      </div>

      {mode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label>State</label>
            <select style={inputStyle} value={selectedState} onChange={e => setSelectedState(e.target.value)}>
              <option value="">Select State</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label>District/City</label>
            <select style={inputStyle} value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
              <option value="">Select City</option>
              {cities.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
            </select>
          </div>

          {cityData && (
            <div style={{ color: themeInfo.green, marginTop: '10px' }}>
              <div style={{ fontWeight: 'bold' }}>{cityData.city}, {cityData.state} Parameters:</div>
              <div>Basic Wind Speed: {cityData.wind_speed} m/s</div>
              <div>Seismic Zone: {cityData.seismic_zone}, Zone Factor: {cityData.zone_factor}</div>
              <div>Max Shade Air Temperature: {cityData.max_temp} °C</div>
              <div>Min Shade Air Temperature: {cityData.min_temp} °C</div>
            </div>
          )}
        </div>
      )}

      {mode === 'custom' && (
        <div>
          <button 
            type="button" 
            onClick={() => setShowCustomModal(true)}
            style={{ padding: '8px 12px', cursor: 'pointer' }}
          >
            Open Parameters Table
          </button>
          
          {customData && (
            <div style={{ color: themeInfo.green, marginTop: '10px' }}>
              <div style={{ fontWeight: 'bold' }}>Custom Parameters:</div>
              <div>Basic Wind Speed: {customData.windSpeed} m/s</div>
              <div>Seismic Zone: {customData.seismicZone}, Zone Factor: {customData.zoneFactor}</div>
              <div>Max Shade Air Temperature: {customData.maxTemp} °C</div>
              <div>Min Shade Air Temperature: {customData.minTemp} °C</div>
            </div>
          )}
        </div>
      )}

      {/* Modal for Custom Data */}
      {showCustomModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ backgroundColor: themeInfo.bgPanel, padding: '20px', borderRadius: '8px', minWidth: '300px' }}>
            <h3 style={{ marginTop: 0, color: themeInfo.textLight }}>Custom Loading Parameters</h3>
            <div style={{ marginBottom: '10px' }}>
              <label>Basic Wind Speed (m/s)</label>
              <input type="number" style={inputStyle} value={customDataDraft.windSpeed} onChange={e => setCustomDataDraft({ ...customDataDraft, windSpeed: e.target.value })} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Seismic Zone</label>
              <input type="text" style={inputStyle} value={customDataDraft.seismicZone} onChange={e => setCustomDataDraft({ ...customDataDraft, seismicZone: e.target.value })} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Zone Factor</label>
              <input type="number" style={inputStyle} value={customDataDraft.zoneFactor} onChange={e => setCustomDataDraft({ ...customDataDraft, zoneFactor: e.target.value })} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Max Shade Air Temperature (°C)</label>
              <input type="number" style={inputStyle} value={customDataDraft.maxTemp} onChange={e => setCustomDataDraft({ ...customDataDraft, maxTemp: e.target.value })} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Min Shade Air Temperature (°C)</label>
              <input type="number" style={inputStyle} value={customDataDraft.minTemp} onChange={e => setCustomDataDraft({ ...customDataDraft, minTemp: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="button" onClick={() => setShowCustomModal(false)}>Cancel</button>
              <button type="button" onClick={handleSaveCustom} style={{ backgroundColor: themeInfo.green, color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px' }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectLocationPanel;
