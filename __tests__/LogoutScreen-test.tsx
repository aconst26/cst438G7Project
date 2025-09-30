import AsyncStorage from "@react-native-async-storage/async-storage";
import { render, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";
import Logout from "../app/(tabs)/logout";

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: jest.fn((callback) => callback()),
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  removeItem: jest.fn(),
}));

describe("Logout component", () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
  });

  it("removes loggedInUser from AsyncStorage and navigates to '/'", async () => {
    render(<Logout />);

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("loggedInUser");
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("renders an ActivityIndicator", () => {
    const { getByTestId } = render(
      <Logout />
    );
    const indicator = getByTestId("activity-indicator");
    expect(indicator).toBeTruthy();
  });
});
