import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from "react";
import {
  Button,
  Modal,
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

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://opentdb.com/api_category.php");
        const json = await res.json();
        const cats = json?.trivia_categories ?? [];
        setCatOptions(cats.map(c => ({ key: c.id, label: c.name, payload: c })));
        console.log(catOptions);
      } catch (e) {
        console.error("API error:", e);
      } finally {
      }
    })();
  }, []);

  const [catOptions, setCatOptions] = useState([]);
  const diffOptions = [
    { key: "easy", label: "Easy" },
    { key: "medium", label: "Medium" },
    { key: "hard", label: "Hard" },
  ];
  const typeOptions = [
    { key: "multiple", label: "Multiple Choice" },
    { key: "boolean", label: "True / False" },
  ];
  const [which, setWhich] = useState(null);
  const [category, setCategory] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [type, setType] = useState(null);

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
    let questionResult = await fetch("https://opentdb.com/api.php?amount=4" + "&category=" + category.key + "&difficulty=" + difficulty.key + "&type=" + type.key);
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
          <Text style={styles.header}>Select Stuff</Text>

{/* Here we can just define the different things we're selecting and reuse the same modal for all of them */}
{/* The category?.label ?? part puts the selected category on it once we pick one */}
<Pressable style={styles.trigger} onPress={() => setWhich('category')}>
  <Text>{category?.label ?? "Select a category"}</Text>
</Pressable>

<Pressable style={styles.trigger} onPress={() => setWhich('difficulty')}>
  <Text>{difficulty?.label ?? "Select a difficulty"}</Text>
</Pressable>

<Pressable style={styles.trigger} onPress={() => setWhich('type')}>
  <Text>{type?.label ?? "Select a type"}</Text>
</Pressable>

{/* General modal with clickable options,  */}
          <Modal transparent visible={!!which} animationType="fade">
            <View style={styles.overlay}>
              <Pressable style={StyleSheet.absoluteFill} onPress={() => setWhich(null)} />
              <View style={styles.menu}>
                {(which === 'category' ? catOptions
                  : which === 'difficulty' ? diffOptions
                  : which === 'type' ? typeOptions
                  : []
                ).map((option) => (
                  <Pressable
                    key={String(option.key)}
                    style={styles.option}
                    onPress={() => {
                      if (which === 'category') setCategory(option);
                      else if (which === 'difficulty') setDifficulty(option);
                      else if (which === 'type') setType(option);
                      setWhich(null);
                    }}
                  >
                    <Text numberOfLines={2}>{option.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Modal>
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
  trigger: { padding: 12, backgroundColor: "#eee", borderRadius: 8 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.2)" },
  dropdown: { flex: 1, justifyContent: "center", paddingHorizontal: 16 },
  menu: { backgroundColor: "white", borderRadius: 8, overflow: "hidden" },
  option: { padding: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#ddd" },
});
