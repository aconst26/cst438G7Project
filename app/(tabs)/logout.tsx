import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";


export default function Logout() {
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await AsyncStorage.removeItem("loggedInUser");
        router.replace("/");
      })();
    }, [router])
  );

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
