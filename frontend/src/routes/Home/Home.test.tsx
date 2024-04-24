import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import Home from "./Home";

const queryClient = new QueryClient();

const setup = () => {
  const utils = render(
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
  const submitButton = screen.getByText(/submit/i) as HTMLButtonElement;
  const nameInput = screen.getByRole("textbox", {
    name: "Your name",
  }) as HTMLInputElement;
  const messageInput = screen.getByRole("textbox", {
    name: "Message",
  }) as HTMLInputElement;
  const songInput = screen.getByRole("textbox", {
    name: "Song",
  }) as HTMLInputElement;

  return {
    submitButton,
    nameInput,
    messageInput,
    songInput,
    ...utils,
  };
};

describe("Home page", () => {
  // ASSERT starting state
  test("Form renders empty inputs and disabled submit button", () => {
    const { submitButton, nameInput, messageInput, songInput } = setup();
    expect(submitButton).toBeDisabled();
    expect(nameInput).toHaveTextContent("");
    expect(messageInput).toHaveTextContent("");
    expect(songInput).toHaveTextContent("");
  });

  test("Submit button stays disabled after typing name", () => {
    const { submitButton, nameInput } = setup();
    fireEvent.change(nameInput, { target: { value: "Pedro" } });
    expect(submitButton).toBeDisabled();
  });

  test("Suggestions show when typing a song query", async () => {
    const { songInput } = setup();
    fireEvent.change(songInput, { target: { value: "folk" } });
    await waitFor(
      () => {
        const elements = screen.getAllByText(/folk/i);
        expect(elements.length).toBeGreaterThan(0);
      },
      { timeout: 5000 }
    );
  });
});
