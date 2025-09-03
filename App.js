import { SQLiteProvider } from "expo-sqlite";

export default function App() {
    return (
        <SQLiteProvider
            databaseName = "userDatabase.db"
            onInit={async (db) => {
                await db.execAsync(`
                    CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    firstName TEXT NOT NULL,
                    lastName TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL
                    );
                    PRAGMA journal_mode=WAL;`);
            }}
            options={{useNewConnection: false}}
        >
        </SQLiteProvider>
    );
}