import { Stack } from "expo-router";
import SafeScreen from "../components/SafeScreen";
import { UserProvider } from "../contexts/UserContext";
import "../global.css";

export default function RootLayout() {
  return (
    <UserProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeScreen>
    </UserProvider>
  );
}
