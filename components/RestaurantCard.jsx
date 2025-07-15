import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const RestaurantCard = ({ restaurant }) => {

  const router = useRouter()
const encodedName = encodeURIComponent(restaurant.name); // Important!
  return (
    <TouchableOpacity onPress={() => router.push(`/restaurant/${restaurant.slug}`)} className="max-w-xs m-2 border rounded-lg shadow-sm bg-[#5d5d5d] border-[#2b2b2b] items-center">
      <Image
        className="rounded-t-lg mt-5 h-32 w-72"
        source={{ uri: restaurant.image }}
        resizeMode="cover"
      />
      <View className="p-5">
        <Text className="mb-2 text-2xl font-bold tracking-tight text-white">
          {restaurant.name}
        </Text>
        <Text className="mb-3 font-normal text-gray-400">
          {restaurant.address}
        </Text>
        <Text className="font-normal text-gray-400">
          Open from{" "}
          <Text className="text-[#f49b33] font-normal">
            {restaurant.opening} hrs
          </Text>{" "}
          to{" "}
          <Text className="text-[#f49b33] font-normal">
            {restaurant.closing} hrs
          </Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantCard;
