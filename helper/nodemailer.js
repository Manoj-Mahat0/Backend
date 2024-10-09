let nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "contact.webmindsindia@gmail.com",
    pass: "sdlzmunejfenwzre",
  },
});

let receiver = ["katkalesushmit@gmail.com", "shivambhatt2143@gmail.com"];

let sendWelcomeMailWithPassword = async (receiver, email, password) => {
  try {
    let mailOptions = {
      from: '"Web Minds India" <contact.webmindsindia@gmail.com>',
      to: receiver,
      subject: `Sample Welcome mail`,
      text: `userEmail: ${email}
          userPassword: ${password}
          These are you temporary account details you please change your password using link: https://hello.com`,
      html: `
  <table bgcolor="#fafafa" style=" width: 100%!important; height: 100%; background-color: #fafafa; padding: 20px; font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, 'Lucida Grande', sans-serif;  font-size: 100%; line-height: 1.6;">
  <tr>
  <td></td>
  <td bgcolor="#FFFFFF" style="border: 1px solid #eeeeee; background-color: #ffffff; border-radius:5px; display:block!important; max-width:600px!important; margin:0 auto!important; clear:both!important;"><div style="padding:20px; max-width:600px; margin:0 auto; display:block;">
  <table style="width: 100%;">
  <tr>
  <td>
  <h1 style="font-weight: 200; font-size: 36px; margin: 20px 0 30px 0; color: #333333;">Temporary account details...</h1>
  <p style="margin-bottom: 10px; font-weight: normal; font-size:16px; color: #333333;">userEmail: ${email}</p>
  <p style="font-weight: normal; font-size: 16px; margin: 20px 0; color: #333333;">userPassword: ${password}</h2>
  <p style="font-weight: normal; font-size: 16px; margin: 20px 0; color: #333333;">These are you temporary account details you please change your password using link:: <a href="https://hello.com">https://hello.com</a></h2>
  </td>
  </tr>
  </table>
  </div></td>
  <td></td>
  </tr>
  </table>
      `,
    };

    transporter.sendMail(mailOptions, (err, val) => {
      if (err) {
        return false;
      } else {
        return true;
      }
    });
  } catch (e) {
    return false;
  }
}

let sendMail = async (req, res) => {
  try {
    let mailOptions = {
      from: '"Web Minds India" <contact.webmindsindia@gmail.com>',
      to: receiver,
      subject: `Check Now, Someone Filled Query Form At dineshmentoringacademy.com`,
      text: `Name: ${req.body.name}
          Phone: ${req.body.phone}
          Email: ${req.body.email}
          Message: ${req.body.message}`,
      html: `
  <table bgcolor="#fafafa" style=" width: 100%!important; height: 100%; background-color: #fafafa; padding: 20px; font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, 'Lucida Grande', sans-serif;  font-size: 100%; line-height: 1.6;">
  <tr>
  <td></td>
  <td bgcolor="#FFFFFF" style="border: 1px solid #eeeeee; background-color: #ffffff; border-radius:5px; display:block!important; max-width:600px!important; margin:0 auto!important; clear:both!important;"><div style="padding:20px; max-width:600px; margin:0 auto; display:block;">
  <table style="width: 100%;">
  <tr>
  <td><p style="text-align: center; display: block;  padding-bottom:20px;  margin-bottom:20px; border-bottom:1px solid #dddddd;"><img src="https://source.unsplash.com/random/300×300/?education,coaching,study,professionals,hybrid" width="300"/></p>
  <h1 style="font-weight: 200; font-size: 36px; margin: 20px 0 30px 0; color: #333333;">Contact Form Submission...</h1>
  <p style="margin-bottom: 10px; font-weight: normal; font-size:16px; color: #333333;">Name: ${req.body.name}</p>
  <p style="font-weight: normal; font-size: 16px; margin: 20px 0; color: #333333;">Phone: <a href="tel:${req.body.phone}">${req.body.phone}</a></h2>
  <p style="font-weight: normal; font-size: 16px; margin: 20px 0; color: #333333;">Email: <a href="mailto:${req.body.email}">${req.body.email}</a></h2>
  <p style="font-weight: normal; font-size: 16px; margin: 20px 0; color: #333333;">Message: ${req.body.message}</h2>
  <p style="text-align: center; display: block; padding-top:20px; font-weight: bold; margin-top:30px; color: #666666; border-top:1px solid #dddddd;">Web Minds India</p></td>
  </tr>
  </table>
  </div></td>
  <td></td>
  </tr>
  </table>
      `,
    };

    transporter.sendMail(mailOptions, (err, val) => {
      if (err) {

        return { status: 500, data: err };
      } else {
        return { status: 200, data: val };
      }
    });
  } catch (e) {

    e.errors
      ? res.status(500).json(e.errors)
      : res.status(500).json("Internal Server Error");
  }
};


module.exports = {
  sendMail,
  sendWelcomeMailWithPassword,
};
