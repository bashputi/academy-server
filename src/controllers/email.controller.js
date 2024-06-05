import { contactUsEmail } from "../utils/email.js";
import catchAsync from '../utils/catchAsync.js';


// sent email to admin from frontend
const sendEmail = catchAsync(async (req, res) => {
    const { name, email, text, title } = req.body;
    const userData = {
        to: 'rimuislam36@gmail.com',
        name: name,
        text: text,
        title: title,
        email: email
    };
    contactUsEmail(userData); 
    res.status(200).json({ success: true, message: "Email sent successfully" });
});


  export {
    sendEmail,

  }