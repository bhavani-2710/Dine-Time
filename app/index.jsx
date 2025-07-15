import { useUserContext } from "@/contexts/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/dinetimelogo.png";
import entryImage from "../assets/images/Frame.png";
import { useGoogleAuth } from "../utils/googleAuth";

export default function Index() {
  const router = useRouter();
  const { userEmail, loading, setLoading } = useUserContext();
  const { signInWithGoogle } = useGoogleAuth();

  const handleGuest = async () => {
    await AsyncStorage.removeItem("userEmail");
    await AsyncStorage.setItem("isGuest", "true");
    router.push("/home");
  };

  useEffect(() => {
    if (!loading && userEmail) {
      router.replace("/home");
    }
  }, [userEmail, loading]);

  return (
    <SafeAreaView className={`bg-[#2b2b2b]`}>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="m-2 flex justify-center items-center">
          <Image source={logo} style={{ height: 300, width: 300 }} />
          <View className="w-3/4 -mt-5">
            <TouchableOpacity
              onPress={() => router.push("/sign-in")}
              className="p-2 my-2 bg-[#f49b33] text-black rounded-lg"
            >
              <Text className="text-lg font-semibold text-center">Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/sign-up")}
              className="p-2 my-2 bg-[#f49b33] text-black rounded-lg"
            >
              <Text className="text-lg font-semibold text-center">Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleGuest}
              className="p-2 my-2 bg-[#2b2b2b] border border-[#f49b33] rounded-lg max-w-fit"
            >
              <Text className="text-lg font-semibold text-[#f49b33] text-center">
                Guest User
              </Text>
            </TouchableOpacity>
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
}
