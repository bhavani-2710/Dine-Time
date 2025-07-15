import { useGoogleAuth } from "@/utils/googleAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { auth, db } from "../config/firebaseConfig";

const useUser = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({});
  const [userEmail, setUserEmail] = useState(null);
  const [userRef, setUserRef] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    const email = await AsyncStorage.getItem("userEmail");
    if (!email) {
      // GUEST USER
      return;
    }

    setUserEmail(email);

    if (email) {
      try {
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", email)
        );
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const user = userDoc.data();
          const ref = doc(db, "users", userDoc.id);

          setUserData(user);
          setUserRef(ref);

          // console.log("user", user, ref)

          fetchBookingsData(email);
        } else {
          console.log("No user found for email:", email);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const handleLogout = async () => {
    const { isSignedIn, signOutFromGoogle } = useGoogleAuth();
    if (isSignedIn) await signOutFromGoogle();
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("userEmail");

      setUserEmail(null);
      setUserData({});
      setUserRef(null);

      Alert.alert("Success", "Logged out successfully!");
      router.push("/sign-in");
    } catch (error) {
      Alert.alert("Error", "Error while Logging out.");
    }
  };

  const fetchBookingsData = async (userEmail) => {
    if (userEmail) {
      try {
        const bookingQuery = query(
          collection(db, "bookings"),
          where("email", "==", userEmail)
        );
        const bookingSnapshot = await getDocs(bookingQuery);

        if (bookingSnapshot.empty) {
          console.log("No booking history");
          return;
        }

        const bookingsData = [];
        bookingSnapshot.forEach((bookingItem) => {
          const booking = bookingItem.data();
          bookingsData.push({ id: bookingItem.id, ...booking });
        });
        setBookings(bookingsData);
      } catch (error) {
        Alert.alert("Error", "Could not fetch Past Bookings");
      } finally {
        setLoading(false);
      }
    }
  };

  // Persist User after Login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const email = await AsyncStorage.getItem("userEmail");
      // console.log("user", user, email);
      if (user || email) {
        if (user) await AsyncStorage.setItem("userEmail", user.email);
        fetchUserData();
      } else {
        setUserEmail(null);
        setUserData({});
        setUserRef(null);
      }
    });

    return unsubscribe;
  }, [fetchUserData]);

  return {
    userData,
    userEmail,
    userRef,
    loading,
    setLoading,
    bookings,
    handleLogout,
    fetchUserData,
    fetchBookingsData,
  };
};

export default useUser;
