import React, { useState } from 'react';
import { Button, TextInput, FileUploader } from 'carbon-components-react';

function TrainModel({ apiKey, region }) {
  const [modelName, setModelName] = useState('');
  const [modelVersion, setModelVersion] = useState('1.0.1');
  const [trainingFile, setTrainingFile] = useState(null);
  const [response, setResponse] = useState('');

  const handleTrain = async () => {
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
            Authorization: `Basic ${btoa('apikey:' + apiKey)}`
          },
          body: formData
        }
      );

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse('Error creating model');
    }
  };

  return (
    <div className="tab-content">
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

      <FileUploader
        labelTitle="Training File"
        labelDescription="Upload CSV or JSON training file"
        buttonLabel="Add file"
        accept={['.csv', '.json']}
        multiple={false}
        onChange={(e) => setTrainingFile(e.target.files[0])}
      />

      <Button kind="primary" onClick={handleTrain}>
        Train Model
      </Button>

      {response && (
        <pre style={{ marginTop: '1rem' }}>{response}</pre>
      )}
    </div>
  );
}

export default TrainModel;
