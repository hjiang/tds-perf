import NextLink from 'next/link';
import JoyLink from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';

import styles from '../../../styles/AdminCycle.module.scss';
import { withSessionSsr } from '../../../lib/session';
import { ssionSsr } from '../../../lib/session';
import { sessionUser, userHasRole } from '../../../lib/user';
import { getFinalizedSelfReviews } from '../../../lib/self-review';
import RedirectToLogin from '../../../components/RedirectToLogin';

export default function Admin({ user, hasPermission, reviews, cycle }) {
  if (!user) {
    return <RedirectToLogin />;
  }
  if (!hasPermission) {
    return <p>You do not have permission to access this page.</p>;
  }
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>TDS Perf Review (管理员)</h1>

        <p className={styles.description}>
          你好，{user.username}。下面是本季度所有人已完成的材料。
        </p>
        <List>
          {reviews.map((r) => (
            <ListItem key={r.id}>
              <Typography variant="plain" level="h5">
                <NextLink
                  href={`/admin/${cycle}/packages/${r.reviewer.objectId}`}
                  passHref
                >
                  <JoyLink>{r.reviewer.email}</JoyLink>
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
  const hasPermission = await userHasRole(user.id, 'admin');
  const finalizedReviews = hasPermission
    ? await getFinalizedSelfReviews(cycle)
    : [];
  finalizedReviews.sort((a, b) =>
    a.reviewer.email < b.reviewer.email ? -1 : 1,
  );
  return {
    props: {
      user,
      cycle,
      hasPermission,
      reviews: finalizedReviews,
    },
  };
});
