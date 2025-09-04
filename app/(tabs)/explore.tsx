import { useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function QuizScreen() {

  // I don't know enough about react this feels like straight magic
  // Might be better to define a struct or something to store these questions,
  // but for now we're doing it inline baby (woo)
  const [questions, setQuestions] = useState<Array<{ question: string; correct_answer: string; incorrect_answers: string[] }>
  >([]);

  useEffect(() => {
    const fetchQuestion = async () => {
      let questionResult = await fetch("https://opentdb.com/api.php?amount=3");
      let items = await questionResult.json();
      console.log("API response:", items);
      setQuestions(items.results);
    };

    fetchQuestion();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Quiz</Text>
      {/* Handles if we're rate limited mainly */}
      {!questions || questions.length === 0 ? (
        <Text>Loading...</Text>
      ) : (
        // Puts all the questions down with the answer choices on buttons
        questions.map((q) => (
        <View>
          <Text style={styles.subHeader}>{q.question}</Text>
          {[q.correct_answer, ...q.incorrect_answers].map(ans => (
            <Button
              title={ans}
              onPress={() => {
                // TODO: select answer, highlight, may want to put them on pressable text instead???
              }}
            />
          ))}
        </View>
        )))
      }
      <Button title="Grade Quiz"
        onPress={() => {
          // TODO: highlight correct and incorrect answers, give score?
        }}
      />
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
