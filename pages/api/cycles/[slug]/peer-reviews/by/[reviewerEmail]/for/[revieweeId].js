import { withSessionRoute } from '../../../../../../../../lib/session';
import { deleteEmptyPeerReview } from '../../../../../../../../lib/peer-review';

async function handler(req, res) {
  const { slug, reviewerEmail, revieweeId } = req.query;
  const user = req.session.user;
  if (req.method === 'DELETE') {
    if (user.id !== revieweeId) {
      res.status(403).json({ message: '你不能删除其他人的同事反馈。' });
      return;
    }
    try {
      const deleted = await deleteEmptyPeerReview(slug, user.id, reviewerEmail);
      if (deleted) {
        res.status(200).json({ status: 'ok' });
      } else {
        res.status(409).json({ message: '不能删除已经开始的同事反馈。' });
      }
    } catch (e) {
      res.status(500).json({ message: `删除同事反馈失败: ${e}` });
    }
  } else {
    res.status(404).json({ message: `Method ${req.method} not implemented` });
  }
}

export default withSessionRoute(handler);
