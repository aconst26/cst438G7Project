import AsyncStorage from "@react-native-async-storage/async-storage";
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

  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          // Load leaderboard
          const results = await db.getAllAsync<User>(
            "SELECT id, username, points FROM users ORDER BY points DESC;"
          );
          setUsers(results);
          const loggedIn = await AsyncStorage.getItem("loggedInUser");
          if (loggedIn) setCurrentUser(loggedIn);
        } catch (err) {
          console.log("Error loading leaderboard:", err);
        }
      };

      loadData();
    }, [db])
  );


  const renderItem = ({ item, index }: { item: User; index: number }) => {
    const isTop3 = index < 3;
    let top3Style = {};
    let rankColor = "#333";
  
    if (index === 0) { 
      top3Style = styles.gold;
      rankColor = "#FFD700";
    } else if (index === 1) { 
      top3Style = styles.silver;
      rankColor = "#C0C0C0";
    } else if (index === 2) {
      top3Style = styles.bronze;
      rankColor = "#CD7F32";
    }
  
    const isCurrentUser = item.username === currentUser;
  
    return (
      <View style={[styles.row, top3Style]}>
        <Text style={[styles.rank, { color: rankColor }]}>{index + 1}</Text>
        <Text
          style={[
            styles.username,
            isCurrentUser && styles.currentUsername,
          ]}
        >
          {item.username}
        </Text>
        <Text style={styles.points}>{item.points} pts</Text>
      </View>
    );
  };
  

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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  rank: {
    fontSize: 18,
    fontWeight: "700",
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
  // Top 3 styles
  gold: {
    backgroundColor: "#FFF8DC",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  silver: {
    backgroundColor: "#F0F0F0",
    borderWidth: 2,
    borderColor: "#C0C0C0",
  },
  bronze: {
    backgroundColor: "#F5E6DA",
    borderWidth: 2,
    borderColor: "#CD7F32",
  },
  currentUsername: {
    color: "#007AFF",  
    fontWeight: "700",
    textDecorationLine: "underline",
  },  
});
