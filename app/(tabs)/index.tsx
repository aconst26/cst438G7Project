import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

    // const db = await SQLite.openDatabaseAsync('usersDatabase');

    // await db.execAsync(`
    //   PRAGMA journal_mode = WAL;
    //   CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL);`);


export default function SignUpScreen() {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSignUp = async () => {
    console.log('Sign Up:', { fname, lname, email, password });

    //const result = await db.runAsync('INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)', fname, lname, email, password);
    //console.log(result.lastInsertRowId, result.changes);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Join Us On Trivia</Text>
      <Text style={styles.subHeader}>Create your account</Text>

      <View style={styles.centerWrapper}>
        <View style={styles.formCard}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={fname}
              onChangeText={setFname}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lname}
              onChangeText={setLname}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* TO DO ADD ROUTER TO ANOTHER PAGE */}
      <Text style={styles.footerText}>
        Already have an account? <Text style={styles.footerLink}>Log in</Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E2028', 
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    fontSize: 34,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 28,
  },
  centerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 360, 
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#1D3D47',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  footerText: {
    textAlign: 'center',
    color: '#ccc',
    marginTop: 20,
    fontSize: 14,
  },
  footerLink: {
    color: '#4DB6AC',
    fontWeight: '600',
  },
});
