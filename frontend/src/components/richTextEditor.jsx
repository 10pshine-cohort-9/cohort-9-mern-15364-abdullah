import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

const RichTextEditor = ({
  content = "",
  value,
  onChange,
  placeholder = "Write your note...",
}) => {
  const editorValue = value !== undefined ? value : content;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
      }),

      Underline,

      TextAlign.configure({
        types: ["paragraph"],
      }),

      Placeholder.configure({
        placeholder,
      }),
    ],

    content: editorValue,

    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },

    editorProps: {
      attributes: {
        class:
          "min-h-[96px] px-2 py-1 text-xs leading-5 text-white outline-none sm:min-h-[220px] sm:px-4 sm:py-4 sm:text-sm sm:leading-6",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getHTML();

    if (editorValue !== currentContent) {
      editor.commands.setContent(editorValue || "", {
        emitUpdate: false,
      });
    }
  }, [editor, editorValue]);

  if (!editor) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0d1218]">
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-white/10 bg-[#151b23] p-1 sm:gap-1 sm:p-2">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-lg px-2 py-1 text-xs font-bold transition sm:px-3 sm:py-2 sm:text-sm ${
            editor.isActive("bold")
              ? "bg-orange-500 text-black"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Bold"
        >
          B
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-lg px-2 py-1 text-xs italic transition sm:px-3 sm:py-2 sm:text-sm ${
            editor.isActive("italic")
              ? "bg-orange-500 text-black"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Italic"
        >
          I
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded-lg px-2 py-1 text-xs underline transition sm:px-3 sm:py-2 sm:text-sm ${
            editor.isActive("underline")
              ? "bg-orange-500 text-black"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Underline"
        >
          U
        </button>

        {/* Strikethrough */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded-lg px-2 py-1 text-xs line-through transition sm:px-3 sm:py-2 sm:text-sm ${
            editor.isActive("strike")
              ? "bg-orange-500 text-black"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Strikethrough"
        >
          S
        </button>

        <div className="mx-0.5 h-4 w-px bg-white/10 sm:mx-1 sm:h-6" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded-lg px-2 py-1 text-xs transition sm:px-3 sm:py-2 sm:text-sm ${
            editor.isActive("bulletList")
              ? "bg-orange-500 text-black"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Bullet list"
        >
          • List
        </button>

        {/* Numbered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded-lg px-2 py-1 text-xs transition sm:px-3 sm:py-2 sm:text-sm ${
            editor.isActive("orderedList")
              ? "bg-orange-500 text-black"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Numbered list"
        >
          1. List
        </button>

        <div className="mx-0.5 h-4 w-px bg-white/10 sm:mx-1 sm:h-6" />

        {/* Align Left */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`rounded-lg px-2 py-1 text-xs transition sm:px-3 sm:py-2 sm:text-sm ${
            editor.isActive({ textAlign: "left" })
              ? "bg-orange-500 text-black"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Align left"
        >
          ≡
        </button>

        {/* Align Center */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`rounded-lg px-2 py-1 text-xs transition sm:px-3 sm:py-2 sm:text-sm ${
            editor.isActive({ textAlign: "center" })
              ? "bg-orange-500 text-black"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Align center"
        >
          ≡
        </button>

        {/* Align Right */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`rounded-lg px-2 py-1 text-xs transition sm:px-3 sm:py-2 sm:text-sm ${
            editor.isActive({ textAlign: "right" })
              ? "bg-orange-500 text-black"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Align right"
        >
          ≡
        </button>

        {/* Justify */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`rounded-lg px-2 py-1 text-xs transition sm:px-3 sm:py-2 sm:text-sm ${
            editor.isActive({ textAlign: "justify" })
              ? "bg-orange-500 text-black"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Justify"
        >
          ≡
        </button>

        <div className="mx-0.5 h-4 w-px bg-white/10 sm:mx-1 sm:h-6" />

        {/* Undo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="rounded-lg px-2 py-1 text-xs text-gray-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:px-3 sm:py-2 sm:text-sm"
          title="Undo"
        >
          ↶
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="rounded-lg px-2 py-1 text-xs text-gray-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:px-3 sm:py-2 sm:text-sm"
          title="Redo"
        >
          ↷
        </button>
      </div>

      {/* EDITOR */}
      <EditorContent
        editor={editor}
        className="
          [&_.ProseMirror]:min-h-24
          [&_.ProseMirror]:px-2
          [&_.ProseMirror]:py-1
          sm:[&_.ProseMirror]:min-h-55
          sm:[&_.ProseMirror]:px-4
          sm:[&_.ProseMirror]:py-4
          [&_.ProseMirror]:text-xs
          [&_.ProseMirror]:leading-5
          sm:[&_.ProseMirror]:text-sm
          sm:[&_.ProseMirror]:leading-6
          [&_.ProseMirror]:text-white
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror]:border-none
          [&_.ProseMirror]:shadow-none
          [&_.ProseMirror]:focus:outline-none
          [&_.ProseMirror]:focus:border-none
          [&_.ProseMirror]:focus:shadow-none
          [&_.ProseMirror_p]:my-1
          [&_.ProseMirror_ul]:my-1
          [&_.ProseMirror_ul]:list-disc
          [&_.ProseMirror_ul]:pl-6
          [&_.ProseMirror_ol]:my-1
          [&_.ProseMirror_ol]:list-decimal
          [&_.ProseMirror_ol]:pl-6
          [&_.ProseMirror_li]:my-0.5
          sm:[&_.ProseMirror_p]:my-2
          sm:[&_.ProseMirror_ul]:my-2
          sm:[&_.ProseMirror_ol]:my-2
          sm:[&_.ProseMirror_li]:my-1
          [&_.ProseMirror_strong]:font-bold
        "
      />
    </div>
  );
};

export default RichTextEditor;
