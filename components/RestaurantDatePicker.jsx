import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

const RestaurantDatePicker = ({date, setDate}) => {
  const [show, setShow] = useState(false);

  const handleDateSelect = () => {
    setShow(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false); // on Android, hide after selection
    setDate(currentDate);
  };

  return (
    <View className="flex flex-row items-center py-2">
      <TouchableOpacity className={`rounded-lg text-white text-base ${Platform.OS === "android" && "px-5 py-1 justify-center bg-[#474747] border border-[#f49b33]"}`} onPress={handleDateSelect}>
        <Text className="px-2 py-1 bg-[#474747] text-lg text-white">{date.toLocaleDateString("en-GB")}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
          maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
        />
      )}
    </View>
  );
};

export default RestaurantDatePicker;
