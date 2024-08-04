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
    Dear [clientName]
  </div>
  <div>
  You've got great taste! We're thrilled you chose RIVO.
  </div>
  <div>
  Your order, [orderID], is now under our care and is being processed by our crew.
  </div>
  <div>We'll notify you by email when your items are dispatched and ready for delivery. For precise delivery dates or to track and manage your order, please check your 'Order Summary'.</div>
  <a href='https://e-commerce-myass.vercel.app/orders'>View Order Summary</a>
</div>
`;

app.post('/send-email', (req, res) => {
  const { email, orderID, clientName } = req.body;

  if (!email || !clientName || !orderID) {
    return res.status(400).json({ error: 'Email, orderID, and clientName are required' });
  }

  let emailContent = emailContentTemplate.replace(/\[clientName\]/g, clientName);
  emailContent = emailContent.replace(/\[orderID\]/g, orderID);

  const mailOptions = {
    from: 'ramadanebrahim791@gmail.com',
    to: email,
    subject: subject,
    html: emailContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending email to ${email}: ${error}`);
      return res.status(500).json({ error: 'Error sending email' });
    } else {
      console.log(`Email sent to ${email}: ${info.response}`);
      return res.status(200).json({ message: `Email sent to ${email}` });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
