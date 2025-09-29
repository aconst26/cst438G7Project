import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
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

    // Fetch current user
    useFocusEffect(
        useCallback(() => {
            const fetchCurrentUser = async () => {
                const username = await AsyncStorage.getItem("loggedInUser");
                setCurrentUsername(username);
            };
            fetchCurrentUser();
        }, [])
    );

    // Calculate remaining time until midnight
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

    const fetchDailyQuestion = async (retryCount = 0) => {
        try {
            const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
            const data = await response.json();
            if (!data.results || data.results.length === 0) throw new Error("No questions available");

            const dailyQuestion = data.results[0];
            const answers = [...dailyQuestion.incorrect_answers, dailyQuestion.correct_answer];

            const questionObject = {
                question: decode(dailyQuestion.question),
                correct_answer: decode(dailyQuestion.correct_answer),
                incorrect_answers: dailyQuestion.incorrect_answers.map(ans => decode(ans)),
                answers: answers.map(ans => decode(ans)),
                difficulty: dailyQuestion.difficulty
            };
            
            const today = new Date().toISOString().split('T')[0];
            await AsyncStorage.setItem('dailyQuestion', JSON.stringify({ question: questionObject, date: today }));

            // Reset user's answer for today
            if (currentUsername) {
                await AsyncStorage.removeItem(`answered_${currentUsername}`);
            }

            setQuestionData(questionObject);
            setHasAnswered(false);
            setSelectedAnswer('');
            setFeedback('');

        } catch (error) {
            // deleted auto retry cause causing errors for damn no reason
        }
    };

    const loadQuestion = async () => {
        const savedData = await AsyncStorage.getItem('dailyQuestion');
        const today = new Date().toISOString().split('T')[0];

        if (savedData) {
            const { question, date } = JSON.parse(savedData);
            if (date === today) {
                setQuestionData(question);

                // Check if user already answered today
                if (currentUsername) {
                    const userAnswer = await AsyncStorage.getItem(`answered_${currentUsername}`);
                    if (userAnswer) {
                        setHasAnswered(true);
                        setSelectedAnswer(userAnswer);
                        setFeedback(`You answered today. Correct answer: ${question.correct_answer}`);
                    }
                }
                return;
            }
        }
        await fetchDailyQuestion();
    };

    useEffect(() => {
        loadQuestion();
    }, [currentUsername]);

    const handleAnswer = async (answer: string) => {
        if (hasAnswered) {
            Alert.alert('You have already answered today\'s question.');
            return;
        }
        if (!questionData || !currentUsername) {
            Alert.alert('Error', 'Question data or user information is missing.');
            return;
        }

        setSelectedAnswer(answer);
        setHasAnswered(true);

        // Store user's answer
        await AsyncStorage.setItem(`answered_${currentUsername}`, answer);

        const isCorrect = answer === questionData.correct_answer;
        const pointsMap = { 'easy': 2, 'medium': 4, 'hard': 6 };
        const pointsEarned = isCorrect ? pointsMap[questionData.difficulty] : 0; // weird for assigning it any TS just differnt

        if (isCorrect) {
            setFeedback(`Congrats! You earned ${pointsEarned} points.`);
            try {
                await db.runAsync(
                    'UPDATE users SET points = points + ? WHERE username = ?;',
                    [pointsEarned, currentUsername]
                );
            } catch (error) {
                console.error("Error updating points:", error);
            }
        } else {
            setFeedback(`Maybe next time. The correct answer was: ${questionData.correct_answer}`);
        }
    };

    if (!questionData) return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Loading Daily Trivia...</Text>
        </SafeAreaView>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Pressable onPress={() => router.push("/dashboard")}>
                <Text>Admin</Text>
            </Pressable>
            <Text style={styles.title}>Question of the Day</Text>
            <Text style={styles.timer}>Next question in: {timeLeft}</Text>
            <Text style={styles.question}>{questionData.question}</Text>
            {questionData.answers.map((ans, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.answerButton, selectedAnswer === ans && styles.selected]}
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
    { backgroundColor: '#4DB6AC' 

    },
    answerText: 
    { fontSize: 16, 
        textAlign: 'center' 
    },
    feedback: 
    { fontSize: 18, 
        color: '#fff', 
        textAlign: 'center', 
        marginTop: 20 
    },
});
