import type { StudentResultCard } from '../types/academic-performance.types'

function safeFilenamePart(value: string) {
  return (
    value
      .trim()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-|-$/g, '') || 'result'
  )
}

export async function downloadResultCard(resultCard: StudentResultCard) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])
  const document = new jsPDF({ unit: 'mm', format: 'a4' })

  document.setFont('helvetica', 'bold')
  document.setFontSize(16)
  document.text('NCBA&E University Portal', 105, 18, { align: 'center' })
  document.setFontSize(13)
  document.text('Semester Result Card', 105, 26, { align: 'center' })

  document.setFont('helvetica', 'normal')
  document.setFontSize(10)
  document.text(`Student: ${resultCard.student.name}`, 14, 39)
  document.text(`Registration number: ${resultCard.student.registrationNumber}`, 14, 46)
  document.text(`Program: ${resultCard.program.name} (${resultCard.program.code})`, 14, 53)
  document.text(
    `Semester: ${resultCard.semester.name} · ${resultCard.semester.academicYear}`,
    14,
    60
  )

  autoTable(document, {
    startY: 69,
    head: [['Code', 'Course title', 'Credit hours', 'Marks', 'Grade', 'Grade point']],
    body: resultCard.courses.map((course) => [
      course.code,
      course.title,
      String(course.creditHours),
      `${course.marks.toFixed(2)}%`,
      course.grade,
      course.gradePoint.toFixed(2),
    ]),
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 2.5 },
    columnStyles: {
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
    },
  })

  const tableEnd = (document as typeof document & { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY
  document.setFont('helvetica', 'bold')
  document.text(`Total credit hours: ${resultCard.totalCreditHours}`, 14, tableEnd + 10)
  document.text(`Semester GPA: ${resultCard.gpa.toFixed(2)}`, 196, tableEnd + 10, {
    align: 'right',
  })
  document.setFont('helvetica', 'normal')
  document.setFontSize(8)
  document.text('Only HOD-approved results are included in this result card.', 105, 285, {
    align: 'center',
  })

  document.save(
    `${safeFilenamePart(resultCard.student.registrationNumber)}-${safeFilenamePart(resultCard.semester.name)}-result-card.pdf`
  )
}
