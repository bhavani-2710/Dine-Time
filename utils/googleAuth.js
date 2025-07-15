import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

const { GOOGLE_AUTH_WEBCLIENT_ID } = Constants.expoConfig.extra;

// Configure Google Sign-In
GoogleSignin.configure({
  // Web client ID from Firebase console (this is crucial - must be the Web client ID)
  webClientId: GOOGLE_AUTH_WEBCLIENT_ID,

  // Request ID token for Firebase authentication
  requestIdToken: true,

  // Optional: Offline access for server-side operations
  offlineAccess: false, // Set to false unless you need refresh tokens

  // Optional: Force account selection
  forceCodeForRefreshToken: true,

  // Optional: Scopes you want to request
  scopes: ["openid", "profile", "email"],
});

export const useGoogleAuth = () => {
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const idToken = userInfo.data?.idToken || userInfo.user?.idToken;
      if (!idToken) throw new Error("No ID token received from Google Sign-In");

      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const { uid, email, displayName, photoURL } = userCredential.user;

      // Reference to user document in Firestore
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      let userData;
      if (userDocSnap.exists()) {
        // User exists, fetch the data
        userData = userDocSnap.data();
        console.log("User exists in Firestore:", userData);
      } else {
        // User doesn't exist, create new document
        userData = {
          uid,
          email,
          name: displayName,
          photoURL,
          createdAt: new Date().toISOString(), // Optional
        };

        await setDoc(userDocRef, userData);
        console.log("New user created in Firestore:", userData);
      }

      return userData;
    } catch (error) {
      console.error("Google sign-in error:", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled the login flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Sign-in is in progress already");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Google Play Services not available");
      } else {
        console.log("Unknown error:", error);
      }
      throw error;
    }
  };

  const signOutFromGoogle = async () => {
    try {
      await GoogleSignin.signOut();
      console.log("Signed out successfully");
    } catch (error) {
      console.error("Google Sign out error:", error);
    }
  };

  const isSignedIn = async () => {
    try {
      const user = await GoogleSignin.getCurrentUser();
      return user.idToken ? true : false;
    } catch (error) {
      console.error("Check sign-in status error:", error);
      return false;
    }
  };

  return {
    signInWithGoogle,
    signOutFromGoogle,
    isSignedIn,
  };
};

// Alternative hook that automatically handles sign-in state
export const useGoogleAuthState = () => {
  const { signInWithGoogle, signOutFromGoogle, isSignedIn } = useGoogleAuth();

  return {
    signInWithGoogle,
    signOutFromGoogle,
    isSignedIn,
  };
};
