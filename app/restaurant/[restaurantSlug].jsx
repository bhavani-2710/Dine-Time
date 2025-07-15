import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GuestsSelector from "../../components/GuestsSelector";
import RestaurantCarousel from "../../components/RestaurantCarousel";
import RestaurantDatePicker from "../../components/RestaurantDatePicker";
import RestaurantSlots from "../../components/RestaurantSlots";
import { db } from "../../config/firebaseConfig";

const Restaurant = () => {
  const { restaurantSlug } = useLocalSearchParams();
  const router = useRouter()

  const [restaurant, setRestaurant] = useState({});
  const [carouselData, setCarouselData] = useState({});
  const [slotsData, setSlotsData] = useState({});
  const [date, setDate] = useState(new Date());
  const [selectedNumber, setSelectedNumber] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const getData = async () => {
    try {
      // Get Restaurant Data
      const restaurantQuery = query(
        collection(db, "restaurants"),
        where("slug", "==", restaurantSlug)
      );
      const restaurantSnapshot = await getDocs(restaurantQuery);

      if (restaurantSnapshot.empty) {
        console.log("No matching restaurant found.");
        return;
      }
      restaurantSnapshot.forEach(async (restaurantItem) => {
        const restaurantData = restaurantItem.data();
        setRestaurant(restaurantData);

        // Get Carousel Data
        const carouselQuery = query(
          collection(db, "carousel"),
          where("res_id", "==", restaurantItem.ref)
        );
        const carouselSnapshot = await getDocs(carouselQuery);

        if (carouselSnapshot.empty) {
          console.log("No matching carousels found.");
          return;
        }

        let carouselImages = [];
        carouselSnapshot.forEach((carouselItem) => {
          carouselImages.push(carouselItem.data());
        });
        setCarouselData(carouselImages[0]?.images);

        // Get Slots Data
        const slotsQuery = query(
          collection(db, "slots"),
          where("ref_id", "==", restaurantItem.ref)
        );
        const slotsSnapshot = await getDocs(slotsQuery);

        if (slotsSnapshot.empty) {
          console.log("No matching slots found.");
          return;
        }

        let slots = [];
        slotsSnapshot.forEach((slotsItem) => {
          slots.push(slotsItem.data());
        });
        setSlotsData(slots[0]?.slot);
      });
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  const handleLocation = async () => {
    try {
      const url = "https://maps.google.com/?q=New+Nikita+Apartment+I";
      await Linking.openURL(url);
    } catch (error) {
      console.log("URL not supported: ", url);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // useEffect(() => {
  //   console.log(restaurant, carouselData, slotsData);
  // }, [restaurant, carouselData, slotsData]);

  return (
    <SafeAreaView
      style={[
        { backgroundColor: "#2b2b2b" },
        Platform.OS == "android" && { paddingBottom: 20 },
      ]}
    >
      <ScrollView className="mt-10 h-full" showsVerticalScrollIndicator={false}>
        <View className="flex flex-row items-start mx-2 mb-2">
          <TouchableOpacity onPress={() => router.push('/home')} className="flex-row justify-evenly items-center w-40 p-1 m-1 rounded-md bg-white">
            <Ionicons name="home" size={18} color="black" />
            <Text className="p-1">Back to Home</Text>
          </TouchableOpacity>
        </View>
        {/* TITLE */}
        <View className="flex-1 my-1 p-2">
          <Text className="text-center text-2xl text-[#f49b33] mr-2 font-semibold">
            {restaurant?.name?.toUpperCase()}
          </Text>
          <View className="border-b border-[#f49b33] mt-4" />
        </View>

        {/* CAROUSEL */}
        <RestaurantCarousel carouselData={carouselData} />

        {/* Location */}
        <View className="flex-1 flex-row mt-2 p-3">
          <Ionicons
            name="location-sharp"
            className="mt-2"
            size={30}
            color="#f49b33"
          />
          <Text className="max-w-[75%] text-white text-md ml-2">
            {restaurant?.address} |{"  "}
            <Text
              className="underline flex items-center text-[#f49b33] italic text-md ml-2 font-semibold"
              onPress={handleLocation}
            >
              Get Direction
            </Text>
          </Text>
        </View>

        {/* Opening & Closing Time */}
        <View className="flex-1 flex-row p-3">
          <Ionicons name="time" className="ml-1" size={24} color="#f49b33" />
          <Text className="max-w-[75%] font-semibold text-white text-md ml-2">
            {restaurant?.opening} hrs - {restaurant?.closing} hrs
          </Text>
        </View>

        <View className="border border-[#f49b33] rounded-2xl mx-3 my-2">
          {/* Date Picker */}
          <View className="flex-1 flex-row mx-2.5 mt-3 px-2 py-1 justify-end items-center">
            <View className="flex-1 flex-row">
              <Ionicons name="calendar" size={22} color="#f49b33" />
              <Text className="text-white mx-2 text-md">
                Select Booking Date:{" "}
              </Text>
            </View>
            <RestaurantDatePicker date={date} setDate={setDate} />
          </View>

          {/* Select No. of Guests */}
          <View className="flex-1 flex-row ml-2.5 mr-5 mb-5 px-2 py-1 bg-[#474747] rounded-lg justify-end items-center">
            <View className="flex-1 flex-row">
              <Ionicons name="people" size={22} color="#f49b33" />
              <Text className="text-white mx-2 text-md">
                Select No. of Guests:{" "}
              </Text>
            </View>
            <GuestsSelector
              selectedNumber={selectedNumber}
              setSelectedNumber={setSelectedNumber}
            />
          </View>
        </View>

        {/* SLOTS */}
        <View className="flex-1">
          <RestaurantSlots
            date={date}
            selectedGuests={selectedNumber}
            slots={slotsData}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            restaurant={restaurant?.name}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Restaurant;
