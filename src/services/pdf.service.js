const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generatePDF = (resume) => {
  return new Promise((resolve, reject) => {
    const dataDir = path.join(__dirname, '../data');

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const fileName = resume.name.replace(/\s+/g, '_') + '.pdf';
    const filePath = path.join(dataDir, fileName);

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(22).text(resume.name);
    doc.moveDown();

    if (resume.summary) {
      doc.fontSize(14).text('Professional Summary');
      doc.moveDown(0.5);
      doc.fontSize(11).text(resume.summary);
      doc.moveDown();
    }

    if (resume.skills) {
      doc.fontSize(14).text('Skills');
      doc.moveDown(0.5);
      doc.fontSize(11).text(resume.skills);
      doc.moveDown();
    }

    if (resume.experience) {
      doc.fontSize(14).text('Experience');
      doc.moveDown(0.5);
      doc.fontSize(11).text(resume.experience);
      doc.moveDown();
    }

    if (resume.education) {
      doc.fontSize(14).text('Education');
      doc.moveDown(0.5);
      doc.fontSize(11).text(resume.education);
    }

    doc.end();

    // ✅ WAIT until file is fully written
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};
