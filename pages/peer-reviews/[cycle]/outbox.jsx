import Head from 'next/head';
import NextLink from 'next/link';
import JoyLink from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';

import styles from '../../../styles/Outbox.module.scss';
import { withSessionSsr } from '../../../lib/session';
import { sessionUser } from '../../../lib/user';
import { getPeerReviewsByReviewer } from '../../../lib/peer-review';
import RedirectToLogin from '../../../components/RedirectToLogin';

export default function Home({ user, peerReviews, cycle }) {
  if (!user) {
    return <RedirectToLogin />;
  }
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>TDS Perf Review</h1>

        <p className={styles.description}>你好，{user.username}</p>

        <List>
          {peerReviews.map((pr) => (
            <ListItem key={pr.id}>
              <Typography variant="plain" level="h4" startDecorator="✉️ ">
                <NextLink
                  href={`/peer-reviews/${cycle}/outbox/${pr.id}`}
                  passHref
                >
                  <JoyLink>{pr.revieweeEmail}</JoyLink>
                </NextLink>
              </Typography>
            </ListItem>
          ))}
        </List>
      </main>
    </div>
  );
}

export const getServerSideProps = withSessionSsr(async ({ req, query }) => {
  const user = sessionUser(req.session);
  const { cycle } = query;
  let peerReviews = [];
  if (user) {
    peerReviews = await getPeerReviewsByReviewer(cycle, user.id);
  }
  return { props: { user, peerReviews, cycle } };
});
