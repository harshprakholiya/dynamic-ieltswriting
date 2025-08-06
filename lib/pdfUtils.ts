import { jsPDF } from 'jspdf';

export type PDFPayload = {
  examTitle: string;
  part1Question: string;
  part2Question: string;
  part1Answer: string;
  part2Answer: string;
  part1WordCount: number;
  part2WordCount: number;
};

export function downloadPDF({
  examTitle,
  part1Question,
  part2Question,
  part1Answer,
  part2Answer,
  part1WordCount,
  part2WordCount,
}: PDFPayload) {
  const doc = new jsPDF();
  doc.setFont('helvetica');
  doc.setFontSize(10);

  const margin = 10;
  const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
  let y = margin;

  const addText = (label: string, text: string) => {
    if (y > 270) {
      doc.addPage();
      doc.setFont('helvetica');
      doc.setFontSize(10);
      y = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, y);
    y += 6;

   doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, pageWidth);
    lines.forEach((line: string) => {
      if (y > 270) {
        doc.addPage();
        doc.setFont('helvetica');
        doc.setFontSize(10);
        y = margin;
      }
      doc.text(line, margin, y);
      y += 6;
    });

    y += 4;
  };

  addText('Exam Title:', examTitle);
  addText('Part 1 Question:', part1Question);
  addText('Part 1 Word Count:', part1WordCount.toString());
  addText('Part 1 Answer:', part1Answer);

  addText('Part 2 Question:', part2Question);
  addText('Part 2 Word Count:', part2WordCount.toString());
  addText('Part 2 Answer:', part2Answer);

  doc.save(`${examTitle}.pdf`);
}
