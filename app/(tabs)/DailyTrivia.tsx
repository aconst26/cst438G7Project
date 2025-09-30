import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import * as SQLite from 'expo-sqlite';
import { decode } from 'html-entities';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function DailyTrivia() {
  const db = SQLite.useSQLiteContext();
  const [questionData, setQuestionData] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch current user
  useFocusEffect(
    useCallback(() => {
      const fetchCurrentUser = async () => {
        const username = await AsyncStorage.getItem("loggedInUser");
        setCurrentUsername(username);
        if (username) {
            const user: any = await db.getFirstAsync(
              `SELECT isAdmin FROM users WHERE username = ?`,
              [username]
            );
            setIsAdmin(user?.isAdmin === 1);
          }
      };
      fetchCurrentUser();
    }, [])
  );

  // Timer until next question
  const calculateTimeLeft = async () => {
    const now = new Date();
    let target = await AsyncStorage.getItem('nextQuestionTime');

    if (!target) {
      const nextDay = new Date();
      nextDay.setHours(24, 0, 0, 0);
      target = nextDay.getTime().toString();
      await AsyncStorage.setItem('nextQuestionTime', target);
    }

    const diff = parseInt(target) - now.getTime();

    if (diff <= 0) {
      await fetchDailyQuestion();
      const nextDay = new Date();
      nextDay.setHours(24, 0, 0, 0);
      await AsyncStorage.setItem('nextQuestionTime', nextDay.getTime().toString());
    } else {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }
  };

  useEffect(() => {
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get latest question from DB
  const getQuestionFromDB = async () => {
    try {
      const result: any = await db.getFirstAsync(
        `SELECT question, answer, incorrect1, incorrect2, incorrect3 FROM dailyQuestions ORDER BY id DESC LIMIT 1;`
      );
  
      if (!result) return null;
  
      const answers = shuffleArray([
        result.answer,
        result.incorrect1,
        result.incorrect2,
        result.incorrect3
      ].filter(Boolean));
  
      return {
        question: result.question,
        correct_answer: result.answer,
        incorrect_answers: [result.incorrect1, result.incorrect2, result.incorrect3],
        answers, // already shuffled supposedly
        difficulty: "medium"
      };
    } catch (error) {
      console.error("Error loading question from DB:", error);
      return null;
    }
  };

  const shuffleArray = (array: string[]) => {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };
  
  // Fetch question from API and save to DB
  const fetchDailyQuestion = async () => {
    const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
    const data = await response.json();
    if (!data.results || data.results.length === 0) throw new Error("No questions available");
  
    const dailyQuestion = data.results[0];
    const questionText = decode(dailyQuestion.question);
    const correctAnswer = decode(dailyQuestion.correct_answer);
    const incorrectAnswers = dailyQuestion.incorrect_answers.map(ans => decode(ans));
  
    await db.runAsync(
      `INSERT INTO dailyQuestions (question, answer, incorrect1, incorrect2, incorrect3)
       VALUES (?, ?, ?, ?, ?)`,
      [questionText, correctAnswer, incorrectAnswers[0], incorrectAnswers[1], incorrectAnswers[2]]
    );
  
    return {
      question: questionText,
      correct_answer: correctAnswer,
      incorrect_answers: incorrectAnswers,
      answers: shuffleArray([correctAnswer, ...incorrectAnswers]),
      difficulty: "medium",
    };
  };
  

  // Handle answer selection
  const handleAnswer = async (answer: string) => {
    if (hasAnswered) {
      Alert.alert("You have already answered today's question.");
      return;
    }
    if (!questionData || !currentUsername) {
      Alert.alert("Error", "Question data or user information is missing.");
      return;
    }

    setSelectedAnswer(answer);
    setHasAnswered(true);
    await AsyncStorage.setItem(`answered_${currentUsername}`, answer);

    const isCorrect = answer === questionData.correct_answer;
    const pointsMap = { easy: 2, medium: 4, hard: 6 };
    const pointsEarned = isCorrect ? pointsMap[questionData.difficulty || "medium"] : 0;

    if (isCorrect) {
      setFeedback(`Congrats! You earned ${pointsEarned} points.`);
      try {
        await db.runAsync(
          `UPDATE users SET points = points + ? WHERE username = ?;`,
          [pointsEarned, currentUsername]
        );
      } catch (error) {
        console.error("Error updating points:", error);
      }
    } else {
      setFeedback(`Maybe next time. The correct answer was: ${questionData.correct_answer}`);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const checkNewQuestion = async () => {
        const newQuestionFlag = await AsyncStorage.getItem('newDailyQuestion');
        let latestQuestion = await getQuestionFromDB();
  
        if (!latestQuestion) {
          latestQuestion = await fetchDailyQuestion();
        } else if (newQuestionFlag) {
          latestQuestion = await getQuestionFromDB();
          await AsyncStorage.removeItem('newDailyQuestion');
        }
  
        if (latestQuestion) setQuestionData(latestQuestion);
  
        // Check if the user has already answered
        if (currentUsername) {
          const answered = await AsyncStorage.getItem(`answered_${currentUsername}`);
          if (answered) {
            setHasAnswered(true);
            setSelectedAnswer(answered);
            setFeedback(
              answered === latestQuestion.correct_answer // Highly doubt it will be null
                ? `Congrats! You earned points.`
                : `Maybe next time. The correct answer was: ${latestQuestion.correct_answer}`
            );
          } else {
            setHasAnswered(false);
            setSelectedAnswer('');
            setFeedback('');
          }
        }
      };
  
      checkNewQuestion();
    }, [currentUsername])
  );
  
  
  if (!questionData) return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Loading Daily Trivia...</Text>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {isAdmin && (
        <TouchableOpacity style={styles.button} onPress={() => router.push("/dashboard")}>
            <Text style={styles.buttonText}>Admin Page</Text>
        </TouchableOpacity>
        )}
      <Text style={styles.title}>Question of the Day</Text>
      <Text style={styles.timer}>Next question in: {timeLeft}</Text>
      <Text style={styles.question}>{questionData.question}</Text>
      {questionData.answers.map((ans, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.answerButton,
            selectedAnswer && questionData?.correct_answer === ans && styles.correct,
            selectedAnswer === ans && questionData?.correct_answer !== ans && styles.incorrect,
          ]}
          onPress={() => handleAnswer(ans)}
          disabled={hasAnswered}
        >
          <Text style={styles.answerText}>{ans}</Text>
        </TouchableOpacity>
      ))}
      {hasAnswered && <Text style={styles.feedback}>{feedback}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: 
  { flex: 1, 
    backgroundColor: '#0E2028', 
    padding: 24, 
    justifyContent: 'center' 
},
  title: 
  { fontSize: 28, 
    fontWeight: '700', 
    color: '#fff', 
    textAlign: 'center', 
    marginBottom: 10 
},
  timer: 
  { fontSize: 16, 
    color: '#bbb', 
    textAlign: 'center', 
    marginBottom: 20 
},
  question: 
  { fontSize: 18, 
    color: '#fff', 
    marginBottom: 20, 
    textAlign: 'center'
},
  answerButton: 
  { backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 10, 
    marginVertical: 6 
},
  selected: 
  { backgroundColor: '#4DB6AC' },
  answerText: 
  { fontSize: 16, 
    textAlign: 'center' },
  feedback: 
  { fontSize: 18, 
    color: '#fff', 
    textAlign: 'center', 
    marginTop: 20 
},
  button: {
    backgroundColor: '#1D9BF0',         
    paddingVertical: 14,                
    borderRadius: 12,                   
    alignItems: 'center',               
    justifyContent: 'center',            
    marginTop: 12,
    shadowColor: '#000',                
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,                       
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',          
    letterSpacing: 1,                   
  },
  correct: {
    backgroundColor: "#28a745",
  },
  incorrect: {
    backgroundColor: "#dc3545",
  },
});
