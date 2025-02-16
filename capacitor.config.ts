import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.odin.app', // Must be unique and should correspond to domain
  appName: 'Odin-AI',
  webDir: 'dist',
  bundledWebRuntime: false
};

export default config;
