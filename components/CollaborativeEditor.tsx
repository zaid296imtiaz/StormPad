"use client";

import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import Quill from "quill";
import { QuillBinding } from "y-quill";
import { Textarea } from "./ui/textarea";
import "quill/dist/quill.snow.css";

interface CollaborativeEditorProps {
  roomId?: string;
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  roomId = "",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState("");

  useEffect(() => {
    if (!editorRef.current) return;

    const ydoc = new Y.Doc();

    const provider = new WebsocketProvider("ws://localhost:1234", roomId, ydoc);

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          ["image", "code-block"],
        ],
      },
      placeholder: "Start typing your document here...",
    });

    const yText = ydoc.getText("quill");

    const binding = new QuillBinding(yText, quill, provider.awareness);

    return () => {
      provider.disconnect();
      ydoc.destroy();
    };
  }, [roomId]);

  return (
    <div
      ref={editorRef}
      style={{ height: "500px", width: "100%" }} 
    ></div>
  );
};

export default CollaborativeEditor;
