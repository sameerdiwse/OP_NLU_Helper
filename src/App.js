import React, { useState } from 'react';
import TrainModel from './components/TrainModel';
import ListModels from './components/ListModels';
import DeleteModel from './components/DeleteModel';
import TestModel from './components/TestModel';
import {
  Button,
  TextInput,
  Dropdown,
  Tabs,
  Tab
} from 'carbon-components-react';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);          // ← added for toggle
  const [region, setRegion] = useState(null);
  const [trainingInput, setTrainingInput] = useState('');
  const [deleteInput, setDeleteInput] = useState('');
  const [testInput, setTestInput] = useState('');
  const [result, setResult] = useState('');

  const regions = [
    { id: 'au-syd', label: 'AU Sydney' },
    { id: 'us-south', label: 'US South' },
    { id: 'eu-gb', label: 'EU London' },
    { id: 'eu-de', label: 'EU Frankfurt' },
    { id: 'jp-tok', label: 'JP Tokyo' }
  ];

  const handleSubmit = (tab) => {
    let inputValue = '';
    if (tab === 'training') inputValue = trainingInput;
    if (tab === 'delete') inputValue = deleteInput;
    if (tab === 'test') inputValue = testInput;

    setResult(
      `Tab: ${tab.toUpperCase()} | Input: ${inputValue} | API Key: ${apiKey} | Region: ${region?.label || ''}`
    );
  };

  return (
    <div className="app-container">

{/* Title */}
      <div className="app-title" style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <h1>NLU Model Hub</h1>
      </div>

      {/* API Key and Region */}
      <div className="top-section">
        <div className="bx--text-input-wrapper" style={{ position: 'relative' }}>
          <TextInput
            id="api-key"
            labelText="API Key"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            type={showApiKey ? 'text' : 'password'}
          />
          <button
            type="button"
            className="bx--text-input--password__visibility__toggle"
            onClick={() => setShowApiKey(!showApiKey)}
            aria-label={showApiKey ? "Hide API key" : "Show API key"}
            title={showApiKey ? "Hide API key" : "Show API key"}
          >
            {showApiKey ? 'Hide' : 'Show'}
            {/* 
              If you install @carbon/icons-react, replace the line above with:
              {showApiKey ? <ViewOff16 /> : <View16 />}
            */}
          </button>
        </div>

        <Dropdown
          id="region-dropdown"
          label="Select Region"
          items={regions}
          itemToString={(item) => (item ? item.label : '')}
          selectedItem={region}
          onChange={({ selectedItem }) => setRegion(selectedItem)}
        />
      </div>

      {/* Tabs */}
      <Tabs>
        <Tab label="Training / Create Model">
          <TrainModel apiKey={apiKey} region={region} />
        </Tab>

        {/* <Tab label="My Models">
          <ListModels apiKey={apiKey} region={region} />
        </Tab> */}

        <Tab label="Delete Model">
          <DeleteModel apiKey={apiKey} region={region} />
        </Tab>

        <Tab label="Test Model">
          <TestModel apiKey={apiKey} region={region} />
        </Tab>
      </Tabs>

      {/* Result */}
      {result && (
        <div className="result-display">
          <b>{result}</b>
        </div>
      )}
    </div>
  );
}

export default App;