import React, { useState } from 'react';
import { Button, TextInput, FileUploader } from 'carbon-components-react';

function TrainModel({ apiKey, region }) {
  const [modelName, setModelName] = useState('');
  const [modelVersion, setModelVersion] = useState('1.0.1');
  const [trainingFile, setTrainingFile] = useState(null);
  const [response, setResponse] = useState('');
  const [fileError, setFileError] = useState('');
  const [trainingToast, setTrainingToast] = useState(false);

  const handleTrain = async () => {
    if (!trainingFile) {
      setFileError('Training file is required (CSV or JSON)');
      return;
    }
    setFileError('');

    if (!apiKey || !region || !trainingFile || !modelName) {
      alert('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('training_data', trainingFile);
    formData.append('language', 'en');
    formData.append('name', modelName);
    formData.append('model_version', modelVersion);

    try {
      const res = await fetch(
        `https://api.${region.id}.natural-language-understanding.watson.cloud.ibm.com/v1/models/classifications?version=2022-04-07`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${btoa('apikey:' + apiKey)}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      // Show training toast if status is training
      if (data.status === 'training') {
        setTrainingToast(true);

        // Hide toast after 5 seconds
        setTimeout(() => {
          setTrainingToast(false);
        }, 5000);
      }

      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse('Error creating model');
    }
  };

  return (
    <div className="tab-content">
      {/* Toast card */}
      {trainingToast && (
        <div
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            backgroundColor: '#daf5d4', // light green
            color: '#05400a', // dark green text
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            opacity: trainingToast ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            zIndex: 1000,
          }}
        >
          Model is currently training...
        </div>
      )}

      <TextInput
        id="model-name"
        labelText="Model Name"
        value={modelName}
        onChange={(e) => setModelName(e.target.value)}
      />

      <TextInput
        id="model-version"
        labelText="Model Version"
        value={modelVersion}
        onChange={(e) => setModelVersion(e.target.value)}
      />

      <label className="bx--label">
        Training File <span style={{ color: '#da1e28' }}>*</span>
      </label>
      <FileUploader
        labelTitle=""
        labelDescription="Upload CSV or JSON training file"
        buttonLabel="Add file"
        accept={['.csv', '.json']}
        multiple={false}
        onChange={(evt) => {
          const file = evt?.target?.files?.[0];
          if (file) {
            setTrainingFile(file);
          } else {
            setTrainingFile(null);
          }
        }}
        filenameStatus="edit"
        uploadFile={() => {}} // prevent auto-upload
      />

      {fileError && (
        <div style={{ color: '#da1e28', marginTop: '0.5rem' }}>{fileError}</div>
      )}

      <Button kind="primary" onClick={handleTrain}>
        Train Model
      </Button>

      {/* Response display */}
      {response && (() => {
        try {
          const data = JSON.parse(response);
          if (data.status === 'training') {
            // already showing toast, skip inline card
            return null;
          }
        } catch (e) {
          return <pre style={{ marginTop: '1rem' }}>{response}</pre>;
        }

        // show full JSON if not training
        return <pre style={{ marginTop: '1rem' }}>{response}</pre>;
      })()}
    </div>
  );
}

export default TrainModel;
