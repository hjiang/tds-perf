import NextLink from 'next/link';
import JoyLink from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';

import styles from '../../../styles/AdminCycle.module.scss';
import { withSessionSsr } from '../../../lib/session';
import { ssionSsr } from '../../../lib/session';
import { sessionUser, findUsersByManager } from '../../../lib/user';
import RedirectToLogin from '../../../components/RedirectToLogin';

export default function Admin({ user, employees, cycle }) {
  if (!user) {
    return <RedirectToLogin />;
  }
  if (employees.length === 0) {
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
          {employees.map((r) => (
            <ListItem key={r.objectId}>
              <Typography variant="plain" level="h5">
                <NextLink
                  href={`/manager/${cycle}/packages/${r.objectId}`}
                  passHref
                >
                  <JoyLink>{r.email}</JoyLink>
                </NextLink>
              </Typography>
            </ListItem>
          ))}
        </List>
        <NextLink href={`/`} passHref>
          <JoyLink>返回</JoyLink>
        </NextLink>
      </main>
    </div>
  );
}

export const getServerSideProps = withSessionSsr(async ({ req, query }) => {
  const user = sessionUser(req.session);
  const { cycle } = query;
  const employees = user ? await findUsersByManager(user.id) : [];
  employees.sort((a, b) => (a.email < b.email ? -1 : 1));
  return {
    props: {
      user,
      cycle,
      employees,
    },
  };
});
