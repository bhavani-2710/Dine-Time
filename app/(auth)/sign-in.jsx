import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
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
import { auth } from "../../config/firebaseConfig";
import { useUserContext } from "../../contexts/UserContext";
import { signInValidationSchema } from "../../utils/authSchema";
import { useGoogleAuth } from "../../utils/googleAuth";

const SignIn = () => {
  const router = useRouter();
  const { userEmail, loading } = useUserContext();
  const { signInWithGoogle } = useGoogleAuth();

  const handleSignIn = async (values, { resetForm }) => {
    const { email, password } = values;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await AsyncStorage.setItem("userEmail", user.email);

      await fetchUserData();

      resetForm();
      router.replace("/home"); // go to dashboard
    } catch (error) {
      console.log(error);
      if (error.code === "auth/invalid-credential") {
        Alert.alert(
          "Sign In Failed!",
          "Incorrect Credentials. Please try again",
          [{ text: "OK" }]
        );
        resetForm();
      } else {
        Alert.alert(
          "Error Signing In!",
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
          <Text className="text-lg text-center text-white font-bold mb-10 -mt-24">
            Welcome Back!
          </Text>

          <View className="w-5/6">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={signInValidationSchema}
              onSubmit={handleSignIn}
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
                    <Text className="text-xl font-semibold text-center">
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            <View>
              <TouchableOpacity
                className="flex flex-row items-center justify-center -mt-5"
                onPress={() => router.push("/sign-up")}
              >
                <Text className="text-white font-semibold">
                  Not a User yet?{"  "}
                </Text>
                <Text className="text-base font-semibold italic underline decoration-4 underline-offset-8 text-[#f49b33]">
                  Sign Up
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

export default SignIn;
