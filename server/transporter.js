const nodemailer = require('nodemailer');

module.exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'smart.feeder14@gmail.com',
    pass: 'eohn bvhe cqcj xsup'
  },
  secure: true
});