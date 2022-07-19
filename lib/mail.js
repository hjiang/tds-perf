import axios from 'axios';

import { createVerificationToken } from './user';
import { getUnfinishedPeerReviewers } from './peer-review';

export function sendEmail(to, subject, body) {
  const apiKey = process.env.MAILGUN_API_KEY;
  if (!apiKey) {
    console.log('MAILGUN_API_KEY not set, printing instead of sending email');
    console.log(`Sending email to ${to}`);
    console.log(body);
    return new Promise((resolve) => {
      resolve(null);
    });
  }
  return axios({
    method: 'post',
    url: 'https://api.mailgun.net/v3/mail.taptap.dev/messages',
    auth: { username: 'api', password: apiKey },
    data: { from: 'no-reply@mail.taptap.dev', to, subject, text: body },
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function sendLoginLink(to) {
  return createVerificationToken(to).then((token) => {
    return sendEmail(
      to,
      'TDS Perf Review Login Link',
      `Please use this link to login: https://${process.env.DOMAIN}/api/auth/verify/${token}`,
    );
  });
}

export async function sendPeerReviewReminders(cycle) {
  const reviewers = await getUnfinishedPeerReviewers(cycle);
  console.log(`Reminding ${reviewers.length} peer-reviewers.`);
  let emails = reviewers.map((r) => r.email);
  emails = emails.sort().filter(function (item, pos, ary) {
    return !pos || item != ary[pos - 1];
  });
  console.log(`${emails.length} unique emails`);
  for (const email of emails) {
    await sendEmail(
      email,
      '你还有未完成的同事评价',
      `有同事邀请你为他/她写季度评价，请登录 https://tds-perf.cn-e1.leanapp.cn/ 完成。
谢谢！
遇到问题可以联系 jianghong@xd.com。`,
    );
  }
}
