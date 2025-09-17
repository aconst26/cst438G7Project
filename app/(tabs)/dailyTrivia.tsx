import * as SQLite from 'expo-sqlite';
import { decode } from 'html-entities'; // install package npm install html-entities
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function DailyTrivia() {
    const db = SQLite.useSQLiteContext();
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

    const currentUsername = 'currentUser'; // Replace with actual logic to get current logged-in user

    useEffect(() => {
        const fetchDailyQuestion = async () => {
            try {
                let response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
                let data = await response.json();
                const dailyQuestion = data.results[0];
                const answers = [...dailyQuestion.incorrect_answers, dailyQuestion.correct_answer];
                setQuestionData({
                    question: decode(dailyQuestion.question),
                    correct_answer: decode(dailyQuestion.correct_answer),
                    incorrect_answers: dailyQuestion.incorrect_answers.map((ans: string) => decode(ans)),
                    answers: answers.map((ans)=>decode(ans)),
                    difficulty: dailyQuestion.difficulty
                });
            } catch (error) {
                console.error("Error fetching daily question:", error);
                Alert.alert("Error", "Unable to load trivia question.");
            }
        };
        fetchDailyQuestion();
    }, []);

    const handleAnswer = async (answer: string) => {
        if(hasAnswered) {
            Alert.alert('You have already answered today\'s question.');
            return;
        }

        if (!questionData) return;
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
           