import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "./App";
import { CartProvider } from "./context/CartContext";

describe("App", () => {
  it("מרנדר את מעטפת הניווט אחרי טעינת הדף הראשי", async () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("navigation", { name: "ניווט ראשי" })).toBeInTheDocument();
  });

  it("מפנה קישורי projects ישנים לגלריה", async () => {
    render(
      <MemoryRouter initialEntries={["/projects/old-gallery-link"]}>
        <CartProvider>
          <App />
        </CartProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "תוצרת שנראית כמו שהיא מרגישה" })).toBeInTheDocument();
  });
});
