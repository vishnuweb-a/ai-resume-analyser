const axios = require('axios');

exports.generateResume = async ({ role, skills, experience, education }) => {
  const prompt = `
Create an ATS-friendly resume.

Job Role: ${role}
Skills: ${skills}
Experience: ${experience}
Education: ${education}

Return output strictly in this format:

SUMMARY:
<text>

SKILLS:
- skill 1
- skill 2

EXPERIENCE:
<text>

EDUCATION:
<text>
`;

  const response = await axios.post(
    'http://localhost:11434/api/generate',
    {
      model: 'phi3',
      prompt,
      stream: false
    }
  );

  return response.data.response;
};
