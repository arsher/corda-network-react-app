const firebaseConfig = {
  apiKey: "AIzaSyA6XguuLstuiOx8nOnUzC20r0seCb73PFs",
  authDomain: "cn-onboarding-staging.firebaseapp.com",
  databaseURL: "https://cn-onboarding-staging.firebaseio.com",
  projectId: "cn-onboarding-staging",
  storageBucket: "",
  messagingSenderId: "533730399645",
  appId: "1:533730399645:web:4022b7d71b3491b40d8b74",

  staging: {
    apiKey: process.env.FIREBASE_STAGING_API_KEY,
    authDomain: "cce-staging-a4980.firebaseapp.com",
    databaseURL: "https://cce-staging-a4980.firebaseio.com",
    projectId: "cce-staging-a4980",
    storageBucket: "cce-staging-a4980.appspot.com",
    messagingSenderId: "562359725087"
  },
  production: {
    apiKey: process.env.FIREBASE_PRODUCTION_API_KEY,
    authDomain: "testnet-production.firebaseapp.com",
    databaseURL: "https://testnet-production.firebaseio.com",
    projectId: "testnet-production",
    storageBucket: "testnet-production.appspot.com",
    messagingSenderId: "23231204982"
  }
};

export default firebaseConfig;
