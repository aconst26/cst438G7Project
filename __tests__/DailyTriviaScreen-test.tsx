import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import React from 'react';
import DailyTrivia from '../app/(tabs)/DailyTrivia';


jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-sqlite', () => ({
  useSQLiteContext: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('html-entities', () => ({
  decode: (str: string) => str,
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (fn: any) => fn(),
}));

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        results: [
          {
            question: 'Test Question?',
            correct_answer: 'Answer 1',
            incorrect_answers: ['Answer 2', 'Answer 3', 'Answer 4'],
          },
        ],
      }),
  })
) as jest.Mock;

describe('DailyTrivia', () => {
  const mockDb = {
    getFirstAsync: jest.fn(),
    runAsync: jest.fn(),
  };

  beforeEach(() => {
    (SQLite.useSQLiteContext as jest.Mock).mockReturnValue(mockDb);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(null);
    mockDb.getFirstAsync.mockResolvedValue({
      question: 'DB Question?',
      answer: 'DB Answer',
      incorrect1: 'Wrong1',
      incorrect2: 'Wrong2',
      incorrect3: 'Wrong3',
    });
    mockDb.runAsync.mockResolvedValue(null);
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    const { getByText } = render(<DailyTrivia />);
    expect(getByText('Loading Daily Trivia...')).toBeTruthy();
  });

  it('renders question and answers from DB', async () => {
    const { getByText } = render(<DailyTrivia />);
    await waitFor(() => {
      expect(getByText('Question of the Day')).toBeTruthy();
      expect(getByText('DB Question?')).toBeTruthy();
    });
    expect(getByText('DB Answer')).toBeTruthy();
    expect(getByText('Wrong1')).toBeTruthy();
    expect(getByText('Wrong2')).toBeTruthy();
    expect(getByText('Wrong3')).toBeTruthy();
  });

//   it('handles selecting a correct answer', async () => {
//     const { getByText } = render(<DailyTrivia />);
//     await waitFor(() => getByText('DB Answer'));

//     await act(async () => {
//         fireEvent.press(getByText('DB Answer'));
//     });

//     await waitFor(() => {
//       expect(getByText('Congrats! You earned points.')).toBeTruthy();
//       expect(mockDb.runAsync).toHaveBeenCalledWith(
//         expect.stringContaining('UPDATE users SET points'),
//         expect.any(Array)
//       );
//     });
//   });

//   it('displays incorrect feedback for wrong answer', async () => {
//     const { getByText } = render(<DailyTrivia />);
//     await waitFor(() => getByText('DB Answer'));

//     fireEvent.press(getByText('Wrong1'));

//     await waitFor(() => {
//       expect(getByText('Maybe next time')).toBeTruthy();
//     });
//   });

  it('shows admin button if user is admin', async () => {
    mockDb.getFirstAsync.mockResolvedValue({ isAdmin: 1 });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('adminUser');

    const { getByText } = render(<DailyTrivia />);

    await waitFor(() => {
      expect(getByText('Admin Page')).toBeTruthy();
    });

    fireEvent.press(getByText('Admin Page'));
    expect(router.push).toHaveBeenCalledWith('/dashboard');
  });
});
