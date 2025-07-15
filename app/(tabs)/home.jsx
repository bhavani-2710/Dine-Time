import { BlurView } from "expo-blur";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/dinetimelogo.png";
import banner from "../../assets/images/homeBanner.png";
import RestaurantCard from "../../components/RestaurantCard";
import { db } from "../../config/firebaseConfig";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);

  // Function to get RESTAURANT DATA from firestore database
  useEffect(() => {
    const getRestaurantsData = async () => {
      const q = query(collection(db, "restaurants"));
      const res = await getDocs(q);

      res.forEach((item) => setRestaurants((prev) => [...prev, item.data()]));
    };
    getRestaurantsData();
  }, []);

  const renderRestaurants = ({ item }) => {
    return <RestaurantCard restaurant={item} />;
  };

  return (
    <SafeAreaView
      style={[
        { backgroundColor: "#2b2b2b", flex: 1, paddingBottom: -20 }
      ]}
    >
      {/* HEADER */}
      <View className="flex items-center justify-center">
        <View className="bg-[#5f5f5f] w-11/12 rounded-lg shadow-lg justify-center items-center flex flex-row">
          <View className="flex flex-row justify-center items-center">
            <Text className={`text-lg h-10 px-1 align-middle text-white`}>
              Welcome to
            </Text>
            <Image
              resizeMode="cover"
              className={"w-32 h-20"}
              source={logo}
            />
          </View>
        </View>
      </View>

      {/* DESIGN */}
      <ScrollView stickyHeaderIndices={[0]}>
        <ImageBackground
          resizeMode="cover"
          className="mb-4 w-full bg-[#2b2b2b] h-52 items-center justify-center"
          source={banner}
        >
          <BlurView
            intensity={100}
            tint="dark"
            className="w-full shadow-lg p-4"
          >
            <Text className="text-center text-3xl font-bold text-white">
              Dine with your <Text className="text-[#f49b33]">loved ones!</Text>
            </Text>
          </BlurView>
        </ImageBackground>

        {/* MAIN CONTENT */}

        {/* ITEM 1 */}
        {/* Heading */}
        <View className="px-4 bg-[#2b2b2b] flex-row items-center">
          <Text className="text-3xl text-white mr-2 font-semibold">
            Special Discount (%)
          </Text>
        </View>

        {/* Cards */}
        {restaurants.length > 0 ? (
          <View className="mt-[-10]">
            <FlatList
              data={restaurants}
              renderItem={renderRestaurants}
              horizontal
              contentContainerStyle={{ padding: 16 }}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
            />
          </View>
        ) : (
          <ActivityIndicator animating className="p-10" size={"small"} color={"#f49b33"} />
        )}

        {/* ITEM 2 */}
        {/* Heading */}
        <View className="px-4 bg-[#2b2b2b] flex-row items-center">
          <Text className="text-3xl text-[#f49b33] mr-2 font-semibold">
            Our Restaurants
          </Text>
        </View>

        {/* Cards */}
        {restaurants.length > 0 ? (
          <View className="mt-[-10]">
            <FlatList
              data={restaurants}
              renderItem={renderRestaurants}
              horizontal
              contentContainerStyle={{ padding: 16 }}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
            />
          </View>
        ) : (
          <ActivityIndicator animating className="p-10" size={"small"} color={"#f49b33"} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
