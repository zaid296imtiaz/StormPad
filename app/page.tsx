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
import { toast } from "react-toastify";

export default function Home() {
  const [name, setName] = useState("");
  const [documentId, setDocumentId] = useState("");
  const router = useRouter();

  const handleSubmit = (action: "new" | "connect") => {
    if (!name) {
      toast.warning("Please enter your name");
      return;
    }

    if (action === "connect" && !documentId.trim()) {
      toast.warning("Please enter a Document ID to connect");
      return;
    }

    if (action === "new") {
      const newId = uuidv4();
      router.push(`/editor/${newId}?name=${encodeURIComponent(name)}`);
    } else if (action === "connect") {
      router.push(`/editor/${documentId}?name=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">
            Welcome to StormPad
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
