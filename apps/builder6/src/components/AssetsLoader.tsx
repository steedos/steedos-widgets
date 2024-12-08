import React, { Component } from 'react';
import loader from '@monaco-editor/loader';

type AssetPackage = {
  package: string;
  urls: string[];
  library: string;
};

type AssetComponent = {
  url: string;
  exportName?: string;
  npm?: {
    package: string;
    exportName: string;
  };
};

type AssetConfig = {
  packages?: AssetPackage[];
  components?: AssetComponent[];
};

type DynamicAssetsLoaderProps = {
  assetUrls: string[];
  children?: React.ReactNode;
};

type DynamicAssetsLoaderState = {
  assetsLoaded: boolean;
};

export class AssetsLoader extends Component<DynamicAssetsLoaderProps, DynamicAssetsLoaderState> {
  static loadingRemoteAssets: Record<string, boolean> = {};
  static packages: Record<string, AssetPackage> = {};
  static loader = loader;

  constructor(props: DynamicAssetsLoaderProps) {
    super(props);
    this.state = {
      assetsLoaded: false
    };
  }

  componentDidMount() {
    const { assetUrls } = this.props;
    this.registerRemoteAssets(assetUrls);
  }

  async registerRemoteAssets(assetUrls: string[]): Promise<void> {
    for await (const assetUrl of assetUrls) {
      if (AssetsLoader.loadingRemoteAssets[assetUrl]) {
        console.log(`Already loading: ${assetUrl}`);
        continue;
      }

      AssetsLoader.loadingRemoteAssets[assetUrl] = true;

      try {
        const response = await fetch(assetUrl, { mode: 'cors' });
        if (!response.ok) {
          throw new Error(`Failed to fetch asset: ${response.statusText}`);
        }
        const assets: AssetConfig = await response.json();
        await this.registerAssets(assets);
        console.log(`Assets loaded: ${assetUrl}`);
      } catch (error) {
        console.error(`Error loading asset from ${assetUrl}:`, error);
      } finally {
        delete AssetsLoader.loadingRemoteAssets[assetUrl];
      }
    }

    this.setState({ assetsLoaded: true });
  }

  async registerAssets(assets: AssetConfig): Promise<void> {
    const { packages, components } = assets;

    // Load packages
    for (const pkg of packages || []) {
      if (pkg.urls && pkg.library) {
        for (const url of pkg.urls) {
          if (url.endsWith('.js')) {
            await this.injectScript(url);
          } else if (url.endsWith('.css')) {
            this.injectCSS(url);
          }
        }
        AssetsLoader.packages[pkg.package] = pkg;
      }
    }

    // Load components
    for (const component of components || []) {
      if (component.url) {
        await this.injectScript(component.url);
      }
    }
  }

  injectScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  injectCSS(href: string): void {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
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

