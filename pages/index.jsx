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

        <p className={styles.description}>你好，{user.username}</p>

        <List className={styles.actions}>
          <ListItem>
            <Typography variant="plain" level="h3" startDecorator="🚀 ">
              <NextLink href="/self-reviews/2022-q2" passHref>
                <JoyLink>2022 Q2 自我总结</JoyLink>
              </NextLink>
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="plain" level="h3" startDecorator="✉️ ">
              <NextLink href="/peer-reviews/2022-q2/invites" passHref>
                <JoyLink>2022 Q2 同事反馈邀请</JoyLink>
              </NextLink>
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="plain" level="h3" startDecorator="✍️ ">
              <NextLink href="/peer-reviews/2022-q2/outbox" passHref>
                <JoyLink>2022 Q2 填写同事反馈</JoyLink>
              </NextLink>
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="plain" level="h3" startDecorator="️👀 ">
              <NextLink href="/peer-reviews/2022-q2/inbox" passHref>
                <JoyLink>2022 Q2 查看同事给自己的反馈</JoyLink>
              </NextLink>
            </Typography>
          </ListItem>
          {isAdmin && (
            <ListItem>
              <Typography variant="plain" level="h3" startDecorator="👮 ">
                <NextLink href="/admin/2022-q2" passHref>
                  <JoyLink>查看所有自评、环评（管理员）</JoyLink>
                </NextLink>
              </Typography>
            </ListItem>
          )}
          {isManager && (
            <ListItem>
              <Typography variant="plain" level="h3" startDecorator="💼 ">
                <NextLink href="/manager/2022-q2" passHref>
                  <JoyLink>查看下属自评、环评</JoyLink>
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
