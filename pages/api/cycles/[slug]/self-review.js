import { withSessionRoute } from '../../../../lib/session';
import { saveSelfReview } from '../../../../lib/self-review';

async function handler(req, res) {
  const slug = req.query.slug;
  const user = req.session.user;
  if (!user) {
    res.status(401).json({ message: 'Login required.' });
    return;
  }
  try {
    await saveSelfReview(user.id, slug, req.body);
    res.status(200).json({ message: 'Self-review saved.' });
  } catch (e) {
    res.status(500).json({ message: `${e.name}: ${e.message}` });
  }
}

export default withSessionRoute(handler);
