import React, { useState } from 'react';
import TrainModel from './components/TrainModel';
import ListModels from './components/ListModels';

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
  const [region, setRegion] = useState(null); // ✅ FIXED
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
      {/* API Key and Region */}
      <div className="top-section">
        <TextInput
          id="api-key"
          labelText="API Key"
          placeholder="Enter your API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          type="password"
        />

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

        <Tab label="My Models">
          <ListModels apiKey={apiKey} region={region} />
        </Tab>

        <Tab label="Delete Model">
          <div className="tab-content">
            <TextInput
              id="delete-input"
              labelText="Enter model ID to delete"
              placeholder="Model ID"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
            />
            <Button kind="primary" onClick={() => handleSubmit('delete')}>
              Submit
            </Button>
          </div>
        </Tab>

        <Tab label="Test Model">
          <div className="tab-content">
            <TextInput
              id="test-input"
              labelText="Enter test input"
              placeholder="Test data"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
            />
            <Button kind="primary" onClick={() => handleSubmit('test')}>
              Submit
            </Button>
          </div>
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
