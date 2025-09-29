import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await AsyncStorage.clear();
        router.replace("/"); 
      } catch (err) {
        console.error("Error logging out:", err);
        Alert.alert("Logout Error", "Something went wrong while logging out.");
      }
    };
    logoutUser();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E2028",
    justifyContent: "center",
    alignItems: "center",
  },
});
