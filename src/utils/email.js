import nodemailer from "nodemailer";
import { ApiResponse } from "./apiResponse.js";
import { ApiErrors } from "./apiError.js";
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
export const sendEmail = async (mailOptions) => {
  try {
      const info = await transporter.sendMail(mailOptions);
      return new ApiResponse(200, info.response, 'Email sent successfully');
  } catch (error) {
      throw new ApiErrors(500, 'Error sending email');
  }
};


// send otp to the user 
export const sendOTP = (email, otp, name) => {

  const mailOptions = {
    from: `"SOLAR ACADEMY" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP for Verification',
    text: `
    Dear ${name},
    
    Your OTP for verification is: ${otp}
    
    Please use this OTP to complete your verification process.
    
    Best regards,
    Solar Academy Team
    `,
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #4CAF50;">OTP Verification from Solar Academy</h1>
        <p>Dear ${name},</p>
        <p>Your OTP for verification is:</p>
        <div style="font-size: 1.2em; color: #4CAF50; font-weight: bold;">${otp}</div>
        <p>Please use this OTP to complete your verification process.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 0.9em; color: #777;">
            Best regards,<br>
            Solar Academy Team
        </p>
    </div> `
  };
  sendEmail(mailOptions);

};

//reset password Email Template
export const resetPassword = (email, url, name) => {

  const mailOptions = {
      from: `<${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      text: `
      Dear ${name},

      We received a request to reset the password for your Solar Academy account. To complete the process, please click on the link below within the next 10 minutes:

      ${url}

      If you did not request a password reset, please disregard this email. Your password will remain unchanged.

      For your security, please do not share this link with anyone.

      Best regards,
      Solar Academy Team
            `,
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <p>Dear ${name},</p>
                <p>We received a request to reset the password for your Solar Academy account. To complete the process, please click on the link below within the next <span style="font-weight: bold; color: #e74c3c;">10 minutes </span>:</p>
                <p> <a href="${url}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #1a73e8; text-decoration: none; border-radius: 5px;">
                Reset your password
                </a></p>
                <p>If you did not request a password reset, please disregard this email. Your password will remain unchanged.</p>
                <p>For your security, please do not share this link with anyone.</p>
                <p style="font-size: 0.9em; color: #777;">
                    Best regards,<br>
                    Solar Academy Team
                </p>
            </div>
            `
  };
  sendEmail(mailOptions);

};


// Contact us Email Template
export const contactUsEmail = (userdetails) => {
    const { to, name, email: senderEmail, text, title } = userdetails;

    const mailOptions = {
        from: `"SOLAR ACADEMY" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Contact us section mail!',
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
    sendEmail(mailOptions);
};