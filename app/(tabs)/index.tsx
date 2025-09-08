import * as Crypto from 'expo-crypto';
import { Link } from "expo-router";
import * as SQLite from "expo-sqlite";
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// hashing password function found at https://docs.expo.dev/versions/latest/sdk/crypto/ 
async function hashPassword(password: string): Promise<string> {
  const hashed = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  return hashed;
}

export default function SignUpScreen() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const db = SQLite.useSQLiteContext();

  // This function will run all the logic that stores the information in the database.
  const handleSubmit = async () => {
    try {
      if (!form.firstName || !form.lastName || !form.email || !form.password) {
        throw new Error('All fields are required');
      }
      // Test case to make sure email isn't already in use.
      const existingUser = await db.getFirstAsync('SELECT email FROM users WHERE email = ?;', [form.email]);
      if (existingUser) {
        setForm({
          firstName: '',
          lastName: '',
          email: '',
          password: ''
        });
        throw new Error('Email already in use. Please enter a different email.')
      }
      // hash password for safety
      const hashedPassword = await hashPassword(form.password);
      console.log(hashPassword);
      // Get information from form and store it in database.
      await db.runAsync(
        'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
        [form.firstName, form.lastName, form.email, hashedPassword]
      );

      Alert.alert('Success', 'User added successfully!');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      });
    } catch (error) {
      console.log(error)
      Alert.alert('' + error);
    }
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
              value={form.firstName}
              onChangeText={(text) => setForm({ ...form, firstName: text })}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={form.lastName}
              onChangeText={(text) => setForm({ ...form, lastName: text })}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Link href="/Login" asChild>
        <TouchableOpacity>
        <Text style={styles.footerText}>Already have an account?<Text style={styles.footerLink}> Log in</Text></Text>
        </TouchableOpacity>
      </Link>
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
