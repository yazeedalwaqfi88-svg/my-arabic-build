import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.mostasharak.binaa",
  appName: "مستشارك للبناء",
  webDir: "dist",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
    // For live-reload during development, point this to your Lovable preview URL:
    // url: "https://id-preview--682ecec2-91f1-4ef3-9914-2344bb610e56.lovable.app",
    // cleartext: true,
  },
  android: {
    backgroundColor: "#0b1220",
    allowMixedContent: false,
  },
  ios: {
    backgroundColor: "#0b1220",
    contentInset: "always",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#0b1220",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#2563EB",
    },
  },
};

export default config;
