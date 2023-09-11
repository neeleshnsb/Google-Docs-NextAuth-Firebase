import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBhKmgpXqC8ObFxyH4ShYFRPbKsOpcaLc8",
  authDomain: "nextauthfinale.firebaseapp.com",
  projectId: "nextauthfinale",
  storageBucket: "nextauthfinale.appspot.com",
  messagingSenderId: "915550977275",
  appId: "1:915550977275:web:c9d1bb687b44757412845e",
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
