import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Home from "../pages/index"; // Adjust if your file path differs
import axios from "axios";

jest.mock("axios");

const mockData = Array.from({ length: 20 }, (_, index) => ({
  id: `${index + 1}`,
  name: `Launch ${index + 1}`,
  date_utc: new Date().toISOString(),
  success: index % 2 === 0,
  details: `Details for Launch ${index + 1}`,
  failures: index % 2 !== 0 ? [{ reason: "Engine failure" }] : [],
  links: {
    patch: {
      small: "https://via.placeholder.com/150",
    },
  },
}));

describe("Home component", () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({
      data: {
        docs: mockData,
      },
    });
  });

  it("renders loading initially", () => {
    render(<Home />);
    expect(screen.getByText(/Loading launches/i)).toBeInTheDocument();
  });

  it("renders launch cards after data loads", async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getAllByText(/Launch/i).length).toBeGreaterThan(0);
    });
  });

  it("displays correct number of items per page", async () => {
    render(<Home />);
    await waitFor(() => {
      const cards = screen.getAllByRole("heading", { level: 2 });
      expect(cards.length).toBe(10); // itemsPerPage = 10
    });
  });

  it("pagination works and shows next set of items", async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText("Launch 1")).toBeInTheDocument();
    });

    const page2Btn = screen.getByText("2");
    fireEvent.click(page2Btn);

    await waitFor(() => {
      expect(screen.getByText("Launch 11")).toBeInTheDocument();
    });
  });
});