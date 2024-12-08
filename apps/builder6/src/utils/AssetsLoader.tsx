import { Builder } from '@builder6/react';

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

export class AssetsLoader {
  static loadingRemoteAssets: Record<string, boolean> = {};
  static packages: Record<string, AssetPackage> = {};

  static async registerRemoteAssets(assetUrls: string[]): Promise<void> {
    for await (const assetUrl of assetUrls) {
      if (this.loadingRemoteAssets[assetUrl]) {
        console.log(`Already loading: ${assetUrl}`);
        continue;
      }

      this.loadingRemoteAssets[assetUrl] = true;

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
        delete this.loadingRemoteAssets[assetUrl];
      }
    }
  }

  static async registerAssets(assets: AssetConfig): Promise<void> {
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
        this.packages[pkg.package] = pkg;
      }
    }

    // Load components
    for (const component of components || []) {
      if (component.url) {
        await this.injectScript(component.url);
        if (component.exportName && typeof window[component.exportName as any] !== "undefined") {
          this.registerMeta(window[component.exportName as any]); 
        }
      }
    }
  }

  static registerMeta = (meta: any) => {

    if (meta.components) {
      meta.components.forEach(async (comp: any, index: number) => {
        if (comp.npm?.package && comp.npm?.exportName) {
          const library = this.packages[comp.npm.package]?.library
          if (library) {
            const pkg = (window as any)[library]
            if (pkg && pkg[comp.npm.exportName]){
              const component = pkg[comp.npm.exportName];
              if (comp.amis) {
                component['amis'] = comp.amis;
              }
              Builder.registerComponent(
                component,
                { name: comp.componentName, }
              );
            } else {
              console.error(`Component ${comp.npm.exportName} not found in package ${comp.npm.package}`);
            }
          }
        }
      });
    }
  };

  static injectScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  static injectCSS(href: string): void {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
}
