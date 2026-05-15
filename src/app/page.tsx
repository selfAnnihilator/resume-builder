import Link from 'next/link'
import { UploadResumeButton } from '@/components/UploadResumeButton'

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Bold indigo header, clean sections, great for tech roles',
    accent: 'bg-indigo-600',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Serif typography, centered header, ATS-safe white layout',
    accent: 'bg-gray-800',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Two-column sidebar layout, slate dark panel, stands out',
    accent: 'bg-slate-700',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <span className="font-bold text-lg tracking-tight text-indigo-700">ResumeBuilder</span>
        <Link
          href="/editor"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Build Resume
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-4 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          Free · No sign-up · Instant PDF
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 max-w-2xl leading-tight mb-4">
          Build a resume that<br />
          <span className="text-indigo-600">gets you hired</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          Professional templates for students and freshers. Fill in your details, preview live, download PDF in seconds.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/editor"
            className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Start Building →
          </Link>
          <UploadResumeButton
            label="Check Score"
            className="flex items-center gap-2 border border-indigo-300 text-indigo-700 px-6 py-3.5 rounded-xl text-base font-semibold hover:bg-indigo-50 transition-colors"
          />
        </div>
      </section>

      {/* Templates */}
      <section className="px-8 pb-20 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Choose your template</h2>
        <p className="text-center text-gray-500 mb-10 text-sm">Switch between templates anytime in the editor</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {templates.map((t) => (
            <Link key={t.id} href="/editor" className="group rounded-2xl border bg-white p-5 hover:shadow-lg hover:border-indigo-200 transition-all">
              <div className={`h-32 rounded-lg ${t.accent} mb-4 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity`}>
                <div className="space-y-2 px-4 w-full">
                  <div className="h-3 bg-white/30 rounded w-1/2" />
                  <div className="h-2 bg-white/20 rounded w-3/4" />
                  <div className="h-2 bg-white/20 rounded w-2/3" />
                  <div className="h-2 bg-white/20 rounded w-1/2" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{t.name}</h3>
              <p className="text-sm text-gray-500">{t.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-t py-16 px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { icon: '⚡', label: 'Live Preview', desc: 'See changes instantly' },
            { icon: '📄', label: 'PDF Export', desc: 'One-click download' },
            { icon: '💾', label: 'Auto-Save', desc: 'Never lose your work' },
            { icon: '🎨', label: '3 Templates', desc: 'Switch anytime' },
          ].map((f) => (
            <div key={f.label}>
              <div className="text-3xl mb-2">{f.icon}</div>
              <div className="font-semibold text-gray-900 text-sm">{f.label}</div>
              <div className="text-gray-500 text-xs mt-0.5">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-6 px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span className="font-semibold text-gray-500">ResumeBuilder</span>
          <span>Free · No account · No data stored on servers · Your data stays in your browser</span>
          <Link href="/editor" className="text-indigo-500 hover:text-indigo-700 transition-colors font-medium">
            Start Building →
          </Link>
        </div>
      </footer>
    </div>
  )
}
