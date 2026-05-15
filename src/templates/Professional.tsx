import { ResumeData } from '@/types/resume'

interface Props {
  data: ResumeData
}

export function ProfessionalTemplate({ data }: Props) {
  const { personal, summary, education, skills, projects, experience, certifications, achievements } = data

  return (
    <div className="bg-white text-gray-900 font-serif text-[11px] leading-relaxed min-h-[297mm] w-[210mm] flex">
      {/* Sidebar */}
      <div className="w-[35%] bg-slate-800 text-white p-5 space-y-5 shrink-0">
        <div>
          <h1 className="text-lg font-bold leading-tight">{personal.name || 'Your Name'}</h1>
        </div>

        <div className="space-y-1">
          <h3 className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold mb-2">Contact</h3>
          {personal.email && <div className="text-slate-300 break-all">{personal.email}</div>}
          {personal.phone && <div className="text-slate-300">{personal.phone}</div>}
          {personal.location && <div className="text-slate-300">{personal.location}</div>}
          {personal.linkedin && <div className="text-slate-300 break-all">{personal.linkedin}</div>}
          {personal.github && <div className="text-slate-300 break-all">{personal.github}</div>}
          {personal.website && <div className="text-slate-300 break-all">{personal.website}</div>}
        </div>

        {/* Skills in sidebar */}
        {skills.length > 0 && skills.some((s) => s.items.length > 0) && (
          <div>
            <h3 className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold mb-2">Skills</h3>
            {skills.filter((s) => s.items.length > 0).map((group) => (
              <div key={group.id} className="mb-2">
                <div className="text-slate-300 font-semibold text-[10px]">{group.category}</div>
                <div className="text-slate-400">{group.items.join(', ')}</div>
              </div>
            ))}
          </div>
        )}

        {/* Education in sidebar */}
        {education.length > 0 && education.some((e) => e.institution) && (
          <div>
            <h3 className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold mb-2">Education</h3>
            {education.filter((e) => e.institution).map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="text-white font-semibold">{edu.institution}</div>
                <div className="text-slate-300">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</div>
                <div className="text-slate-400 text-[10px]">{edu.start}{edu.end ? ` – ${edu.end}` : ''}</div>
                {edu.gpa && <div className="text-slate-400 text-[10px]">GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Certifications in sidebar */}
        {certifications.length > 0 && certifications.some((c) => c.name) && (
          <div>
            <h3 className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold mb-2">Certifications</h3>
            {certifications.filter((c) => c.name).map((cert) => (
              <div key={cert.id} className="mb-1">
                <div className="text-white text-[10px]">{cert.name}</div>
                <div className="text-slate-400">{cert.issuer} · {cert.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 space-y-5">
        {/* Summary */}
        {summary && (
          <section>
            <h2 className="font-bold uppercase text-[9px] tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-2">Summary</h2>
            <p className="text-gray-700">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && experience.some((e) => e.company) && (
          <section>
            <h2 className="font-bold uppercase text-[9px] tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-2">Experience</h2>
            {experience.filter((e) => e.company).map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">{exp.role}</span>
                  <span className="text-gray-500 text-[10px] shrink-0 ml-2">{exp.start}{exp.end ? ` – ${exp.end}` : ''}</span>
                </div>
                <div className="text-slate-600 italic mb-1">{exp.company}</div>
                <ul className="list-disc list-inside space-y-0.5 text-gray-700">
                  {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && projects.some((p) => p.name) && (
          <section>
            <h2 className="font-bold uppercase text-[9px] tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-2">Projects</h2>
            {projects.filter((p) => p.name).map((proj) => (
              <div key={proj.id} className="mb-2">
                <div className="font-bold">{proj.name}
                  {proj.tech.length > 0 && <span className="font-normal text-gray-500"> · {proj.tech.join(', ')}</span>}
                </div>
                <div className="text-gray-700">{proj.description}</div>
                {(proj.link || proj.repo) && (
                  <div className="text-slate-500 text-[10px]">{proj.link || proj.repo}</div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Achievements */}
        {achievements.filter(Boolean).length > 0 && (
          <section>
            <h2 className="font-bold uppercase text-[9px] tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-2">Achievements</h2>
            <ul className="list-disc list-inside space-y-0.5 text-gray-700">
              {achievements.filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
