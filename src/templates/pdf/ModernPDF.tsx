import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9, color: '#111827', backgroundColor: '#ffffff' },
  header: { backgroundColor: '#4f46e5', color: '#ffffff', padding: '20 24 16 24' },
  headerName: { fontSize: 18, fontFamily: 'Helvetica-Bold', marginBottom: 5 },
  headerMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, color: '#c7d2fe', fontSize: 8 },
  body: { padding: '14 24' },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: 1.2, borderBottom: '0.5 solid #c7d2fe', paddingBottom: 3, marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  bold: { fontFamily: 'Helvetica-Bold' },
  muted: { color: '#6b7280', fontSize: 8 },
  bullet: { flexDirection: 'row', marginBottom: 1.5 },
  bulletDot: { width: 10, color: '#374151' },
  bulletText: { flex: 1, color: '#374151' },
  tag: { color: '#6b7280', fontSize: 8 },
  link: { color: '#4f46e5', fontSize: 8 },
  mb2: { marginBottom: 2 },
  mb8: { marginBottom: 8 },
})

interface Props { data: ResumeData }

export function ModernPDF({ data }: Props) {
  const { personal, summary, education, skills, projects, experience, certifications, achievements } = data

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerName}>{personal.name || 'Your Name'}</Text>
          <View style={s.headerMeta}>
            {personal.email && <Text>{personal.email}</Text>}
            {personal.phone && <Text>{personal.phone}</Text>}
            {personal.location && <Text>{personal.location}</Text>}
            {personal.linkedin && <Text>{personal.linkedin}</Text>}
            {personal.github && <Text>{personal.github}</Text>}
            {personal.website && <Text>{personal.website}</Text>}
          </View>
        </View>

        <View style={s.body}>
          {/* Summary */}
          {!!summary && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Summary</Text>
              <Text style={{ color: '#374151' }}>{summary}</Text>
            </View>
          )}

          {/* Education */}
          {education.some(e => e.institution) && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Education</Text>
              {education.filter(e => e.institution).map(edu => (
                <View key={edu.id} style={s.mb8}>
                  <View style={s.row}>
                    <Text style={s.bold}>{edu.institution}</Text>
                    <Text style={s.muted}>{edu.start}{edu.end ? ` – ${edu.end}` : ''}</Text>
                  </View>
                  <Text style={s.muted}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Skills */}
          {skills.some(s => s.items.length > 0) && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Skills</Text>
              {skills.filter(g => g.items.length > 0).map(group => (
                <View key={group.id} style={{ flexDirection: 'row', marginBottom: 2 }}>
                  <Text style={{ ...s.bold, minWidth: 80 }}>{group.category}: </Text>
                  <Text style={{ color: '#374151', flex: 1 }}>{group.items.join(', ')}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Experience */}
          {experience.some(e => e.company) && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Experience</Text>
              {experience.filter(e => e.company).map(exp => (
                <View key={exp.id} style={s.mb8}>
                  <View style={s.row}>
                    <Text style={s.bold}>{exp.role}</Text>
                    <Text style={s.muted}>{exp.start}{exp.end ? ` – ${exp.end}` : ''}</Text>
                  </View>
                  <Text style={{ ...s.muted, marginBottom: 3 }}>{exp.company}</Text>
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <View key={i} style={s.bullet}>
                      <Text style={s.bulletDot}>•</Text>
                      <Text style={s.bulletText}>{b}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {projects.some(p => p.name) && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Projects</Text>
              {projects.filter(p => p.name).map(proj => (
                <View key={proj.id} style={s.mb8}>
                  <View style={s.row}>
                    <Text style={s.bold}>{proj.name}</Text>
                    {(proj.link || proj.repo) && <Text style={s.link}>{proj.link || proj.repo}</Text>}
                  </View>
                  {proj.tech.length > 0 && <Text style={s.tag}>{proj.tech.join(' · ')}</Text>}
                  <Text style={{ color: '#374151', marginTop: 1 }}>{proj.description}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Certifications */}
          {certifications.some(c => c.name) && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Certifications</Text>
              {certifications.filter(c => c.name).map(cert => (
                <View key={cert.id} style={{ ...s.row, marginBottom: 3 }}>
                  <Text><Text style={s.bold}>{cert.name}</Text> — {cert.issuer}</Text>
                  <Text style={s.muted}>{cert.date}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Achievements */}
          {achievements.filter(Boolean).length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Achievements</Text>
              {achievements.filter(Boolean).map((a, i) => (
                <View key={i} style={s.bullet}>
                  <Text style={s.bulletDot}>•</Text>
                  <Text style={s.bulletText}>{a}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}
