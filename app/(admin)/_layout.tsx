import { Stack, router } from "expo-router";
import { Pressable, Text } from "react-native";

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="dashboard"
        options={{
          title: "Admin",
          // Add a close "X" button in the header
          headerRight: () => (
            <Pressable onPress={() => router.back()} style={{ paddingRight: 12 }}>
              <Text style={{ fontSize: 18 }}>✕</Text>
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
