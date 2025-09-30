import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import Login from '../app/(tabs)/Login';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  Link: ({ children }: any) => children,
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

jest.mock('expo-sqlite', () => ({
  useSQLiteContext: () => ({
    getFirstAsync: jest.fn(async (query, params) => {
      if (params[0] === 'testuser' && params[1]) return { username: 'testuser' };
      return null;
    }),
  }),
}));

jest.mock('expo-crypto', () => ({
  digestStringAsync: jest.fn(async () => 'hashedpassword'),
  CryptoDigestAlgorithm: { SHA256: 'SHA256' },
}));

describe('Login component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('updates username and password fields', () => {
    const { getByTestId } = render(<Login />);
    const usernameInput = getByTestId('usernameInput');
    const passwordInput = getByTestId('passwordInput');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password');

    expect(usernameInput.props.value).toBe('testuser');
    expect(passwordInput.props.value).toBe('password');
  });

  it('logs in successfully with correct credentials', async () => {
    const { getByTestId, getByText } = render(<Login />);
    const usernameInput = getByTestId('usernameInput');
    const passwordInput = getByTestId('passwordInput');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password');

    await act(async () => { // act was killing me
      fireEvent.press(getByText('Log In'));
    });

    expect(require('@react-native-async-storage/async-storage').setItem).toHaveBeenCalledWith(
      'loggedInUser',
      'testuser'
    );
  });

  it('shows alert if login fails', async () => {
    const { getByTestId, getByText } = render(<Login />);
    const usernameInput = getByTestId('usernameInput');
    const passwordInput = getByTestId('passwordInput');

    fireEvent.changeText(usernameInput, 'wronguser');
    fireEvent.changeText(passwordInput, 'wrongpass');

    await act(async () => {
      fireEvent.press(getByText('Log In'));
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Login Failed',
      'Incorrect username or password.'
    );
  });
});
