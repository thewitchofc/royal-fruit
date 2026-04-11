import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "./App";
import { CartProvider } from "./context/CartContext";

describe("App", () => {
  it("מרנדר את מעטפת הניווט אחרי טעינת הדף הראשי", async () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>,
    );

    expect(await screen.findByRole("navigation", { name: "ניווט ראשי" })).toBeInTheDocument();
  });
});
