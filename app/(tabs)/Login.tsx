import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { Link, router } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

async function hashPassword(password: string): Promise<string> {
    return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
    );
}


export default function Login() {
    const db = SQLite.useSQLiteContext();
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            if (!username || !password) {
                Alert.alert('Error', 'Please enter both username and password.');
                return;
            }
            const hashedPassword = await hashPassword(password);

            const user = await db.getFirstAsync(
                'SELECT * FROM users WHERE username = ? AND password = ?;',
                [username, hashedPassword]
            );

            if(!user) {
                Alert.alert('Login Failed', 'Incorrect username or password.');
                return;
            }
            await db.runAsync('UPDATE users SET loggedIn = ? WHERE username = ?;', [1, username]);
            const user2 = await db.getFirstAsync(
                'SELECT * FROM users WHERE username = ? AND password = ?;',
                [username, hashedPassword]
            );
            console.log('Logged in user:', user2);
            await AsyncStorage.setItem('loggedInUser', username); // Store logged in user
            console.log('Logged in user:', user);
            setUsername('');
            setPassword('');
            router.replace('/explore');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An error occurred during login. Please try again.');
        }
    };

    return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Welcome Back</Text>
      <Text style={styles.subHeader}>Log in to your account</Text>

    <View style={styles.centerWrapper}>
        <View style={styles.formCard}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Username</Text>
            <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            />
        </View>

        <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        </View>
    </View>

    <Link href="/" asChild>
    <TouchableOpacity>
    <Text style={styles.footerText}>
        Don’t have an account? <Text style={styles.footerLink}>Sign up</Text>
    </Text>
    </TouchableOpacity>
    </Link>
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