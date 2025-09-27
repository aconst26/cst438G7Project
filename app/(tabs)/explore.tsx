import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from "react";
import {
  Button,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Simple decoder for OpenTDB entities 
function decodeHTMLEntities(str: string) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function shuffleArray(array: string[]) {
  return array
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
}


export default function QuizScreen() {
  const db = SQLite.useSQLiteContext(); 

  async function retrieveUserPoints(): Promise<number> {
    type UserRow = { points: number };
    const row = await db.getFirstAsync<UserRow>(
      'SELECT points FROM users WHERE loggedIn = ?;',
      [1]
    );
    return row?.points ?? 0;
  }

  async function updateUserPoints(points: number) {
    await db.runAsync('UPDATE users SET points = ? WHERE loggedIn = ?', [points, 1]);
  }

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [graded, setGraded] = useState(false);
  const [time, setTime] = useState(30);
  const [questions, setQuestions] = useState<
    Array<{ question: string; correct_answer: string; incorrect_answers: string[]; all_answers: string[] }>
  >([]);
  const [quizStarted, setQuizStarted] = useState(false);

  const onClick = (index: number, ans: string) => {
    setSelectedAnswers({ ...selectedAnswers, [index]: ans });
  };

  // Timer
  useEffect(() => {
    if (!quizStarted || graded) return;
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          setGraded(true);
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, graded]);

  // Fetch questions when quiz starts
  const startQuiz = async () => {
    let questionResult = await fetch("https://opentdb.com/api.php?amount=4");
    let items = await questionResult.json();

    let processed = items.results.map((q: any) => ({
      ...q,
      all_answers: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
    }));
    setQuestions(processed);
    setSelectedAnswers({});
    setGraded(false);
    setTime(30);
    setQuizStarted(true);
  };

  // Score
  const score = Object.keys(selectedAnswers).reduce((acc, idx) => {
    const i = parseInt(idx);
    if (selectedAnswers[i] === questions[i]?.correct_answer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  useEffect(() => {
    if (graded) {
      (async () => {
        const currentPoints = await retrieveUserPoints();
        await updateUserPoints(currentPoints + score);
      })();
    }
  }, [graded]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Quiz App</Text>

      {!quizStarted ? (
        <View style={styles.centerWrapper}>
          <Button title="Take Test" onPress={startQuiz} />
        </View>
      ) : (
        <>
          <Text style={styles.timer}>⏳ {time}s</Text>

          {!questions || questions.length === 0 ? (
            <Text style={styles.loading}>Loading...</Text>
          ) : (
            <ScrollView>
              {questions.map((q, index) => (
                <View style={styles.card} key={index}>
                  <Text style={styles.question}>
                    {decodeHTMLEntities(q.question)}
                  </Text>

                  {q.all_answers.map((ans: string, ansIndex: number) => {
                    const isSelected = selectedAnswers[index] === ans;
                    const isCorrect = graded && ans === q.correct_answer;
                    const isWrong =
                      graded && isSelected && ans !== q.correct_answer;

                    return (
                      <Pressable
                        key={ansIndex}
                        onPress={() => !graded && onClick(index, ans)}
                        style={[
                          styles.answerBtn,
                          isSelected && !graded ? styles.selected : null,
                          isCorrect ? styles.correct : null,
                          isWrong ? styles.incorrect : null,
                        ]}
                      >
                        <Text style={styles.answerText}>
                          {decodeHTMLEntities(ans)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </ScrollView>
          )}

          {!graded ? (
            <Button title="Grade Quiz" onPress={() => setGraded(true)} />
          ) : (
            <View style={styles.resultContainer}>
              <Text style={styles.score}>
                Your Score: {score}/{questions.length}
              </Text>
              <Button title="Play Again" onPress={() => setQuizStarted(false)} />
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E2028",
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  timer: {
    fontSize: 18,
    color: "#ffdd57",
    textAlign: "center",
    marginBottom: 20,
  },
  loading: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#1D3D47",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  answerBtn: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#2C4C55",
    marginBottom: 10,
  },
  answerText: {
    color: "#fff",
    fontSize: 16,
  },
  selected: {
    backgroundColor: "#007AFF",
  },
  correct: {
    backgroundColor: "#28a745",
  },
  incorrect: {
    backgroundColor: "#dc3545",
  },
  resultContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  score: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
