import RedirectToLogin from '../../../components/RedirectToLogin';
import { withSessionSsr } from '../../../../lib/session';
import { sessionUser, getUser } from '../../../../lib/user';

export default function Inbox({ user }) {
  if (!user) {
    return <RedirectToLogin />;
  }
}

export const getServerSideProps = withSessionSsr(async ({ req, query }) => {
  const user = sessionUser(req.session);
  const { cycle } = query;
  const peerReviews = await getPeerReviewsByReviewee(cycle, user.id);
  return {
    props: {
      user,
      cycle,
    },
  };
});
