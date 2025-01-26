"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [name, setName] = useState("");
  const [documentId, setDocumentId] = useState("");
  const router = useRouter();

  const handleSubmit = (action: "new" | "connect") => {
    if (!name || !documentId) {
      alert("Please fill in all fields");
      return;
    }

    // Use router.push with { replace: true } to prevent going back to this page
    // router.replace(`/editor/${documentId}?name=${encodeURIComponent(name)}`);

    if (action === "new") {
      const newId = uuidv4();
      router.push(`/editor/${newId}`);
    } else if (action === "connect") {
      if (!documentId.trim()) {
        alert("Please enter a Document ID to connect.");
        return;
      }
      router.push(`/editor/${documentId}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">
            Welcome to CollabEdit
          </CardTitle>
          <CardDescription>Enter your details to start editing</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentId">Document ID</Label>
              <Input
                id="documentId"
                placeholder="Enter document ID or leave blank for new"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                type="button"
                onClick={() => handleSubmit("new")}
                className="flex-1"
              >
                New Session
              </Button>
              <Button
                type="button"
                onClick={() => handleSubmit("connect")}
                variant="outline"
                className="flex-1"
              >
                Connect
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
