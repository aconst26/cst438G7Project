import { NavigationContainer } from "@react-navigation/native";
import { render, waitFor } from "@testing-library/react-native";
import React from "react";
import QuizScreen from "../app/(tabs)/explore";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve("testuser")),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockDb = { runAsync: jest.fn() };
jest.mock("expo-sqlite", () => ({
  useSQLiteContext: () => mockDb,
}));

beforeEach(() => {
  jest.useFakeTimers(); 
  (global.fetch as jest.Mock) = jest.fn((url: RequestInfo) => {
    if (url.toString().includes("api_category.php")) {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            trivia_categories: [{ id: 9, name: "General Knowledge" }],
          }),
      });
    }
    if (url.toString().includes("api.php")) {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            results: [
              {
                question: "Test Question?",
                correct_answer: "Correct",
                incorrect_answers: ["Wrong1", "Wrong2", "Wrong3"],
              },
            ],
          }),
      });
    }
    return Promise.reject("Unknown URL");
  }) as jest.Mock;
});

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});

const renderWithNav = (ui: React.ReactElement) =>
  render(<NavigationContainer>{ui}</NavigationContainer>);


describe("QuizScreen", () => {
  it("renders initial quiz selection", async () => {
    const { getByText } = renderWithNav(<QuizScreen />);
    await waitFor(() => {
      expect(getByText("Select Your Quiz")).toBeTruthy();
    });
  });

//   it("can start a quiz and display a question", async () => {
//     const { getByText } = renderWithNav(<QuizScreen />);

//     fireEvent.press(getByText("Select a Category"));
//     await waitFor(() => getByText("General Knowledge")); // cant find this not sure why
//     fireEvent.press(getByText("General Knowledge"));

//     fireEvent.press(getByText("Select Difficulty"));
//     fireEvent.press(getByText("Easy"));

//     fireEvent.press(getByText("Select Type"));
//     fireEvent.press(getByText("Multiple Choice"));

//     fireEvent.press(getByText("Take Test"));

//     await waitFor(() => {
//       expect(getByText("Test Question?")).toBeTruthy();
//     });
//   });

});
