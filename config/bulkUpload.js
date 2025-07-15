import { collection, doc, setDoc } from "firebase/firestore";
import slugify from "slugify";
import { carouselImages, restaurants, slots } from "../store/restaurants";
import { db } from "./firebaseConfig";

const restaurantsData = restaurants;
const uploadRestaurantData = async () => {
  try {
    for (let i = 0; i < restaurantsData.length; i++) {
      const restaurant = restaurantsData[i];
      const docRef = doc(collection(db, "restaurants"), `restaurant_${i + 1}`);

      const restaurantSlug = slugify(restaurant.name, {
        replacement: "-", // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: false, // strip special characters except replacement, defaults to `false`
        trim: true, // trim leading and trailing replacement chars, defaults to `true`
      });

      const restaurantItem = {
        ...restaurant,
        slug: restaurantSlug,
      };
      await setDoc(docRef, restaurantItem);

      console.log(`Data uploaded: id -> restaurant_${i + 1}`);
    }
  } catch (error) {
    console.log(error);
  }
};

const carouselData = carouselImages;
const uploadCarouselData = async () => {
  try {
    for (let i = 0; i < carouselData.length; i++) {
      const carousel = carouselData[i];

      // Extract restaurant ID from ref_id string
      const restaurantId = carousel.res_id.split("/").pop(); // e.g., "restaurant_1"

      // Create Firestore reference
      const restaurantRef = doc(db, "restaurants", restaurantId);

      // Create final carousel object with actual reference
      const carouselItem = {
        ...carousel,
        res_id: restaurantRef,
      };

      // Upload to Firestore
      const docRef = doc(collection(db, "carousel"), `carousel_${i + 1}`);
      await setDoc(docRef, carouselItem);

      console.log(`Carousel uploaded: id -> carousel_${i + 1}`);
    }
  } catch (error) {
    console.log("Error uploading carousel data:", error);
  }
};

const slotsData = slots;
const uploadSlotData = async () => {
  try {
    for (let i = 0; i < slotsData.length; i++) {
      const slotEntry = slotsData[i];

      // Extract restaurant ID from the ref_id string
      const restaurantId = slotEntry.ref_id.split("/").pop(); // e.g., "restaurant_1"

      // Create actual reference to the restaurant document
      const restaurantRef = doc(db, "restaurants", restaurantId);

      // Construct the final slot object with ref_id as a DocumentReference
      const slotData = {
        slot: slotEntry.slot,
        ref_id: restaurantRef,
      };

      // Upload to Firestore (you can store in "slots" collection or "restaurantSlots" or any name)
      const docRef = doc(collection(db, "slots"), `slot_${restaurantId}`);
      await setDoc(docRef, slotData);

      console.log(`Slot uploaded for: ${restaurantId}`);
    }
  } catch (error) {
    console.log("Error uploading slots:", error);
  }
};

export { uploadCarouselData, uploadRestaurantData, uploadSlotData };

