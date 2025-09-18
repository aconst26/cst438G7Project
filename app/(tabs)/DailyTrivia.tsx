import { decode } from 'html-entities';
import * as SQlite from 'expo-sqlite';
import React, {useEffect, useState} from 'react';
import {Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AsynStorage from '@react-native-async-storage/async-storage';

export default function DailyTrivia() {
    const db = SQlite.useSQLiteContext();
    const [questionData, setQuestionData] = useState<{
        question: string;
        correct_answer: string;
        incorrect_answers: string[];
        answers: string[];
        difficulty: 'easy' | 'medium' | 'hard';
    } | null>(null);
    
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [hasAnswered, setHasAnswered] = useState(false);
    const [feedback, setFeedback] = useState('');

    const [currentUsername, setCurrentUsername] = useState<string | null>(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const username = await AsynStorage.getItem('loggedInUser');
            setCurrentUsername(username);
        };
        fetchCurrentUser();
    }, []); //get current logged in user

    const fetchDailyQuestion = async (retryCount: number = 0) => {
        try{
            const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
                let data = await response.json();
                if(!data.results || data.results.length === 0) {
                    throw new Error("No questions available");
                }

                const dailyQuestion = data.results[0];
                const answers = [...dailyQuestion.incorrect_answers, dailyQuestion.correct_answer];
                setQuestionData({
                    question: decode(dailyQuestion.question),
                    correct_answer: decode(dailyQuestion.correct_answer),
                    incorrect_answers: dailyQuestion.incorrect_answers.map((ans: string) => decode(ans)),
                    answers: answers.map((ans)=>decode(ans)),
                    difficulty: dailyQuestion.difficulty
                });
        } catch (error){
            console.error("Error fetching question:", error);
            if (retryCount < 3) {
                    console.log(`Retrying... (${retryCount + 1})`);
                    setTimeout(() => {
                        fetchDailyQuestion(retryCount + 1);
                    }, 1000);
                } else {
                    Alert.alert("Error", "Failed to load trivia question after multiple attempts.");
                }
            }
    };

    useEffect(() => {
        fetchDailyQuestion();
    }, []);

    const handleAnswer = async (answer: string) => {
        if(hasAnswered) {
            Alert.alert('You have already answered today\'s question.');
            return;
        }

        if (!questionData || !currentUsername) {
            Alert.alert('Error', 'Question data or user information is missing.');
            return;
        }
        setSelectedAnswer(answer);
        setHasAnswered(true);


        const isCorrect = answer === questionData.correct_answer;
        const pointsMap = { 'easy': 2, 'medium': 4, 'hard': 6 };
        const pointsEarned = isCorrect ? pointsMap[questionData.difficulty] : 0;

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

        if (!questionData) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Daily Trivia</Text>
                <Text>Loading question...</Text>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Question of the Day</Text>
            <Text style={styles.question}>{questionData.question}</Text>
            {questionData.answers.map((ans, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.answerButton,
                        selectedAnswer === ans && styles.selected
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
    container: {
        flex: 1,
        backgroundColor: '#0E2028',
        padding: 24,
        justifyContent: 'center',
    },
    
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    
    question: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    
    answerButton: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginVertical: 6,
    },
    
    selected: {
        backgroundColor: '#4DB6AC',
    },
    
    answerText: {
        fontSize: 16,
        textAlign: 'center',
    },
    
    feedback: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        marginTop: 20,
    },
    
    loading: {
        fontSize: 16,
        color: '#bbb',
        textAlign: 'center',
        marginTop: 40,
    },
}); 

