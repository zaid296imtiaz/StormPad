"use client";

import { useEffect, useRef } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import Quill from "quill";
import { QuillBinding } from "y-quill";
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

  useEffect(() => {
    if (!editorRef.current) return;

    const ydoc = new Y.Doc();

    const websocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:1234';
    const provider = new WebsocketProvider(websocketURL, roomId, ydoc);

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: false,
      },
      placeholder: "Whats on your mind?",
    });

    const yText = ydoc.getText("quill");

    new QuillBinding(yText, quill, provider.awareness);

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

  return <div ref={editorRef} style={{ height: "100%", width: "100%", borderRadius: '7px' }}></div>;
};

export default CollaborativeEditor;
