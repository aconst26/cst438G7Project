import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from "expo-sqlite";
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AdminScreen() {
  const [form, setForm] = useState({
    question: '',
    answer: '',
    incorrect1: '',
    incorrect2: '',
    incorrect3: '',
  });

  const db = SQLite.useSQLiteContext();

  // This function will run all the logic that stores the information in the database.
  const handleSubmit = async () => {
    try {
      if (!form.question || !form.answer || !form.incorrect1 || !form.incorrect2 || !form.incorrect3) {
        throw new Error('Please complete question input');
      }
      // Get information from form and store it in database.
      await db.runAsync(
        'INSERT INTO dailyQuestions (question, answer, incorrect1, incorrect2, incorrect3) VALUES (?, ?, ?, ?, ?)',
        [form.question, form.answer, form.incorrect1, form.incorrect2, form.incorrect3] // got it ???
      );
      await AsyncStorage.setItem('newDailyQuestion', 'true');

      Alert.alert('Success', 'Question added successfully!');
      setForm({
        question: '',
        answer: '',
        incorrect1: '',
        incorrect2: '',
        incorrect3: '',
      });
    } catch (error) {
      console.log(error)
      Alert.alert('' + error);
    }
  };

  const handleRandom = async () => {
    try {
      // Delete all questions in the table
      await db.runAsync('DELETE FROM dailyQuestions;');
      await db.runAsync('DELETE FROM sqlite_sequence WHERE name="dailyQuestions";');
  
      setForm({
        question: '',
        answer: '',
        incorrect1: '',
        incorrect2: '',
        incorrect3: '',
      });
  
      Alert.alert('Success', 'All questions cleared!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error clearing questions: ' + error);
    }
  };  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Hello Admin</Text>
      <Text style={styles.subHeader}>Set Daily Question</Text>

      <View style={styles.centerWrapper}>
        <View style={styles.formCard}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Question</Text>
            <TextInput
              testID="input-question"
              style={styles.input}
              value={form.question}
              onChangeText={(text) => setForm({ ...form, question: text })}
            />
          </View>

          <View style ={styles.inputWrapper}>
            <Text style={styles.label}>Right Answer</Text>
            <TextInput
              testID="input-answer"
              style={styles.input}
              value={form.answer}
              onChangeText={(text) => setForm({ ...form, answer: text })}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Incorrect Choice 1</Text>
            <TextInput
              testID="input-incorrect1"
              style={styles.input}
              value={form.incorrect1}
              onChangeText={(text) => setForm({ ...form, incorrect1: text })}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Incorrect Choice 2</Text>
            <TextInput
              testID="input-incorrect2"
              style={styles.input}
              value={form.incorrect2}
              onChangeText={(text) => setForm({ ...form, incorrect2: text })}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Incorrect Choice 3</Text>
            <TextInput
              testID="input-incorrect3"
              style={styles.input}
              value={form.incorrect3}
              onChangeText={(text) => setForm({ ...form, incorrect3: text })}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleRandom}>
            <Text style={styles.buttonText}>Random</Text>
          </TouchableOpacity>
        </View>
      </View>
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
