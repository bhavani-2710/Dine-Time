import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native";

const RestaurantCarousel = ({ carouselData }) => {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const windowWidth = Dimensions.get("window").width;

  const handleNextImage = () => {
    if (currentIndex < carouselData?.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      carouselRef.current.scrollToIndex({ index: nextIndex, animated: true });
    } else if (currentIndex == carouselData?.length - 1) {
      const nextIndex = 0;
      setCurrentIndex(nextIndex);
      carouselRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const handlePreviousImage = () => {
    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      setCurrentIndex(previousIndex);
      carouselRef.current.scrollToIndex({
        index: previousIndex,
        animated: true,
      });
    } else if (currentIndex == 0) {
      const previousIndex = carouselData?.length - 1;
      setCurrentIndex(previousIndex);
      carouselRef.current.scrollToIndex({
        index: previousIndex,
        animated: true,
      });
    }
  };

  const getItemLayout = (data, index) => ({
    length: windowWidth - 2,
    offset: (windowWidth - 2) * index,
    index,
  });

  return (
    <View className="h-64 max-w-[98%] my-5 rounded-[25px]">
      <FlatList
        ref={carouselRef}
        keyExtractor={(item, index) => index.toString()}
        getItemLayout={getItemLayout}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={{ borderRadius: 25, display: "flex" }}
        contentContainerStyle={{alignItems: "center", justifyContent: "center"}}
        data={carouselData}
        renderItem={({ item }) => (
          <View
            style={{ width: windowWidth - 2 }}
            className={`h-64 relative flex items-center justify-center`}
          >
            <TouchableOpacity
              onPress={handlePreviousImage}
              className="absolute top-[45%] bg-[rgba(0,0,0,0.6)] rounded-[50%] p-2 z-10 left-[2%]"
            >
              <Ionicons name="arrow-back" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNextImage}
              className="absolute top-[45%] bg-[rgba(0,0,0,0.6)] rounded-[50%] p-2 z-10 right-[2%]"
            >
              <Ionicons name="arrow-forward" size={18} color="white" />
            </TouchableOpacity>

            {/* Image Index Indicator */}
            <View className="absolute flex justify-center items-center flex-row left-1/2 -translate-x-1/2 z-10 bottom-5">
              {carouselData?.map((_, index) => (
                <View
                  key={index}
                  className={`${index == currentIndex ? "h-3 w-3 bg-[#f49b33]" : "bg-white h-2 w-2"} p-1 mx-1 rounded-full`}
                />
              ))}
            </View>

            {/* IMAGES */}
            <Image
              source={{ uri: item }}
              resizeMode="cover"
              style={{ width: windowWidth - 20 }} // Adjust the 40 as needed
              className="opacity-50 bg-black h-64 rounded-[25px] items-center justify-center"
            />
          </View>
        )}
      />
    </View>
  );
};

export default RestaurantCarousel;
