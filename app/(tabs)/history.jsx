import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  FlatList,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserContext } from "../../contexts/UserContext";

const History = () => {
  const router = useRouter();
  const { fetchUserData, userEmail, bookings, fetchBookingsData, loading } =
    useUserContext();

  useEffect(() => {
    fetchUserData();
  }, []);

  const renderHeader = () => (
    <View className="flex my-1 p-2 items-center">
      <Text className="text-center text-2xl text-[#f49b33] font-semibold">
        BOOKING HISTORY
      </Text>
      <View className="w-64 border-b border-[#f49b33] mt-4" />
    </View>
  );

  if (userEmail && bookings.length === 0){
    return (
      <SafeAreaView
      style={[
        { backgroundColor: "#2b2b2b" },
        Platform.OS == "android" && { paddingBottom: 20 },
      ]}
      className="flex-1"
    >
      {renderHeader()}
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-lg">No Booking History</Text>
      </View>
    </SafeAreaView>
    )
  }

  return (
    <SafeAreaView
      style={[
        { backgroundColor: "#2b2b2b" },
        Platform.OS == "android" && { paddingBottom: 48 },
      ]}
      className="flex-1"
    >
      {userEmail && bookings ? (
        <FlatList
          data={bookings}
          ListHeaderComponent={renderHeader}
          refreshing={loading}
          onRefresh={() => fetchBookingsData(userEmail)}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }} // To avoid cutoff
          renderItem={({ item }) => (
            <View className="p-4 border-b border-[#f49b33]">
              <Text className="text-white">
                Date: {new Date(item.date).toLocaleDateString("en-GB")}
              </Text>
              <Text className="text-white">Slot: {item.slot}</Text>
              <Text className="text-white">Guests: {item.guests}</Text>
              <Text className="text-white">Restaurant: {item?.restaurant}</Text>
              <Text className="text-white">Email: {item.email}</Text>
            </View>
          )}
        />
      ) : (
        // GUEST USER
        <View className="flex-1 my-1 p-2 items-center">
          <Text className="text-center text-2xl text-[#f49b33] font-semibold">
            BOOKING HISTORY
          </Text>
          <View className="w-64 border-b border-[#f49b33] mt-4" />

          <View className="mt-80 flex items-center justify-center">
            <TouchableOpacity
              onPress={() => router.push("/sign-up")}
              className="py-2 px-7 my-2 bg-[#f49b33] text-black rounded-lg"
            >
              <Text className="text-lg font-semibold text-center">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default History;
