import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import AdminScreen from '../app/(admin)/dashboard';

jest.mock('expo-sqlite', () => ({
  useSQLiteContext: () => ({
    runAsync: jest.fn(() => Promise.resolve()),
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.spyOn(Alert, 'alert');

describe('AdminScreen', () => {
  it('updates inputs and submits successfully', async () => {
    const { getByTestId, getByText } = render(<AdminScreen />);

    fireEvent.changeText(getByTestId('input-question'), 'Q1');
    fireEvent.changeText(getByTestId('input-answer'), 'A1');
    fireEvent.changeText(getByTestId('input-incorrect1'), 'I1');
    fireEvent.changeText(getByTestId('input-incorrect2'), 'I2');
    fireEvent.changeText(getByTestId('input-incorrect3'), 'I3');

    fireEvent.press(getByText('Create'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Question added successfully!');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('newDailyQuestion', 'true');
    });
  });

  it('alerts error when form incomplete', async () => {
    const { getByText } = render(<AdminScreen />);
    fireEvent.press(getByText('Create'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error: Please complete question input');
    });
  });
});
