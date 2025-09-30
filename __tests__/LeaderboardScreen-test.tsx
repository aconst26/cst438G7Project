import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import Leaderboards from '../app/(tabs)/leaderboard';

const mockDb = {
  getAllAsync: jest.fn(),
};
jest.mock('expo-sqlite', () => ({
  useSQLiteContext: () => mockDb,
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

describe('Leaderboards component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithNavigation = (component: React.ReactNode) =>
    render(<NavigationContainer>{component}</NavigationContainer>);

  it('renders leaderboard data correctly', async () => {
    const fakeUsers = [
      { id: 1, username: 'Alice', points: 100 },
      { id: 2, username: 'Bob', points: 80 },
      { id: 3, username: 'Charlie', points: 60 },
      { id: 4, username: 'David', points: 40 },
    ];
    mockDb.getAllAsync.mockResolvedValue(fakeUsers);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('Bob');

    // Wants to be wrapped in act cause of async effects but when you do it throws error
    const { getByText } = renderWithNavigation(<Leaderboards />);

    await waitFor(() => {
      expect(getByText('Alice')).toBeTruthy();
      expect(getByText('Bob')).toBeTruthy();
      expect(getByText('Charlie')).toBeTruthy();
      expect(getByText('David')).toBeTruthy();

      const currentUser = getByText('Bob');
      expect(currentUser.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ color: '#007AFF' })])
      );
    });
  });

  it('handles empty leaderboard gracefully', async () => {
    mockDb.getAllAsync.mockResolvedValue([]);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { queryByText } = renderWithNavigation(<Leaderboards />);

    await waitFor(() => {
      expect(queryByText('Alice')).toBeNull();
      expect(queryByText('🏆 Leaderboards')).toBeTruthy();
    });
  });
});
