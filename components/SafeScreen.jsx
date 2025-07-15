import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SafeScreen = ({ children }) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top + 10,
        paddingBottom: insets.bottom,
        flex: 1,
        backgroundColor: "#2b2b2b",
      }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;
