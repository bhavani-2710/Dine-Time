import 'dotenv/config';

export default {
  expo: {
    name: "DineTime",
    slug: "DineTime",
    owner: "212133bhavani",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "dinetime",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    sdkVersion: "53.0.0",

    ios: {
      supportsTablet: true,
    },

    android: {
      package: "com.x212133bhavani.dinetimeandroid",
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      intentFilters: [
        {
          action: "VIEW",
          data: {
            scheme: "dinetime",
            host: "auth",
          },
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/icon.png",
    },

    plugins: [
      "@react-native-google-signin/google-signin",
      "expo-router",
      "expo-web-browser",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon-light.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
    },

    extra: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
      GOOGLE_AUTH_WEBCLIENT_ID: process.env.GOOGLE_AUTH_WEBCLIENT_ID,
      eas: {
        projectId: "5524e965-20c4-4436-acf5-e7f8db69d5a3",
      },
    },
  },
};
