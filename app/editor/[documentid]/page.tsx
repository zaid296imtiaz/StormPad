"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Copy, Users } from "lucide-react";
import { toast } from "react-toastify";

import CollaborativeEditor from "@/components/CollaborativeEditor";

import { getYDoc } from "@/lib/yjs";

export default function Editor({ params }: { params: { documentid: string } }) {
  const router = useRouter();
  const searchParam = useSearchParams();
  const [documentName, setDocumentName] = useState("Untitled Document");
  // const [content, setContent] = useState("");
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  // const [sessionURL, setSessionURL] = useState("");

  const [userName, setUserName] = useState("");

  const unwrappedParams = React.use(params);
  const documentId = unwrappedParams.documentid;

  //   console.log(`doc id: ${documentId} && ${JSON.stringify(params)}`)

  const handleUsersChange = useCallback((users: string[]) => {
    //no duplicates and inclide 'You' for self user
    const uniqueUsers = Array.from(new Set(users));

    if (!uniqueUsers.includes(userName)) {
      uniqueUsers.unshift(userName);
    }
    setConnectedUsers(uniqueUsers);
  }, []);

  useEffect(() => {
    if (documentId) {
      // setSessionURL(window.location.href);
      setUserName(searchParam.get("name") || "User");

      const ydoc = getYDoc(documentId);
      // const provider = getProvider(documentId);

      const metadata = ydoc.getMap("metadata");

      if (!metadata.has("documentName")) {
        metadata.set("documentName", "Untitled Document");
      }

      const updateDocumentName = () => {
        const name = metadata.get("documentName") as string;
        setDocumentName(name);
      };

      updateDocumentName();

      metadata.observe(() => {
        updateDocumentName();
      });
    }
  }, [documentId]);

  const copySessionId = () => {
    navigator.clipboard.writeText(documentId);
    toast.success("Document ID copied to clipboard!");
  };

  const handleDocumentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setDocumentName(newName);

    const ydoc = getYDoc(documentId);
    const metadata = ydoc.getMap("metadata");
    metadata.set("documentName", newName);
  };

  if (!documentId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="p-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Input
              value={documentName}
              onChange={handleDocumentNameChange}
              className="text-xl sm:text-2xl font-bold border-none focus:ring-0 p-0 w-full sm:w-auto"
            />
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-sm text-gray-500">
              Session ID: {unwrappedParams.documentid}
            </span>
            <Button variant="ghost" onClick={copySessionId} className="p-1">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col sm:flex-row">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row">
          <div className="flex-grow mb-4 sm:mb-0 sm:mr-4 bg-white rounded-md">
            <CollaborativeEditor
              roomId={documentId}
              onUsersChange={handleUsersChange}
              userName={userName}
            />
          </div>
          <Card className="w-full sm:w-64 h-fit">
            <CardContent>
              <div className="flex items-center space-x-2 mb-4 pt-3">
                <Users className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Online</h3>
              </div>
              <ul className="space-y-2">
                {connectedUsers.map((user, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {user === userName
                      ? "You"
                      : user.charAt(0).toUpperCase() + user.slice(1)}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
