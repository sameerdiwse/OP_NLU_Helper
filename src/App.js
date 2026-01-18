import React, { useState } from 'react';
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
  const [region, setRegion] = useState('');
  const [trainingInput, setTrainingInput] = useState('');
  const [deleteInput, setDeleteInput] = useState('');
  const [testInput, setTestInput] = useState('');
  const [result, setResult] = useState('');

  const regions = [
    { id: 'us-east', label: 'US East' },
    { id: 'us-west', label: 'US West' },
    { id: 'eu-central', label: 'EU Central' },
    { id: 'ap-south', label: 'AP South' },
    { id: 'sa-east', label: 'SA East' }
  ];

  const handleSubmit = (tab) => {
    let inputValue = '';
    if (tab === 'training') inputValue = trainingInput;
    if (tab === 'delete') inputValue = deleteInput;
    if (tab === 'test') inputValue = testInput;

    setResult(`Tab: ${tab.toUpperCase()} | Input: ${inputValue} | API Key: ${apiKey} | Region: ${region.label || region}`);
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
      <Tabs type="default">
        {/* Training / Create Model Tab */}
        <Tab label="Training / Create Model" tabIndex={0}>
          <div className="tab-content">
            <TextInput
              id="training-input"
              labelText="Enter training data info"
              placeholder="Enter model name or file"
              value={trainingInput}
              onChange={(e) => setTrainingInput(e.target.value)}
            />
            <Button kind="primary" onClick={() => handleSubmit('training')}>
              Submit
            </Button>
          </div>
        </Tab>

        {/* Delete Model Tab */}
        <Tab label="Delete Model" tabIndex={1}>
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

        {/* Test Model Tab */}
        <Tab label="Test Model" tabIndex={2}>
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

      {/* Display result */}
      {result && <div className="result-display"><b>{result}</b></div>}
    </div>
  );
}

export default App;
