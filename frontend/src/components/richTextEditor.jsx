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
          "min-h-[220px] px-4 py-4 text-sm leading-6 text-white outline-none",
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
      <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-[#151b23] p-2">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
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
          className={`rounded-lg px-3 py-2 text-sm italic transition ${
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
          className={`rounded-lg px-3 py-2 text-sm underline transition ${
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
          className={`rounded-lg px-3 py-2 text-sm line-through transition ${
            editor.isActive("strike")
              ? "bg-orange-500 text-black"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Strikethrough"
        >
          S
        </button>

        <div className="mx-1 h-6 w-px bg-white/10" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded-lg px-3 py-2 text-sm transition ${
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
          className={`rounded-lg px-3 py-2 text-sm transition ${
            editor.isActive("orderedList")
              ? "bg-orange-500 text-black"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Numbered list"
        >
          1. List
        </button>

        <div className="mx-1 h-6 w-px bg-white/10" />

        {/* Align Left */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`rounded-lg px-3 py-2 text-sm transition ${
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
          className={`rounded-lg px-3 py-2 text-sm transition ${
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
          className={`rounded-lg px-3 py-2 text-sm transition ${
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
          className={`rounded-lg px-3 py-2 text-sm transition ${
            editor.isActive({ textAlign: "justify" })
              ? "bg-orange-500 text-black"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Justify"
        >
          ≡
        </button>

        <div className="mx-1 h-6 w-px bg-white/10" />

        {/* Undo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          title="Undo"
        >
          ↶
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          title="Redo"
        >
          ↷
        </button>
      </div>

      {/* EDITOR */}
      <EditorContent
        editor={editor}
        className="
          [&_.ProseMirror]:min-h-55
          [&_.ProseMirror]:px-4
          [&_.ProseMirror]:py-4
          [&_.ProseMirror]:text-sm
          [&_.ProseMirror]:leading-6
          [&_.ProseMirror]:text-white
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror]:border-none
          [&_.ProseMirror]:shadow-none
          [&_.ProseMirror]:focus:outline-none
          [&_.ProseMirror]:focus:border-none
          [&_.ProseMirror]:focus:shadow-none
          [&_.ProseMirror_p]:my-2
          [&_.ProseMirror_ul]:my-2
          [&_.ProseMirror_ul]:list-disc
          [&_.ProseMirror_ul]:pl-6
          [&_.ProseMirror_ol]:my-2
          [&_.ProseMirror_ol]:list-decimal
          [&_.ProseMirror_ol]:pl-6
          [&_.ProseMirror_li]:my-1
          [&_.ProseMirror_strong]:font-bold
        "
      />
    </div>
  );
};

export default RichTextEditor;
