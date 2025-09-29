import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Crypto from 'expo-crypto';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

async function hashPassword(password: string): Promise<string> {
  const hashed = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  return hashed;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null; // Prevent render until font is loaded
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      {/* Create Database for users */}
      <SQLiteProvider
        databaseName="userDatabase.db"
        onInit={async (db) => {
          // await db.execAsync(`DROP TABLE IF EXISTS users;`); THIS LINE FOR TESTING PURPOSES
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS users(
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              firstName TEXT NOT NULL,
              lastName TEXT NOT NULL,
              username TEXT NOT NULL UNIQUE,
              email TEXT NOT NULL UNIQUE,
              password TEXT NOT NULL,
              points INTEGER,
              isAdmin INTEGER
            );
          `);
          const users = [
            {
              firstName: "Admin",
              lastName: "User",
              username: "admin",
              email: "admin@example.com",
              password: "admin", 
              points: 0,
              isAdmin: 1
            },
            {
              firstName: "Test",
              lastName: "User",
              username: "test",
              email: "tester@example.com",
              password: "test", 
              points: 0,
              isAdmin: 1
            },
            {
              firstName: "John",
              lastName: "Doe",
              username: "johndoe",
              email: "john@example.com",
              password: "password123",
              points: 43,
              isAdmin: 0
            },
            {
              firstName: "Jane",
              lastName: "Doe",
              username: "janedoe",
              email: "jane@example.com",
              password: "mypassword",
              points: 11,
              isAdmin: 0
            },
            {
              firstName: "Ant",
              lastName: "Const",
              username: "aconst",
              email: "aconst@example.com",
              password: "password",
              points: 8,
              isAdmin: 0
            }
          ];
          // UNCOMMENT TO PREPOPULATE COMMENT AFTER PREPOPULATING
          // for (const u of users) {
          //   const hashedPassword = await hashPassword(u.password); // I know i will run into errors logging in without this
          //   await db.runAsync(
          //     `INSERT INTO users (firstName, lastName, username, email, password, points, isAdmin) 
          //      VALUES (?, ?, ?, ?, ?, ?, ?)`,
          //     [u.firstName, u.lastName, u.username, u.email, hashedPassword, u.points, u.isAdmin]
          //   );
          // }      
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS dailyQuestions(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            incorrect1 TEXT NOT NULL,
            incorrect2 TEXT NOT NULL,
            incorrect3 TEXT NOT NULL
            );`)
          await db.execAsync(`PRAGMA journal_mode = WAL;`);
        }}
        options={{ useNewConnection: false }}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(admin)" options={{ headerShown: false, presentation: "modal" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SQLiteProvider>
    </ThemeProvider>
  );
}
