import { withSessionRoute } from '../../lib/session';
import { sendPeerReviewReminders } from '../../lib/mail';

async function handler(req, res) {
  const { user } = req.session;
  const { cycle } = req.query;

  if (!user) {
    res.status(401).json({ message: 'Login required.' });
    return;
  }

  if (!cycle) {
    res.status(422).json({ message: 'missing the cycle parameter' });
  }

  try {
    await sendPeerReviewReminders(cycle);
    res.status(200).json({ status: 'ok' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export default withSessionRoute(handler);
