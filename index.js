const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { MongoCooneted } = require("./database/db");
const { NewsModel } = require("./model/newsletter");
require("dotenv").config();
const app = express();

app.use(express.json());

app.post("/subscribe", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Please provide a valid email" });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_EMAIL,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const html = `
    <html>
    <head>
        <title>Newsletter Subscription Confirmation</title>
    </head>
    <body>
        <div style="background-color: #f2f2f2; padding: 20px;">
            <h2>Newsletter Subscription Confirmed</h2>
            <p>Thank you for subscribing to our newsletter!</p>
            <p>You will now receive updates and news from us.</p>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: process.env.MAIL_EMAIL,
        to: email,
        subject: "Newsletter Subscription Confirmation",
        html: html,
    };


    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            console.error("Error sending confirmation email:", error);
            return res.status(500).json({ error: "Failed to send confirmation email" });
        }
        console.log("Confirmation email sent:", info.response);

        try {
            const emailnew = new NewsModel({
                email
            });
            await emailnew.save();
            res.status(200).json({ message: "Subscription confirmed. Check your email for confirmation." });
        } catch (error) {
            console.error("Error saving email to database:", error);
            return res.status(500).json({ error: "Failed to save email to database" });
        }
    });
});
app.post("/contact", async (req, res) => {
    const { name, email, phone, service, body } = req.body;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_EMAIL,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const html = `
    <html>
    <head>
        <title>Contact Form Submission</title>
    </head>
    <body>
        <div style="background-color: #f2f2f2; padding: 20px;">
            <h2>Contact Form Submission</h2>
            <p><strong>Name:</strong>Name: ${name}</p>
            <p><strong>Email:</strong>Email: ${email}</p>
            <p><strong>Phone:</strong>phone Number: ${phone}</p>
            <p><strong>Service:</strong>Service: ${service}</p>
            <p><strong>Message:</strong>${body}</p>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: process.env.MAIL_EMAIL,
        to: "vermadipanshu444@gmail.com",
        subject: "Contact Form Submission",
        html: html,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ error: "Failed to send email" });
        }
        console.log("Email sent:", info.response);
        res.status(200).json({ message: "Contact form submitted successfully" });
        
    });
});




app.listen(8000, async () => {
    await MongoCooneted();
    console.log(`Server is running at ${8000}`);
});
