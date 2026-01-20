import React, { useState } from 'react';
import {
  TextArea,
  TextInput,
  Button,
  InlineNotification
} from 'carbon-components-react';

function TestModel({ apiKey, region }) {
  const [modelId, setModelId] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTest = () => {
    if (!apiKey || !region || !modelId || !text) {
      setError('API key, region, model ID, and text are required');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    fetch(
      `https://api.${region.id}.natural-language-understanding.watson.cloud.ibm.com/v1/analyze?version=2022-04-07`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa('apikey:' + apiKey)}`
        },
        body: JSON.stringify({
          text,
          features: {
            classifications: {
              model: modelId
            }
          }
        })
      }
    )
      .then((res) => res.json())
      .then((data) => setResult(data.classifications || []))
      .catch(() => setError('Failed to test model'))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <TextInput
        id="test-model-id"
        labelText="Model ID"
        placeholder="Enter model ID"
        value={modelId}
        onChange={(e) => setModelId(e.target.value)}
      />

      <div style={{ marginTop: '1rem' }}>
        <TextArea
          id="test-text"
          labelText="Input Text"
          placeholder="Enter description to analyze"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Button onClick={handleTest} disabled={loading}>
          {loading ? 'Testing…' : 'Test Model'}
        </Button>
      </div>

      {error && (
        <div style={{ marginTop: '1rem' }}>
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={error}
            lowContrast
          />
        </div>
      )}

      {result && (
        <div style={{ marginTop: '1rem' }}>
          <pre style={{ background: '#f4f4f4', padding: '1rem' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default TestModel;
