import React, { Component, useState } from 'react';
import { BuilderComponent } from '@builder6/react';
import * as uuid from 'uuid';
import './App.css';
import { AssetsLoader } from './utils/AssetsLoader';


type DynamicAssetsLoaderProps = {
  assetUrls: string[];
  children?: React.ReactNode;
};

type DynamicAssetsLoaderState = {
  assetsLoaded: boolean;
};

export class DynamicAssetsLoader extends Component<DynamicAssetsLoaderProps, DynamicAssetsLoaderState> {
  constructor(props: DynamicAssetsLoaderProps) {
    super(props);
    this.state = {
      assetsLoaded: false
    };
  }

  async componentDidMount() {
    const { assetUrls } = this.props;
    await AssetsLoader.registerRemoteAssets(assetUrls);
    this.setState({ assetsLoaded: true });
  }

  render() {
    const { assetsLoaded } = this.state;
    const { children } = this.props;

    if (!assetsLoaded) {
      return <div>Loading assets dynamically...</div>;
    }

    return <>{children}</>;
  }
}


const RenderAmis = ({schema, data}:any) => {
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
            name: "Steedos:Amis",
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
  } as any;

  return <BuilderComponent content={content} model="page" />;
};

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [parsedJson, setParsedJson] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e:any) => {
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
  // 解析 浏览器 URL 中的 assetUrls 参数，传给 AssetsLoader
  const url = new URL(window.location.href);
  const assetUrlsForQuery = url.searchParams.get('assetUrls')?.split(',') || ['https://unpkg.com/@steedos-widgets/amis-object@3.6.15/dist/assets.json'];
  const [assetUrls, setAssetUrls] = useState(assetUrlsForQuery);

  function handleAssetUrlsChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    const urls = value.split(',').map(url => url.trim());
    setAssetUrls(urls);
  }

  
  return (
      
      <div className="flex h-screen">
        <div className="flex-1 p-4 border-r border-gray-300 bg-gray-50 overflow-auto">
          <div className="flex items-center mb-4">
            <label className="mr-2">Asset URLs:</label>
            <input
              type="text"
              defaultValue={assetUrls.join(',')}
              onChange={handleAssetUrlsChange}
              placeholder="Comma separated URLs"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <textarea
            value={jsonInput}
            onChange={handleInputChange}
            placeholder="Input JSON here"
            className="w-full h-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
        <div className="flex-1 p-4 bg-white overflow-auto">
          <DynamicAssetsLoader assetUrls={assetUrls}>
            {error ? (
              <div className="text-red-500 font-semibold text-center mt-4">{error}</div>
            ) : (
              parsedJson && <RenderAmis schema={parsedJson} data={{}}/>
            )}
          </DynamicAssetsLoader>
        </div>
      </div>
  );
};

export default App;