"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setQuery(searchParams.get("query") || "")
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (query.trim()) {
      router.push(`/?query=${encodeURIComponent(query.trim())}`)
    } else {
      router.push("/")
    }
  }

  return (
    <form onSubmit={handleSearch} className="mb-8">
      <div className="flex w-full max-w-2xl mx-auto">
        <Input
          type="text"
          placeholder="Search videos by title or tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-r-none focus-visible:ring-blue-500"
        />
        <Button type="submit" className="rounded-l-none bg-blue-600 hover:bg-blue-700">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </form>
  )
}
