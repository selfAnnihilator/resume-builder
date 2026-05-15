import { parseResumeText } from '@/lib/parseResumeText'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    const name = file.name.toLowerCase()
    const buffer = Buffer.from(await file.arrayBuffer())
    let text = ''

    if (name.endsWith('.pdf')) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse/lib/pdf-parse') as (buf: Buffer) => Promise<{ text: string }>
      const result = await pdfParse(buffer)
      text = result.text
    } else if (name.endsWith('.docx')) {
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    } else if (name.endsWith('.doc')) {
      return Response.json({ error: '.doc format is not supported. Convert to .docx or .pdf first.' }, { status: 415 })
    } else {
      return Response.json({ error: 'Unsupported file type. Use PDF or DOCX.' }, { status: 415 })
    }

    if (!text.trim()) {
      return Response.json({ error: 'Could not extract text from file. Try a different format.' }, { status: 422 })
    }

    const parsed = parseResumeText(text)
    return Response.json(parsed)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[parse-resume]', message)
    return Response.json({ error: `Parsing failed: ${message}` }, { status: 500 })
  }
}
