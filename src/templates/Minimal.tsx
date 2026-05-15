import { ResumeData } from '@/types/resume'

interface Props {
  data: ResumeData
}

export function MinimalTemplate({ data }: Props) {
  const { personal, summary, education, skills, projects, experience, certifications, achievements } = data

  return (
    <div className="bg-white text-gray-900 font-serif text-[11px] leading-relaxed p-10 min-h-[297mm] w-[210mm]">
      {/* Header */}
      <div className="text-center mb-6 border-b border-gray-300 pb-4">
        <h1 className="text-3xl font-bold tracking-tight mb-1">{personal.name || 'Your Name'}</h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-gray-600 text-[10px]">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
          {personal.github && <span>· {personal.github}</span>}
          {personal.website && <span>· {personal.website}</span>}
        </div>
      </div>

      <div className="space-y-4">
        {/* Summary */}
        {summary && (
          <section>
            <h2 className="font-bold uppercase tracking-widest text-[9px] text-gray-500 mb-2">Summary</h2>
            <p className="text-gray-700">{summary}</p>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && education.some((e) => e.institution) && (
          <section>
            <h2 className="font-bold uppercase tracking-widest text-[9px] text-gray-500 mb-2">Education</h2>
            {education.filter((e) => e.institution).map((edu) => (
              <div key={edu.id} className="flex justify-between mb-1.5">
                <div>
                  <div className="font-semibold">{edu.institution}</div>
                  <div className="text-gray-600">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
                </div>
                <div className="text-gray-500 text-right text-[10px] shrink-0 ml-4">{edu.start}{edu.end ? ` – ${edu.end}` : ''}</div>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && skills.some((s) => s.items.length > 0) && (
          <section>
            <h2 className="font-bold uppercase tracking-widest text-[9px] text-gray-500 mb-2">Skills</h2>
            <div className="space-y-0.5">
              {skills.filter((s) => s.items.length > 0).map((group) => (
                <div key={group.id}><span className="font-semibold">{group.category}: </span><span className="text-gray-700">{group.items.join(', ')}</span></div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && experience.some((e) => e.company) && (
          <section>
            <h2 className="font-bold uppercase tracking-widest text-[9px] text-gray-500 mb-2">Experience</h2>
            {experience.filter((e) => e.company).map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between">
                  <span className="font-semibold">{exp.role}, <span className="font-normal italic">{exp.company}</span></span>
                  <span className="text-gray-500 text-[10px] shrink-0 ml-4">{exp.start}{exp.end ? ` – ${exp.end}` : ''}</span>
                </div>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-gray-700">
                  {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && projects.some((p) => p.name) && (
          <section>
            <h2 className="font-bold uppercase tracking-widest text-[9px] text-gray-500 mb-2">Projects</h2>
            {projects.filter((p) => p.name).map((proj) => (
              <div key={proj.id} className="mb-2">
                <span className="font-semibold">{proj.name}</span>
                {proj.tech.length > 0 && <span className="text-gray-500"> ({proj.tech.join(', ')})</span>}
                {(proj.link || proj.repo) && <span className="text-gray-500"> · {proj.link || proj.repo}</span>}
                <div className="text-gray-700">{proj.description}</div>
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && certifications.some((c) => c.name) && (
          <section>
            <h2 className="font-bold uppercase tracking-widest text-[9px] text-gray-500 mb-2">Certifications</h2>
            {certifications.filter((c) => c.name).map((cert) => (
              <div key={cert.id} className="flex justify-between mb-1">
                <span>{cert.name} — <span className="italic">{cert.issuer}</span></span>
                <span className="text-gray-500 text-[10px]">{cert.date}</span>
              </div>
            ))}
          </section>
        )}

        {/* Achievements */}
        {achievements.filter(Boolean).length > 0 && (
          <section>
            <h2 className="font-bold uppercase tracking-widest text-[9px] text-gray-500 mb-2">Achievements</h2>
            <ul className="list-disc list-inside space-y-0.5 text-gray-700">
              {achievements.filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
