import DOMPurify from "dompurify";

const sanitizeHtml = (html) => DOMPurify.sanitize(html || "");

export default sanitizeHtml;
