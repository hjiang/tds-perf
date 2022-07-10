import { sendLoginLink } from '../../lib/mail';

export default function handler(req, res) {
  const to = req.body.email;
  return sendLoginLink(to)
    .then(() => {
      res.status(200).json({});
    })
    .catch((e) => {
      res.status(500).json({ message: e.message });
    });
}
