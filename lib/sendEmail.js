// lib/sendEmail.js
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html) => {
  const msg = {
    to,
    from: 'your-verified-email@example.com', // Replace with your SendGrid verified sender
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent to', to);
  } catch (error) {
    console.error('SendGrid Error:', error.message);
    throw error;
  }
};

export default sendEmail;