import axios from 'axios';

import {createVerificationToken} from './user';

function sendEmail(to, body) {
  const apiKey = process.env.MAILGUN_API_KEY;
  if (!apiKey) {
    console.log('MAILGUN_API_KEY not set, printing instead of sending email');
    console.log(body);
    return new Promise((resolve) => {
      resolve(null);
    });
  }
  return axios({
    method: "post",
    url: "https://api.mailgun.net/v3/mail.taptap.dev/messages",
    auth: {username: 'api', password: apiKey},
    data: {from: 'no-reply@mail.taptap.dev', to, subject: 'TDS Perf Login Link', text: body},
    headers: { "Content-Type": "multipart/form-data" }
  });
}

function sendLoginLink(to) {
  return createVerificationToken(to).then(token => {
    return sendEmail(to, `Please use this link to login: https://${process.env.DOMAIN}/api/auth/verify/${token}`);
  });
}

export {sendEmail, sendLoginLink};
