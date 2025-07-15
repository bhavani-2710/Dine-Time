import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Formik } from "formik";
import { useEffect } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/dinetimelogo.png";
import entryImage from "../../assets/images/Frame.png";
import { auth, db } from "../../config/firebaseConfig";
import { useUserContext } from "../../contexts/UserContext";
import { signUpValidationSchema } from "../../utils/authSchema";
import { useGoogleAuth } from "../../utils/googleAuth";

const SignUp = () => {
  const router = useRouter();
  const { userEmail, loading } = useUserContext();
  const { signInWithGoogle } = useGoogleAuth();

  const handleSignup = async (values, { resetForm }) => {
    const { name, email, password } = values;
    try {
      // Create user
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

      // Update user profile with name
      await updateProfile(user, { displayName: name });

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        createdAt: new Date().toISOString(),
      });

      await AsyncStorage.setItem("userEmail", email);

      // Reset form and navigate
      resetForm();
      router.push("/home"); // or navigate to your home/dashboard scre
    } catch (error) {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "Signup Failed!",
          "This email address is already in use. Please use a different email.",
          [{ text: "OK" }]
        );
        resetForm();
      } else {
        Alert.alert(
          "Error Signing Up!",
          "An unexpected error occurred. Please try again later.",
          [{ text: "OK" }]
        );
      }
    }
  };

  useEffect(() => {
    if (!loading && userEmail) {
      router.replace("/home");
    }
  }, [userEmail, loading]);

  return (
    <SafeAreaView className={`bg-[#2b2b2b]`}>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="flex justify-center items-center">
          <Image source={logo} style={{ height: 265, width: 300 }} />
          <Text className="text-lg text-center text-white font-bold mb-10 -mt-28">
            Let's get you started!
          </Text>

          <View className="w-5/6">
            <Formik
              initialValues={{ name: "", email: "", password: "" }}
              validationSchema={signUpValidationSchema}
              onSubmit={handleSignup}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View className="w-full">
                  <TextInput
                    className="my-2.5 h-12 border border-white text-white text-lg rounded-lg px-3"
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    placeholder="Name"
                    placeholderTextColor="#A5BFCC"
                  />
                  {touched.name && errors.name && (
                    <Text className="text-red-500 text-xs mb-2">
                      {errors.name}
                    </Text>
                  )}

                  <TextInput
                    className="my-2.5 h-12 border border-white text-white text-lg rounded-lg px-3"
                    keyboardType="email-address"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    placeholder="Email"
                    placeholderTextColor="#A5BFCC"
                  />
                  {touched.email && errors.email && (
                    <Text className="text-red-500 text-xs mb-2">
                      {errors.email}
                    </Text>
                  )}

                  <TextInput
                    className="my-2.5 h-12 border border-white text-white text-lg rounded-lg px-3"
                    secureTextEntry={true}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    placeholder="Password"
                    placeholderTextColor="#A5BFCC"
                  />
                  {touched.password && errors.password && (
                    <Text className="text-red-500 text-xs mb-2">
                      {errors.password}
                    </Text>
                  )}

                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="p-3 my-10 bg-[#f49b33] text-black rounded-lg"
                  >
                    <Text className="text-xl ont-semibold text-center">
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            <View>
              <TouchableOpacity
                className="flex flex-row items-center justify-center -mt-5"
                onPress={() => router.push("/sign-in")}
              >
                <Text className="text-white font-semibold">
                  Already a User?{" "}
                </Text>
                <Text className="text-base font-semibold italic underline decoration-4 underline-offset-8 text-[#f49b33]">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* GOOGLE */}
          <View className="flex items-center justify-center">
            <Text className="text-center text-lg font-semibold my-5 text-white">
              <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" />
              {"   "}Other Options{"  "}{" "}
              <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" />
            </Text>

            <TouchableOpacity
              onPress={signInWithGoogle}
              className="rounded-full w-[40] h-[40] p-2 my-2 bg-white text-center flex items-center"
            >
              <Image
                source={{
                  uri: "https://developers.google.com/identity/images/g-logo.png",
                }}
                style={{ width: 25, height: 25 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* IMAGE */}
        <View className="flex-1">
          <Image
            source={entryImage}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
        <StatusBar barStyle={"light-content"} backgroundColor={"#2b2b2b"} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
