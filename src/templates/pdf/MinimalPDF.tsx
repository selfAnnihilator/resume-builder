import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'

const s = StyleSheet.create({
  page: { fontFamily: 'Times-Roman', fontSize: 9, color: '#111827', backgroundColor: '#ffffff', padding: '32 36' },
  header: { textAlign: 'center', borderBottom: '0.5 solid #d1d5db', paddingBottom: 10, marginBottom: 14 },
  name: { fontSize: 22, fontFamily: 'Times-Bold', marginBottom: 4 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, color: '#6b7280', fontSize: 8 },
  section: { marginBottom: 11 },
  sectionTitle: { fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1.5, color: '#9ca3af', marginBottom: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  bold: { fontFamily: 'Times-Bold' },
  italic: { fontFamily: 'Times-Italic' },
  muted: { color: '#6b7280', fontSize: 8 },
  bullet: { flexDirection: 'row', marginBottom: 1.5 },
  bulletDot: { width: 10 },
  bulletText: { flex: 1, color: '#374151' },
  mb8: { marginBottom: 8 },
})

interface Props { data: ResumeData }

export function MinimalPDF({ data }: Props) {
  const { personal, summary, education, skills, projects, experience, certifications, achievements } = data

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.name}>{personal.name || 'Your Name'}</Text>
          <View style={s.meta}>
            {personal.email && <Text>{personal.email}</Text>}
            {personal.phone && <Text>· {personal.phone}</Text>}
            {personal.location && <Text>· {personal.location}</Text>}
            {personal.linkedin && <Text>· {personal.linkedin}</Text>}
            {personal.github && <Text>· {personal.github}</Text>}
            {personal.website && <Text>· {personal.website}</Text>}
          </View>
        </View>

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
                  <View style={{ flex: 1 }}>
                    <Text style={s.bold}>{edu.institution}</Text>
                    <Text style={s.muted}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</Text>
                  </View>
                  <Text style={s.muted}>{edu.start}{edu.end ? ` – ${edu.end}` : ''}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.some(g => g.items.length > 0) && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Skills</Text>
            {skills.filter(g => g.items.length > 0).map(group => (
              <View key={group.id} style={{ flexDirection: 'row', marginBottom: 2 }}>
                <Text style={{ ...s.bold, minWidth: 75 }}>{group.category}: </Text>
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
                  <Text><Text style={s.bold}>{exp.role}</Text>, <Text style={s.italic}>{exp.company}</Text></Text>
                  <Text style={s.muted}>{exp.start}{exp.end ? ` – ${exp.end}` : ''}</Text>
                </View>
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
                <Text>
                  <Text style={s.bold}>{proj.name}</Text>
                  {proj.tech.length > 0 && <Text style={s.muted}> ({proj.tech.join(', ')})</Text>}
                  {(proj.link || proj.repo) && <Text style={s.muted}> · {proj.link || proj.repo}</Text>}
                </Text>
                <Text style={{ color: '#374151' }}>{proj.description}</Text>
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
                <Text>{cert.name} — <Text style={s.italic}>{cert.issuer}</Text></Text>
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
      </Page>
    </Document>
  )
}
