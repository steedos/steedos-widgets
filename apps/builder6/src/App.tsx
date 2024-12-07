import { useState } from 'react';
import { BuilderComponent } from '@builder6/react';
import '@builder6/widgets';
import * as uuid from 'uuid';
import './App.css';

const RenderAmis = ({schema, data}) => {
  const id = uuid.v4();
  const content = {
    id,
    data: {
      blocks: [
        {
          "@type": "@builder.io/sdk:Element",
          "@version": 2,
          layerName: "Page",
          id: `builder-${uuid.v4()}`,
          component: {
            name: "Builder6:Amis",
            options: {
              schema: schema,
              data: data,
            },
          },
          responsiveStyles: {
            large: {
              display: "flex",
              flexDirection: "column",
              position: "relative",
              flexShrink: "0",
              boxSizing: "border-box",
              width: "100%",
            },
          },
        },
      ],
    },
  };

  return <BuilderComponent content={content} model="page" />;
};

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [parsedJson, setParsedJson] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setJsonInput(value);
    try {
      const parsed = JSON.parse(value);
      setParsedJson(parsed);
      setError('');
    } catch (err) {
      setParsedJson(null);
      setError('Invalid JSON');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-4 border-r border-gray-300 bg-gray-50 overflow-auto">
        <textarea
          value={jsonInput}
          onChange={handleInputChange}
          placeholder="Input JSON here"
          className="w-full h-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>
      <div className="flex-1 p-4 bg-white overflow-auto">
        {error ? (
          <div className="text-red-500 font-semibold text-center mt-4">{error}</div>
        ) : (
          parsedJson && <RenderAmis schema={parsedJson} data={{}}/>
        )}
      </div>
    </div>
  );
};

export default App;