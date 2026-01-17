const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resume.controller');

// Manual Resume
router.get('/manual', resumeController.renderManualForm);
router.post('/manual', resumeController.handleManualForm);

// AI Resume
router.get('/ai', resumeController.renderAIForm);
router.post('/ai', resumeController.handleAIForm);

// Preview
router.get('/preview', resumeController.renderPreview);

// Download PDF
router.get('/download', resumeController.downloadPDF);

module.exports = router;
