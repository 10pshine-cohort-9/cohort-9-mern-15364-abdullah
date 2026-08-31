import sanitizeHtml from "./sanitizeHtml.js";

describe("sanitizeHtml", () => {
  it("should return safe HTML unchanged", () => {
    const input = "<p>Hello <strong>world</strong></p>";
    const result = sanitizeHtml(input);
    expect(result).toBe("<p>Hello <strong>world</strong></p>");
  });

  it("should strip <script> tags", () => {
    const input = '<p>Hello</p><script>alert("hacked")</script>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("<script>");
    expect(result).toContain("<p>Hello</p>");
  });

  it("should strip dangerous inline event handlers", () => {
    const input = '<img src="x" onerror="alert(1)">';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("onerror");
  });

  it("should return an empty string for null input", () => {
    const result = sanitizeHtml(null);
    expect(result).toBe("");
  });
});
