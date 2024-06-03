import { contactUsEmail } from "../utils/email.js";
import catchAsync from '../utils/catchAsync.js';


// sent email to admin from frontend
const sendEmail = catchAsync(async (req, res) => {
    const { name, email, text, title } = req.body;
    const userData = {
        to: email,
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