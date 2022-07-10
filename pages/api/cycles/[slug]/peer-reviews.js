import { withSessionRoute } from '../../../../lib/session';
import { createPeerReview } from '../../../../lib/peer-review';

async function handler(req, res) {
  const slug = req.query.slug;
  const user = req.session.user;
  const reviewerEmail = req.body.reviewerEmail;
  try {
    await createPeerReview(slug, user.id, reviewerEmail);
    res.status(200).json({ status: 'ok' });
  } catch (e) {
    res.status(500).json({ message: `Failed to create peer review: ${e}` });
  }
}

export default withSessionRoute(handler);
