import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

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
          // await db.execAsync(`DROP TABLE IF EXISTS users;`); UNCOMMENT IF YOU MAKE A CHANGE TO DATABASE
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS users(
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              firstName TEXT NOT NULL,
              lastName TEXT NOT NULL,
              username TEXT NOT NULL UNIQUE,
              email TEXT NOT NULL UNIQUE,
              password TEXT NOT NULL,
              points INTEGER
            );
          `);
          await db.execAsync(`PRAGMA journal_mode = WAL;`);
        }}
        options={{ useNewConnection: false }}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SQLiteProvider>
    </ThemeProvider>
  );
}
