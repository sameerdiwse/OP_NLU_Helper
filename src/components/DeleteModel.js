import React, { useState } from 'react';
import {
  TextInput,
  Button,
  InlineNotification
} from 'carbon-components-react';

function DeleteModel({ apiKey, region }) {
  const [modelId, setModelId] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    if (!apiKey || !region || !modelId) {
      setStatus({
        kind: 'error',
        title: 'Missing input',
        subtitle: 'API key, region, and model ID are required'
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    fetch(
      `https://api.${region.id}.natural-language-understanding.watson.cloud.ibm.com/v1/models/classifications/${modelId}?version=2022-04-07`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${btoa('apikey:' + apiKey)}`
        }
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error('Delete failed');
        }
        setStatus({
          kind: 'success',
          title: 'Model deleted',
          subtitle: `Model ${modelId} was deleted successfully`
        });
        setModelId('');
      })
      .catch(() => {
        setStatus({
          kind: 'error',
          title: 'Delete failed',
          subtitle: 'Unable to delete model'
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ width: '400px' }}>
      <TextInput
        id="delete-model-id"
        labelText="Model ID"
        placeholder="Enter model ID to delete"
        value={modelId}
        onChange={(e) => setModelId(e.target.value)}
      />

      <div style={{ marginTop: '1rem' }}>
        <Button
          kind="danger"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? 'Deleting…' : 'Delete Model'}
        </Button>
      </div>

      {status && (
        <div style={{ marginTop: '1rem' }}>
          <InlineNotification
            kind={status.kind}
            title={status.title}
            subtitle={status.subtitle}
            lowContrast
          />
        </div>
      )}
    </div>
  );
}

export default DeleteModel;
