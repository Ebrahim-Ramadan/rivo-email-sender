const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ramadanebrahim791@gmail.com', // Your Gmail address
    pass: 'your Application-specific password here', // Your Application-specific password 
  },
});

const resumeFile = fs.readFileSync('./my resume.pdf');
const subject = 'Frontend application';
const emailContentTemplate = `
<div>
  <div>
    Dear [Company Name]
  </div>
  <div>
    My name is Ebrahim Ramadan and I am a sophomore computer science student
    at E-JUST. As a web developer, I am seeking a junior-level position in a
    space that allows me to expand my skills and learn about software
    development.
  </div>
  <div>
    The work [Company Name] is doing is exactly the work I want to be part of. That
    is why I am applying for the position of Front-end developer. I look
    forward to hearing from you soon.
  </div>
  <div>Thank you,</div>
  <div>Ebrahim Ramadan</div>
</div>
`;

app.post('/send-email', (req, res) => {
  const { email, companyName } = req.body;

  if (!email || !companyName) {
    return res.status(400).json({ error: 'Email and company name are required' });
  }

  const emailContent = emailContentTemplate.replace(/\[Company Name\]/g, companyName);

  const mailOptions = {
    from: 'ramadanebrahim791@gmail.com',
    to: email,
    subject: subject,
    html: emailContent,
    attachments: [{ filename: 'resume.pdf', content: resumeFile }],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending email to ${companyName}: ${error}`);
      return res.status(500).json({ error: 'Error sending email' });
    } else {
      console.log(`Email sent to ${companyName}: ${info.response}`);
      return res.status(200).json({ message: `Email sent to ${companyName}` });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
