const aiService = require('../services/ai.service');
const pdfService = require('../services/pdf.service');

// ✅ shared in-memory resume storage (hackathon-safe)
let resumeData = null;

// -------- MANUAL MODE --------
exports.renderManualForm = (req, res) => {
  res.render('manual', { title: 'Manual Resume Builder' });
};

exports.handleManualForm = (req, res) => {
  resumeData = req.body;
  resumeData.name = req.body.name || 'Manual Resume';
  return res.redirect('/resume/preview');
};

// -------- AI MODE --------
exports.renderAIForm = (req, res) => {
  res.render('ai', { title: 'AI Resume Builder' });
};

exports.handleAIForm = async (req, res) => {
  try {
    const aiText = await aiService.generateResume(req.body);

    resumeData = {
      name: req.body.role + ' Resume',
      email: '',
      summary: extractSection(aiText, 'SUMMARY'),
      skills: extractSection(aiText, 'SKILLS'),
      experience: extractSection(aiText, 'EXPERIENCE'),
      education: extractSection(aiText, 'EDUCATION')
    };

    return res.redirect('/resume/preview');
  } catch (err) {
    console.error('AI ERROR:', err);
    return res.status(500).send('AI generation failed');
  }
};

// -------- PREVIEW --------
exports.renderPreview = (req, res) => {
  if (!resumeData) {
    return res.redirect('/resume/manual');
  }

  return res.render('preview', {
    title: 'Resume Preview',
    resume: resumeData
  });
};

// -------- PDF DOWNLOAD --------
exports.downloadPDF = async (req, res) => {
  if (!resumeData) {
    return res.redirect('/resume/manual');
  }

  try {
    const filePath = await pdfService.generatePDF(resumeData);
    return res.download(filePath);
  } catch (err) {
    console.error('PDF ERROR:', err);
    return res.status(500).send('Failed to generate PDF');
  }
};

// -------- AI OUTPUT PARSER --------
function extractSection(text, section) {
  if (!text) return '';

  const normalized = text.replace(/\r/g, '');

  const regex = new RegExp(
    `(###\\s*${section}\\s*###|${section}:)([\\s\\S]*?)(?=###\\s*[A-Z ]+\\s*###|\\n[A-Z ]+:|$)`,
    'i'
  );

  const match = normalized.match(regex);
  return match ? match[2].trim() : '';
}
