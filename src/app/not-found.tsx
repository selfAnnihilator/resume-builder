import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="text-6xl font-bold text-indigo-600 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-8">That page doesn&apos;t exist. Try the resume editor instead.</p>
      <div className="flex gap-3">
        <Link href="/" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">← Home</Link>
        <Link href="/editor" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Go to Editor</Link>
      </div>
    </div>
  )
}
