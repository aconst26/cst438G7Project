import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import * as SQLite from 'expo-sqlite';
import { useCallback, useEffect, useState } from "react";
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
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchCurrentUser = async () => {
        const username = await AsyncStorage.getItem("loggedInUser");
        setCurrentUsername(username);
      };
      fetchCurrentUser();
    }, [])
  );
  
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
  const [which, setWhich] = useState<null | 'category' | 'difficulty' | 'type'>(null);
  const [category, setCategory] = useState<any>(null);
  const [difficulty, setDifficulty] = useState<any>(null);
  const [type, setType] = useState<any>(null);


  // "Hard Coding A logout since it doesnt wannaa work????"
  const resetQuizState = () => {
    setSelectedAnswers({});
    setGraded(false);
    setTime(30);
    setQuestions([]);
    setQuizStarted(false);
    setCategory(null);
    setDifficulty(null);
    setType(null);
    setWhich(null);
  };

  useFocusEffect(
    useCallback(() => {
      const initialize = async () => {
        const username = await AsyncStorage.getItem("loggedInUser");
        setCurrentUsername(username);
        resetQuizState();
      };
      initialize();
    }, [])
  );

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

  // Fetch categories
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://opentdb.com/api_category.php");
        const json = await res.json();
        const cats = json?.trivia_categories ?? [];
        setCatOptions(cats.map(c => ({ key: c.id, label: c.name, payload: c })));
      } catch (e) {
        console.error("API error:", e);
      }
    })();
  }, []);

  // Fetch questions when quiz starts
  const startQuiz = async () => {
    if (!category || !difficulty || !type) return;

    let questionResult = await fetch(
      `https://opentdb.com/api.php?amount=4&category=${category.key}&difficulty=${difficulty.key}&type=${type.key}`
    );
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
  const score = Object.entries(selectedAnswers).filter(
    ([idx, ans]) => ans === questions[Number(idx)]?.correct_answer
  ).length;  

  // Update user points when graded
  useEffect(() => {
    if (graded) {
      (async () => {
        console.log(currentUsername);
        await db.runAsync(
          'UPDATE users SET points = points + ? WHERE username = ?;',
          [score, currentUsername]
      );
      })();
    }
  }, [graded]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Quiz Page</Text>

      {!quizStarted ? (
        <View style={styles.centerWrapper}>
          <Text style={styles.header}>Select Your Quiz</Text>
          {/* Here we can just define the different things we're selecting and reuse the same modal for all of them */}
          {/* The category?.label ?? part puts the selected category on it once we pick one */}
          {/* Category / Difficulty / Type */}
          <Pressable style={[styles.trigger, category && styles.selectedTrigger]} onPress={() => setWhich('category')}>
            <Text style={styles.triggerText}>{category?.label ?? "Select a Category"}</Text>
          </Pressable>

          <Pressable style={[styles.trigger, difficulty && styles.selectedTrigger]} onPress={() => setWhich('difficulty')}>
            <Text style={styles.triggerText}>{difficulty?.label ?? "Select Difficulty"}</Text>
          </Pressable>

          <Pressable style={[styles.trigger, type && styles.selectedTrigger]} onPress={() => setWhich('type')}>
            <Text style={styles.triggerText}>{type?.label ?? "Select Type"}</Text>
          </Pressable>

          {/* General modal with clickable options,  */}
          <Modal transparent visible={!!which} animationType="fade">
            <View style={styles.overlay}>
              <Pressable style={StyleSheet.absoluteFill} onPress={() => setWhich(null)} />
              <View style={styles.menu}>
                <ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
                  {(which === 'category' ? catOptions
                    : which === 'difficulty' ? diffOptions
                    : which === 'type' ? typeOptions
                    : []
                  ).map((option) => (
                    <Pressable
                      key={String(option.key)}
                      style={({ pressed }) => [
                        styles.option,
                        pressed && { backgroundColor: "#007AFF33" },
                        (which === 'category' && category?.key === option.key) ||
                        (which === 'difficulty' && difficulty?.key === option.key) ||
                        (which === 'type' && type?.key === option.key)
                          ? styles.optionSelected
                          : null,
                      ]}
                      onPress={() => {
                        if (which === 'category') setCategory(option);
                        else if (which === 'difficulty') setDifficulty(option);
                        else if (which === 'type') setType(option);
                        setWhich(null);
                      }}
                    >
                      <Text style={styles.optionText}>{option.label}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
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
  trigger: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#1D3D47",
    borderRadius: 24,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedTrigger: {
    backgroundColor: "#007AFF",
  },
  triggerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
  },
  menu: {
    backgroundColor: "#1D3D47",
    marginHorizontal: 40,
    borderRadius: 12,
    paddingVertical: 8,
    maxHeight: "50%",
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#007AFF66",
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  optionSelected: {
    backgroundColor: "#007AFF",
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
