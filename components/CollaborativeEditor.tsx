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
  userName: string;
  onUsersChange: (users: string[]) => void;
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  roomId = "",
  userName,
  onUsersChange,
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
        toolbar: false,
      },
      placeholder: "Whats on your mind?",
    });

    const yText = ydoc.getText("quill");

    const binding = new QuillBinding(yText, quill, provider.awareness);

    // user's self state
    provider.awareness.setLocalStateField("user", {
      name: userName,
    });

    // extract users
    const updateUsers = () => {
      const states = Array.from(provider.awareness.getStates().values());

      const users = states
        .map((state) => state.user?.name)
        .filter((name) => typeof name === "string");

      onUsersChange(users);
    };

    updateUsers();

    provider.awareness.on("change", updateUsers);

    return () => {
      provider.awareness.off("change", updateUsers);
      provider.disconnect();
      ydoc.destroy();
    };
  }, [roomId, userName, onUsersChange]);

  return <div ref={editorRef} style={{ height: "500px", width: "100%" }}></div>;
};

export default CollaborativeEditor;
