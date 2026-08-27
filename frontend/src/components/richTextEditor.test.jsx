import { render, screen } from "@testing-library/react";
import RichTextEditor from "./richTextEditor.jsx";

describe("RichTextEditor", () => {
  it("should render without crashing given initial content", () => {
    render(<RichTextEditor content="<p>Hello</p>" onChange={jest.fn()} />);

    // Toolbar buttons should be present confirming the editor initialized
    expect(screen.getByTitle("Bold")).toBeInTheDocument();
    expect(screen.getByTitle("Italic")).toBeInTheDocument();
    expect(screen.getByTitle("Underline")).toBeInTheDocument();
  });

  it("should render with empty content without crashing", () => {
    render(<RichTextEditor content="" onChange={jest.fn()} />);

    expect(screen.getByTitle("Bold")).toBeInTheDocument();
  });
});