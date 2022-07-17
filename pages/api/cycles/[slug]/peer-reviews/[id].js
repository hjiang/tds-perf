import { withSessionRoute } from '../../../../../lib/session';
import {
  getPeerReviewById,
  updatePeerReview,
} from '../../../../../lib/peer-review';

async function handler(req, res) {
  const { slug, id } = req.query;
  const { user } = req.session;

  try {
    const pr = await getPeerReviewById(id);
    if (pr.reviewer.id !== user.id) {
      res
        .status(403)
        .json({ message: 'You are not authorized to update this peer review' });
    } else {
      await updatePeerReview(id, { ...req.body, started: true });
      res.status(200).json({ status: 'ok' });
    }
  } catch (e) {
    res.status(500).json({ message: `Failed to create peer review: ${e}` });
  }
}

export default withSessionRoute(handler);
