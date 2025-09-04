import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    
    const handleLogin = () => {
        console.log('Logging in with:', {username, password});
    };
    
    const handleSignUp = () => {
        console.log('Navigating to sign-up screen');
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
    
    <Text style={styles.footerText}>
        Don’t have an account? <Text style={styles.footerLink} onPress={handleSignUp}>Sign up</Text>
    </Text>
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