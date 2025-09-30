import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import SignUpScreen from '../app/(tabs)/index';

// Setting up the modules
jest.mock('expo-crypto', () => ({
  digestStringAsync: jest.fn(async (_alg: any, input: string) => 'hashed-' + input),
  CryptoDigestAlgorithm: { SHA256: 'SHA256' },
}));

jest.mock('expo-sqlite', () => ({
  useSQLiteContext: () => ({
    getFirstAsync: jest.fn(async () => null),
    runAsync: jest.fn(async () => null),
  }),
}));

jest.mock('expo-router', () => ({
  Link: ({ children }: any) => children,
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all inputs and the Sign Up button', () => {
    const { getByTestId, getByText } = render(<SignUpScreen />);
    expect(getByTestId('firstNameInput')).toBeTruthy();
    expect(getByTestId('lastNameInput')).toBeTruthy();
    expect(getByTestId('usernameInput')).toBeTruthy();
    expect(getByTestId('emailInput')).toBeTruthy();
    expect(getByTestId('passwordInput')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('shows success alert when form is submitted correctly', async () => {
    const { getByTestId, getByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByTestId('firstNameInput'), 'John');
    fireEvent.changeText(getByTestId('lastNameInput'), 'Doe');
    fireEvent.changeText(getByTestId('usernameInput'), 'johndoe');
    fireEvent.changeText(getByTestId('emailInput'), 'john@example.com');
    fireEvent.changeText(getByTestId('passwordInput'), 'password123');

    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'User added successfully!');
    });
  });

  it('shows error alert when fields are missing', async () => {
    const { getByText } = render(<SignUpScreen />);
    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error: All fields are required');
    });
  });

//   it('shows error alert if email or username already exists', async () => {
//     // Mock existing user for this test
//     const db = require('expo-sqlite').useSQLiteContext();
//     db.getFirstAsync.mockImplementation(async (query: string, params: string[]) => {
//       if (params[0] === 'john@example.com' || params[0] === 'johndoe') {
//         return { email: 'john@example.com' }; // simulate found user
//       }
//       return null;
//     });
  
//     const { getByTestId, getByText } = render(<SignUpScreen />);
//     fireEvent.changeText(getByTestId('firstNameInput'), 'John');
//     fireEvent.changeText(getByTestId('lastNameInput'), 'Doe');
//     fireEvent.changeText(getByTestId('usernameInput'), 'johndoe');
//     fireEvent.changeText(getByTestId('emailInput'), 'john@example.com');
//     fireEvent.changeText(getByTestId('passwordInput'), 'password123');
  
//     fireEvent.press(getByText('Sign Up'));
  
//     await waitFor(() => {
//       expect(Alert.alert).toHaveBeenCalledWith(
//         'Error: Email/Username already in use. Please enter a different email.'
//       );
//     });
//   });  

  it('resets the form after successful submission', async () => {
    const { getByTestId, getByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByTestId('firstNameInput'), 'John');
    fireEvent.changeText(getByTestId('lastNameInput'), 'Doe');
    fireEvent.changeText(getByTestId('usernameInput'), 'johndoe');
    fireEvent.changeText(getByTestId('emailInput'), 'john@example.com');
    fireEvent.changeText(getByTestId('passwordInput'), 'password123');

    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(getByTestId('firstNameInput').props.value).toBe('');
      expect(getByTestId('lastNameInput').props.value).toBe('');
      expect(getByTestId('usernameInput').props.value).toBe('');
      expect(getByTestId('emailInput').props.value).toBe('');
      expect(getByTestId('passwordInput').props.value).toBe('');
    });
  });
});
