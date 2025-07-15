import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection } from "firebase/firestore";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../config/firebaseConfig";
import { useUserContext } from "../contexts/UserContext";
import { guestValidationSchema } from "../utils/guestSchema";

const RestaurantSlots = ({
  slots,
  selectedSlot,
  setSelectedSlot,
  date,
  selectedGuests,
  restaurant,
}) => {
  const [slotsVisible, setslotsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const {fetchUserData, userRef, userEmail} = useUserContext();

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSlotSelect = (slot) => {
    let prevSlot = selectedSlot;
    if (prevSlot === slot) setSelectedSlot(null);
    else setSelectedSlot(slot);
  };

  const handleBooking = async () => {
    const isGuest = await AsyncStorage.getItem("isGuest");
    if (userEmail) {
      try {
        await addDoc(collection(db, "bookings"), {
          email: userEmail,
          user_ref: userRef,
          slot: selectedSlot,
          date: date.toISOString(),
          guests: selectedGuests,
          restaurant,
        });

        Alert.alert("Success", "Your Booking was successfull!", [
          { text: "OK" },
        ]);
      } catch (error) {
        console.log(error);
        Alert.alert(
          "Booking Failed",
          "Your Booking was unsuccessfull. Please try again later."
        );
      }
    } else if (isGuest) {
      setModalVisible(true);
    }
  };

  const handleGuestBooking = async (values, { resetForm }) => {
    try {
      await addDoc(collection(db, "bookings"), {
        ...values,
        slot: selectedSlot,
        date: date.toISOString(),
        guests: selectedGuests,
        restaurant,
      });

      resetForm();
      setModalVisible(false);
      Alert.alert("Success", "Your Booking was successfull!", [{ text: "OK" }]);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Booking Failed",
        "Your Booking was unsuccessfull. Please try again later."
      );
    }
  };

  useEffect(() => {
    fetchUserData()
  }, []);

  return (
    <View className="flex-1">
      <View className={`flex mx-3 p-2 ${selectedSlot !== null && "flex-row items-center justify-around"}`}>
        {/* FIND SLOT */}
        <View className={`${selectedSlot == null && "flex-1"}`}>
          <TouchableOpacity onPress={() => setslotsVisible((prev) => !prev)}>
            <Text
              className={`text-center text-md font-semibold bg-[#f49b33] p-1 m-1 rounded-lg ${selectedSlot !== null && "w-44"}`}
            >
              Find Slots
            </Text>
          </TouchableOpacity>
        </View>

        {/* Show BOOK SLOT if 'FIND SLOT' is clicked */}
        {/* BOOK SLOT */}
        {selectedSlot !== null && (
          <View className="flex">
            <TouchableOpacity onPress={handleBooking}>
              <Text className="text-center text-md text-white font-semibold bg-[#f49b33] p-1 m-1 rounded-lg w-44">
                Book Slot
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* DISPLAY SLOTS */}
      {slotsVisible && (
        <View className="flex-wrap flex-row mx-3 p-2 bg-[#474747] rounded-lg justify-center">
          {slots?.map((slot, index) => (
            <TouchableOpacity
              onPress={() => handleSlotSelect(slot)}
              disabled={
                selectedSlot === slot || selectedSlot === null ? false : true
              }
              className={`m-2 p-1.5 bg-[#f49b33] rounded-lg items-center justify-center ${selectedSlot && selectedSlot !== slot && "opacity-50"}`}
              key={index}
            >
              <Text className="text-white text-md font-bold">{slot} HRS</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* GUEST BOOKING MODAL */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        className="flex-1 justify-end m-0 rounded-t-[20]"
      >
        <View className="flex-1 bg-[#00000080] justify-end">
          <View className="bg-[#474747] mx-4 rounded-t-lg p-4 pb-6">
            <Formik
              initialValues={{ name: "", phoneNumber: "" }}
              validationSchema={guestValidationSchema}
              onSubmit={handleGuestBooking}
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
                  <View className="flex flex-row justify-between items-end mb-5">
                    <Text className="text-xl font-bold text-[#f49b33] ml-3 italic">
                      GUEST BOOKING FORM
                    </Text>
                    <Ionicons
                      name="close-circle-sharp"
                      size={36}
                      color="#C75443"
                      onPress={handleCloseModal}
                    />
                  </View>
                  <TextInput
                    className="my-2.5 h-12 border border-white text-white text-md rounded-lg px-3"
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    placeholder="Full Name"
                    placeholderTextColor="#A5BFCC"
                  />
                  {touched.name && errors.name && (
                    <Text className="text-red-500 text-xs mb-2">
                      {errors.name}
                    </Text>
                  )}

                  <TextInput
                    className="my-2.5 h-12 border border-white text-white text-md rounded-lg px-3"
                    onChangeText={handleChange("phoneNumber")}
                    onBlur={handleBlur("phoneNumber")}
                    value={values.phoneNumber}
                    placeholder="Phone Number"
                    placeholderTextColor="#A5BFCC"
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <Text className="text-red-500 text-xs mb-2">
                      {errors.phoneNumber}
                    </Text>
                  )}

                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="p-3 my-10 bg-[#f49b33] text-black rounded-lg"
                  >
                    <Text className="text-xl ont-semibold text-center">
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RestaurantSlots;
