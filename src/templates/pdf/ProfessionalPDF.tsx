import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9, color: '#111827', backgroundColor: '#ffffff', flexDirection: 'row' },
  sidebar: { width: '35%', backgroundColor: '#1e293b', color: '#ffffff', padding: '24 14', gap: 14 },
  sidebarName: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginBottom: 12, lineHeight: 1.3 },
  sidebarSection: { marginBottom: 12 },
  sidebarLabel: { fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1.2, color: '#94a3b8', marginBottom: 5 },
  sidebarText: { color: '#cbd5e1', fontSize: 8, marginBottom: 2 },
  sidebarBold: { color: '#ffffff', fontFamily: 'Helvetica-Bold', fontSize: 8.5, marginBottom: 1 },
  sidebarMuted: { color: '#94a3b8', fontSize: 7.5 },
  main: { flex: 1, padding: '24 18' },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1.2, color: '#64748b', borderBottom: '0.5 solid #e2e8f0', paddingBottom: 3, marginBottom: 7 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  bold: { fontFamily: 'Helvetica-Bold' },
  italic: { fontFamily: 'Helvetica-Oblique', color: '#64748b' },
  muted: { color: '#6b7280', fontSize: 8 },
  bullet: { flexDirection: 'row', marginBottom: 1.5 },
  bulletDot: { width: 10 },
  bulletText: { flex: 1, color: '#374151' },
  mb8: { marginBottom: 8 },
})

interface Props { data: ResumeData }

export function ProfessionalPDF({ data }: Props) {
  const { personal, summary, education, skills, projects, experience, certifications, achievements } = data

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Sidebar */}
        <View style={s.sidebar}>
          <Text style={s.sidebarName}>{personal.name || 'Your Name'}</Text>

          <View style={s.sidebarSection}>
            <Text style={s.sidebarLabel}>Contact</Text>
            {personal.email && <Text style={s.sidebarText}>{personal.email}</Text>}
            {personal.phone && <Text style={s.sidebarText}>{personal.phone}</Text>}
            {personal.location && <Text style={s.sidebarText}>{personal.location}</Text>}
            {personal.linkedin && <Text style={s.sidebarText}>{personal.linkedin}</Text>}
            {personal.github && <Text style={s.sidebarText}>{personal.github}</Text>}
            {personal.website && <Text style={s.sidebarText}>{personal.website}</Text>}
          </View>

          {skills.some(g => g.items.length > 0) && (
            <View style={s.sidebarSection}>
              <Text style={s.sidebarLabel}>Skills</Text>
              {skills.filter(g => g.items.length > 0).map(group => (
                <View key={group.id} style={{ marginBottom: 5 }}>
                  <Text style={s.sidebarBold}>{group.category}</Text>
                  <Text style={s.sidebarMuted}>{group.items.join(', ')}</Text>
                </View>
              ))}
            </View>
          )}

          {education.some(e => e.institution) && (
            <View style={s.sidebarSection}>
              <Text style={s.sidebarLabel}>Education</Text>
              {education.filter(e => e.institution).map(edu => (
                <View key={edu.id} style={{ marginBottom: 6 }}>
                  <Text style={s.sidebarBold}>{edu.institution}</Text>
                  <Text style={s.sidebarText}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</Text>
                  <Text style={s.sidebarMuted}>{edu.start}{edu.end ? ` – ${edu.end}` : ''}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</Text>
                </View>
              ))}
            </View>
          )}

          {certifications.some(c => c.name) && (
            <View style={s.sidebarSection}>
              <Text style={s.sidebarLabel}>Certifications</Text>
              {certifications.filter(c => c.name).map(cert => (
                <View key={cert.id} style={{ marginBottom: 4 }}>
                  <Text style={s.sidebarBold}>{cert.name}</Text>
                  <Text style={s.sidebarMuted}>{cert.issuer} · {cert.date}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Main */}
        <View style={s.main}>
          {!!summary && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Summary</Text>
              <Text style={{ color: '#374151' }}>{summary}</Text>
            </View>
          )}

          {experience.some(e => e.company) && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Experience</Text>
              {experience.filter(e => e.company).map(exp => (
                <View key={exp.id} style={s.mb8}>
                  <View style={s.row}>
                    <Text style={s.bold}>{exp.role}</Text>
                    <Text style={s.muted}>{exp.start}{exp.end ? ` – ${exp.end}` : ''}</Text>
                  </View>
                  <Text style={{ ...s.italic, marginBottom: 3 }}>{exp.company}</Text>
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

          {projects.some(p => p.name) && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Projects</Text>
              {projects.filter(p => p.name).map(proj => (
                <View key={proj.id} style={s.mb8}>
                  <Text>
                    <Text style={s.bold}>{proj.name}</Text>
                    {proj.tech.length > 0 && <Text style={s.muted}> · {proj.tech.join(', ')}</Text>}
                  </Text>
                  <Text style={{ color: '#374151' }}>{proj.description}</Text>
                  {(proj.link || proj.repo) && <Text style={s.muted}>{proj.link || proj.repo}</Text>}
                </View>
              ))}
            </View>
          )}

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
