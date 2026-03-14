require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Bank Transaction System" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(to, name) {
  const subject = 'Welcome to Bank Transaction System';
  const text = `Hello ${name},\n\nThank you for registering with our Bank Transaction System. We are excited to have you on board!\n\nBest regards,\nBank Transaction System Team`;
  const html = `<p>Hello ${name},</p><p>Thank you for registering with our Bank Transaction System. We are excited to have you on board!</p><p>Best regards,<br>Bank Transaction System Team</p>`;
  
  await sendEmail(to, subject, text, html);
}

async function sendLoginEmail(to, name) {
  const subject = 'Login Alert - Bank Transaction System';
  const text = `Hello ${name},\n\nA successful login was detected on your Bank Transaction System account. If this was you, no action is needed. If you do not recognize this login, please reset your password immediately.\n\nBest regards,\nBank Transaction System Team`;
  const html = `<p>Hello ${name},</p><p>A successful login was detected on your Bank Transaction System account.</p><p>If this was you, no action is needed. If you do not recognize this login, please reset your password immediately.</p><p>Best regards,<br>Bank Transaction System Team</p>`;

  await sendEmail(to, subject, text, html);
}

async function sendTransactionEmail(to, name, amount, fromAccount, toAccount) {
  const subject = 'Transaction Alert - Bank Transaction System';
  const text = `Hello ${name},\n\nA transaction of $${amount} has been made from account ${fromAccount} to account ${toAccount}. If you did not authorize this transaction, please contact our support team immediately.\n\nBest regards,\nBank Transaction System Team`;
  const html = `<p>Hello ${name},</p><p>A transaction of $${amount} has been made from account ${fromAccount} to account ${toAccount}.</p><p>If you did not authorize this transaction, please contact our support team immediately.</p><p>Best regards,<br>Bank Transaction System Team</p>`;

  await sendEmail(to, subject, text, html);
}

async function sendReversalEmail(to, name, amount, fromAccount, toAccount) {
  const subject = 'Transaction Reversal Alert - Bank Transaction System';
  const text = `Hello ${name},\n\nA transaction reversal of $${amount} has been processed for a transaction from account ${fromAccount} to account ${toAccount}. If you did not authorize this reversal, please contact our support team immediately.\n\nBest regards,\nBank Transaction System Team`;
  const html = `<p>Hello ${name},</p><p>A transaction reversal of $${amount} has been processed for a transaction from account ${fromAccount} to account ${toAccount}.</p><p>If you did not authorize this reversal, please contact our support team immediately.</p><p>Best regards,<br>Bank Transaction System Team</p>`;

  await sendEmail(to, subject, text, html);
}

async function sendPasswordResetEmail(to, name, resetLink) {
  const subject = 'Reset Your Password - Bank Transaction System';
  const text = `Hello ${name},\n\nWe received a request to reset your password. Use the link below to set a new password:\n${resetLink}\n\nThis link will expire in 15 minutes. If you did not request this, please ignore this email.\n\nBest regards,\nBank Transaction System Team`;
  const html = `<p>Hello ${name},</p><p>We received a request to reset your password.</p><p>Use the link below to set a new password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>This link will expire in 15 minutes.</p><p>If you did not request this, please ignore this email.</p><p>Best regards,<br>Bank Transaction System Team</p>`;

  await sendEmail(to, subject, text, html);
}

module.exports = { sendEmail, sendRegistrationEmail, sendLoginEmail, sendTransactionEmail, sendReversalEmail, sendPasswordResetEmail };