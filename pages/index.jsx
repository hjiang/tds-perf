import Head from 'next/head';
import NextLink from 'next/link';
import JoyLink from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';

import styles from '../styles/Home.module.scss';
import { withSessionSsr } from '../lib/session';
import { sessionUser, userHasRole, findUsersByManager } from '../lib/user';
import RedirectToLogin from '../components/RedirectToLogin';

export default function Home({ user, isAdmin, isManager }) {
  if (!user) {
    return <RedirectToLogin />;
  }
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>TDS Perf Review</h1>

        <p className={styles.description}>ไฝ ๅฅฝ๏ผ{user.username}</p>

        <List className={styles.actions}>
          <ListItem>
            <Typography variant="plain" level="h3" startDecorator="๐ ">
              <NextLink href="/self-reviews/2022-q2" passHref>
                <JoyLink>2022 Q2 ่ชๆๆป็ป</JoyLink>
              </NextLink>
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="plain" level="h3" startDecorator="โ๏ธ ">
              <NextLink href="/peer-reviews/2022-q2/invites" passHref>
                <JoyLink>2022 Q2 ๅไบๅ้ฆ้่ฏท</JoyLink>
              </NextLink>
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="plain" level="h3" startDecorator="โ๏ธ ">
              <NextLink href="/peer-reviews/2022-q2/outbox" passHref>
                <JoyLink>2022 Q2 ๅกซๅๅไบๅ้ฆ</JoyLink>
              </NextLink>
            </Typography>
          </ListItem>
          {isAdmin && (
            <ListItem>
              <Typography variant="plain" level="h3" startDecorator="๐ฎ ">
                <NextLink href="/admin/2022-q2" passHref>
                  <JoyLink>ๆฅ็ๆๆ่ช่ฏใ็ฏ่ฏ๏ผ็ฎก็ๅ๏ผ</JoyLink>
                </NextLink>
              </Typography>
            </ListItem>
          )}
          {isManager && (
            <ListItem>
              <Typography variant="plain" level="h3" startDecorator="๐ผ ">
                <NextLink href="/manager/2022-q2" passHref>
                  <JoyLink>ๆฅ็ไธๅฑ่ช่ฏใ็ฏ่ฏ</JoyLink>
                </NextLink>
              </Typography>
            </ListItem>
          )}
        </List>
      </main>
    </div>
  );
}

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const user = sessionUser(req.session);
  const isAdmin = user ? await userHasRole(user.id, 'admin') : false;
  const isManager = user
    ? (await findUsersByManager(user.id)).length > 0
    : false;
  return { props: { user, isAdmin, isManager } };
});
