import { useFocusEffect } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";
import { useCallback, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

type User = { //Defines what user record will look like
  id: number;
  username: string;
  points: number;
};

export default function Leaderboards() {
  const [users, setUsers] = useState<User[]>([]);
  const db = SQLite.useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const results = await db.getAllAsync<User>(
            "SELECT id, username, points FROM users ORDER BY points DESC;"
          );
          setUsers(results);
        } catch (err) {
          console.log("Error loading leaderboard:", err);
        }
      };
  
      loadData();
    }, [db])
  );

  const renderItem = ({ item, index }: { item: User; index: number }) => (
    <View style={styles.row}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.points}>{item.points} pts</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🏆 Leaderboards</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E2028",
    padding: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  rank: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    width: 40,
    textAlign: "center",
  },
  username: {
    fontSize: 18,
    flex: 1,
    color: "#333",
  },
  points: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D3D47",
  },
});
