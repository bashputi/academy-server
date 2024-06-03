import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();


// transporter for email
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASS
    }
});

// Generic function to send email
export const email = (mailOptions) => {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

// Confirmation Email Template
export const contactUsEmail = (orderDetails) => {
    const { to, name, email: senderEmail, text, title } = orderDetails;

    const mailOptions = {
        from: `"SOLAR ACADEMY" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Order Confirmation - Thank You for Shopping with Us!',
        text:`
        New Form Submission from Solar Academy
    
        Dear Team,
    
        We have received a new form submission with the following details:
    
        Name: ${name}
        Email: ${senderEmail}
        Title: ${title}
        Message: 
        ${text}
    
        You can reply to the sender by emailing them at ${senderEmail}.
    
        Best regards,
        Solar Academy Team
      ` ,
        html:  `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h1 style="color: #4CAF50;">New Form Submission from Solar Academy</h1>
          <p>Dear Team,</p>
          <p>We have received a new form submission with the following details:</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${senderEmail}" style="color: #4CAF50;">${senderEmail}</a></p>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #ddd; white-space: pre-wrap;">
            ${text}
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 0.9em; color: #777;">
            You can reply to the sender by clicking 
            <a href="mailto:${senderEmail}" style="color: #4CAF50;">here</a>.
          </p>
          <p style="font-size: 0.9em; color: #777;">
            Best regards,<br>
            Solar Academy Team
          </p>
        </div>
      `
    };
    email(mailOptions);
};