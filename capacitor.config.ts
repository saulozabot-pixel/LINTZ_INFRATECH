import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lux.motorista',
  appName: 'Lux',
  webDir: 'dist',
  plugins: {
    LuxDriver: {}
  }
};

export default config;
