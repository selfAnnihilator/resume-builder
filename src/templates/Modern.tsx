import { ResumeData } from '@/types/resume'

interface Props {
  data: ResumeData
}

export function ModernTemplate({ data }: Props) {
  const { personal, summary, education, skills, projects, experience, certifications, achievements } = data

  return (
    <div className="bg-white text-gray-900 font-sans text-[11px] leading-relaxed p-8 min-h-[297mm] w-[210mm]">
      {/* Header */}
      <div className="bg-indigo-600 text-white px-6 py-5 -mx-8 -mt-8 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{personal.name || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-indigo-100 text-[10px]">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.github && <span>{personal.github}</span>}
          {personal.website && <span>{personal.website}</span>}
        </div>
      </div>

      <div className="space-y-5">
        {/* Summary */}
        {summary && (
          <section>
            <h2 className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest border-b border-indigo-200 pb-1 mb-2">Summary</h2>
            <p className="text-gray-700">{summary}</p>
          </section>
        )}
        {/* Education */}
        {education.length > 0 && education.some((e) => e.institution) && (
          <section>
            <h2 className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest border-b border-indigo-200 pb-1 mb-2">Education</h2>
            {education.filter((e) => e.institution).map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold">{edu.institution}</span>
                  <span className="text-gray-500 text-[10px]">{edu.start}{edu.end ? ` – ${edu.end}` : ''}</span>
                </div>
                <div className="text-gray-600">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && skills.some((s) => s.items.length > 0) && (
          <section>
            <h2 className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest border-b border-indigo-200 pb-1 mb-2">Skills</h2>
            <div className="space-y-1">
              {skills.filter((s) => s.items.length > 0).map((group) => (
                <div key={group.id} className="flex gap-2">
                  <span className="font-semibold min-w-[80px]">{group.category}:</span>
                  <span className="text-gray-700">{group.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && experience.some((e) => e.company) && (
          <section>
            <h2 className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest border-b border-indigo-200 pb-1 mb-2">Experience</h2>
            {experience.filter((e) => e.company).map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold">{exp.role}</span>
                  <span className="text-gray-500 text-[10px]">{exp.start}{exp.end ? ` – ${exp.end}` : ''}</span>
                </div>
                <div className="text-gray-600 mb-1">{exp.company}</div>
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
            <h2 className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest border-b border-indigo-200 pb-1 mb-2">Projects</h2>
            {projects.filter((p) => p.name).map((proj) => (
              <div key={proj.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold">{proj.name}</span>
                  <div className="flex gap-2 text-indigo-500 text-[10px]">
                    {proj.link && <span>{proj.link}</span>}
                    {proj.repo && <span>{proj.repo}</span>}
                  </div>
                </div>
                {proj.tech.length > 0 && <div className="text-gray-500 text-[10px] mb-0.5">{proj.tech.join(' · ')}</div>}
                <div className="text-gray-700">{proj.description}</div>
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && certifications.some((c) => c.name) && (
          <section>
            <h2 className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest border-b border-indigo-200 pb-1 mb-2">Certifications</h2>
            {certifications.filter((c) => c.name).map((cert) => (
              <div key={cert.id} className="flex justify-between mb-1">
                <span className="font-semibold">{cert.name} <span className="font-normal text-gray-600">— {cert.issuer}</span></span>
                <span className="text-gray-500 text-[10px]">{cert.date}</span>
              </div>
            ))}
          </section>
        )}

        {/* Achievements */}
        {achievements.filter(Boolean).length > 0 && (
          <section>
            <h2 className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest border-b border-indigo-200 pb-1 mb-2">Achievements</h2>
            <ul className="list-disc list-inside space-y-0.5 text-gray-700">
              {achievements.filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
