"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Copy, Users } from "lucide-react"

export default function Editor({ params }: { params: { documentId: string } }) {
  const [documentName, setDocumentName] = useState("Untitled Document")
  const [content, setContent] = useState("")
  const [connectedUsers, setConnectedUsers] = useState(["You"])
  const router = useRouter()

  useEffect(() => {
    // Here you would set up your real-time connection
    // and sync the document content
  }, [])

  const copySessionId = () => {
    navigator.clipboard.writeText(params.documentId)
    alert("Session ID copied to clipboard!")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <Button variant="ghost" onClick={() => router.push("/")} className="p-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Input
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="text-xl sm:text-2xl font-bold border-none focus:ring-0 p-0 w-full sm:w-auto"
            />
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-sm text-gray-500">Session ID: {params.documentId}</span>
            <Button variant="ghost" onClick={copySessionId} className="p-1">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col sm:flex-row">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row">
          <div className="flex-grow mb-4 sm:mb-0 sm:mr-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full min-h-[300px] sm:min-h-[500px] p-4 text-lg"
              placeholder="Start typing your document here..."
            />
          </div>
          <Card className="w-full sm:w-64 h-fit">
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Connected Users</h3>
              </div>
              <ul className="space-y-2">
                {connectedUsers.map((user, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {user}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

