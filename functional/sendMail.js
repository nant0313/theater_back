var sendMail = module.exports = {};
const dotenv = require('dotenv');
dotenv.config({
    path: '../.env'
});
const nodemailer = require('nodemailer');

sendMail.main = async (subject, content) => {
    let transporter = nodemailer.createTransport({
        // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
        service: 'gmail',
        // host를 gmail로 설정
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            // Gmail 주소 입력, 'testmail@gmail.com'
            user: process.env.GMAIL_EMAIL,
            // Gmail 패스워드 입력
            pass: process.env.GMAIL_PW
        },
    });
    let info = await transporter.sendMail({
        // 보내는 곳의 이름과, 메일 주소를 입력
        from: `"영화관" <${"nant0313@gmail.com"}>`,
        // 받는 곳의 메일 주소를 입력
        to: "nant0313@gmail.com",
        // 보내는 메일의 제목을 입력
        subject: subject,
        // 보내는 메일의 내용을 입력
        // text: 일반 text로 작성된 내용
        // html: html로 작성된 내용
        text: content,
        // html: `<b>${"hayom"}</b>`,
    });
};
