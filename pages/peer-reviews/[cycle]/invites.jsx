import Head from 'next/head';
import NextLink from 'next/link';
import JoyLink from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import TextField from '@mui/joy/TextField';
import Button from '@mui/joy/Button';
import React, { useState } from 'react';
import Info from '@mui/icons-material/Info';

import styles from '../../../styles/Home.module.css';
import { withSessionSsr } from '../../../lib/session';
import { sessionUser } from '../../../lib/user';
import RedirectToLogin from '../../../components/RedirectToLogin';

export default function Home({ user }) {
  const [reviewerEmails, setReviewerEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');

  const addEmail = () => {
    const trimmedEmail = newEmail.trim();
    if (
      !trimmedEmail.endsWith('@xd.com') &&
      !trimmedEmail.endsWith('@beyondsoft.com')
    ) {
      setError('邮箱必须以 @xd.com 或 @beyondsoft.com 结尾');
      return;
    }
    if (reviewerEmails.includes(newEmail)) {
      setError('已经邀请该同事');
      return;
    }
    setError('');
    setReviewerEmails([...reviewerEmails, newEmail]);
    setNewEmail('');
  };

  const deleteReviewer = (email) => {
    const emails = [...reviewerEmails];
    const i = emails.indexOf(email);
    emails.splice(i, 1);
    setReviewerEmails(emails);
  };
  if (!user) {
    return <RedirectToLogin />;
  }
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>TDS Perf Review</h1>

        <p className={styles.description}>
          请填写几位熟悉你工作的同事的邮箱，邀请他们给你写反馈。
        </p>
        <Typography
          variant="soft"
          color="info"
          level="body"
          py={1}
          px={1}
          startDecorator={<Info />}
        >
          可以是 xd.com 或 beyondsoft.com
          的邮箱。如果对方有多个公司邮箱，请使用与全名对应的那个。
          <br />
          建议至少邀请三位同事。
          <br />
          点击已添加的邮箱可以删除。
        </Typography>

        <List>
          {reviewerEmails.map((email) => (
            <ListItem key={email}>
              <ListItemButton onClick={() => deleteReviewer(email)}>
                {email}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {error && (
          <Typography
            variant="soft"
            color="danger"
            startDecorator="❌ "
            py={1}
            px={1}
            mb={2}
            borderRadius="xs"
            display="inline-flex"
            fontSize="sm"
            sx={{ '--Typography-gap': '0.5rem' }}
          >
            {error}
          </Typography>
        )}
        <div className={styles.form}>
          <TextField
            name="email"
            type="email"
            placeholder="johndoe@xd.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <Button sx={{ ml: 1 }} onClick={addEmail}>
            添加
          </Button>
        </div>
        <NextLink href="/" passHref>
          <JoyLink>返回</JoyLink>
        </NextLink>
      </main>
    </div>
  );
}

export const getServerSideProps = withSessionSsr(({ req }) => {
  return { props: { user: sessionUser(req.session) } };
});
