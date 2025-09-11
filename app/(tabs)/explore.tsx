import { useEffect, useState } from 'react';
import { Button, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function QuizScreen() {
  // This is awesome this just automatically slaps these together and gives us a default value
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [graded, setGraded] = useState(false);
  const [time, setTime] = useState(10);

  const onClick = (index, ans) => {
    // Updates selected answers
    setSelectedAnswers({ ...selectedAnswers, [index]: ans });
  };

  // I don't know enough about react this feels like straight magic
  // Might be better to define a struct or something to store these questions,
  // but for now we're doing it inline baby (woo)
  const [questions, setQuestions] = useState<Array<{ question: string; correct_answer: string; incorrect_answers: string[] }>
  >([]);

  // Straight googled how to do a timer I had no clue, this is the cleanest I could find
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 0) {
          setGraded(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, []);

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
      <Text style={styles.subHeader}>{time}</Text>
      {/* Handles if we're rate limited mainly */}
      {!questions || questions.length === 0 ? (
        <Text>Loading...</Text>
      ) : (
        // Puts all the questions down with the answer choices on pressable text
        questions.map((q, index) => (
          <View key={index}>
          <Text style={styles.subHeader}>{q.question}</Text>
          {[q.correct_answer, ...q.incorrect_answers].map((ans, ansIndex) => (
            <Pressable
              key={ansIndex}
              onPress={() => !graded && onClick(index, ans)}
              // I was originally going to put all the logic in my functions, but chat told
              // me that was stupid (and helpfully gave me bad code for me to fix)
              style={[
                // Give blue highlight when you click an answer
                !graded && selectedAnswers[index] === ans ? styles.selected : {},
                // Green highlight on correct answer (even if you didn't select it, so you know what the right ans is)
                graded && ans === q.correct_answer ? styles.correct : {},
                // Highlight your answer red if you got it wrong
                graded && selectedAnswers[index] === ans && ans !== q.correct_answer ? styles.incorrect : {},
              ]}
            >
              <Text>{ans}</Text>
            </Pressable>
          ))}
        </View>
        )))
      }
      <Button title="Grade Quiz"
        onPress={() => {
          setGraded(true);
          console.log(selectedAnswers);
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
  selected: {
    backgroundColor: '#007AFF',
  },
  correct: {
    backgroundColor: '#28a745',
  },
  incorrect: {
    backgroundColor: '#dc3545',
  },
});
