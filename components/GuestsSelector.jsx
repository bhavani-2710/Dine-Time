import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, TouchableOpacity, View } from "react-native";

const GuestsSelector = ({ selectedNumber, setSelectedNumber }) => {
  const decrement = () => {
    if (selectedNumber > 1) setSelectedNumber(selectedNumber - 1);
  };
  const increment = () => {
    if (selectedNumber < 10) setSelectedNumber(selectedNumber + 1);
  };
  return (
    <View className="flex flex-row items-center mx-1 rounded-lg text-white text-lg">
      <TouchableOpacity
        onPress={decrement}
        className="rounded border border-[#474747] py-2 px-2"
      >
        <View className="text-white text-lg border rounded-full">
          <FontAwesome name="minus-circle" size={22} color="#f49b33" />
        </View>
      </TouchableOpacity>

      <Text className="px-4 py-2 text-white bg-[#474747] border border-[#474747] text-lg">
        {selectedNumber}
      </Text>

      <TouchableOpacity
        onPress={increment}
        className="rounded border border-[#474747] py-2 px-2"
      >
        <View className="text-white text-lg border rounded-full">
          <FontAwesome name="plus-circle" size={22} color="#f49b33" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default GuestsSelector;
