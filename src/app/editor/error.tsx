'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function EditorError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Editor error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="text-5xl mb-4">⚠️</div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
      <p className="text-gray-500 text-sm mb-6 max-w-sm">{error.message || 'An unexpected error occurred in the editor.'}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Try again
        </button>
        <Link href="/" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors flex items-center">
          ← Home
        </Link>
      </div>
    </div>
  )
}
