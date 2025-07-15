import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useUserContext } from "../../contexts/UserContext";

const Profile = () => {
  const router = useRouter();
  const {fetchUserData, handleLogout, userEmail, userData} = useUserContext();

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <SafeAreaView
      style={[
        { backgroundColor: "#2b2b2b" },
        Platform.OS == "android" && { paddingBottom: 48 },
      ]}
    >
      <ScrollView className="h-full">
        <View className="flex-1 justify-center items-center bg-[#2b2b2b]">
          {/* TITLE */}
          <View className="flex-1 my-1 p-2">
            <Text className="text-center text-2xl text-[#f49b33] font-semibold">
              USER PROFILE
            </Text>
            <View className="w-48 border-b border-[#f49b33] mt-4" />
          </View>

          {userEmail ? (
            <View className="flex items-start">
              {/* DETAILS */}
              <View className="flex flex-row items-center justify-between p-2">
                <Text className="text-xl mr-2 font-bold text-gray-200">
                  Name :
                </Text>
                <Text className="m-2 min-w-52 border border-[#f49b33] bg-[#4f4f4f] p-3 text-lg rounded-lg text-white max-w-72">
                  {/* Captalize Name */}
                  {userData.name
                    ?.split(" ")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")}
                </Text>
              </View>
              <View className="flex flex-row items-center justify-between p-2">
                <Text className="text-xl mr-2 font-bold text-gray-200">
                  Email :
                </Text>
                <Text className="m-2 border border-[#f49b33] bg-[#4f4f4f] p-3 text-lg rounded-lg text-white max-w-72">
                  {userData.email}
                </Text>
              </View>
              <View className="flex flex-row items-center justify-between p-2">
                <Text className="text-xl mr-2 font-bold text-gray-200">
                  Created On :
                </Text>
                <Text className="m-2 border border-[#f49b33] bg-[#4f4f4f] p-3 text-lg rounded-lg text-white">
                  {new Date(userData.createdAt).toLocaleDateString("en-GB")}
                </Text>
              </View>

              {/* LOGOUT */}
              <TouchableOpacity
                onPress={handleLogout}
                className="p-2 px-5 mx-2 my-10 bg-[#C75443] rounded-md"
              >
                <Text className="text-lg text-black font-semibold text-center">
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // GUEST USER
            <View className="mt-80 flex items-center justify-center">
              <TouchableOpacity
                onPress={() => router.push('/sign-up')}
                className="py-2 px-7 my-2 bg-[#f49b33] text-black rounded-lg"
              >
                <Text className="text-lg font-semibold text-center">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
