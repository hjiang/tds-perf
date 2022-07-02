import Button from '@mui/joy/Button';
import Head from 'next/head';
import Link from '@mui/joy/Link';
import React, { useState, Fragment } from 'react';
import Sheet from '@mui/joy/Sheet';
import TextField from '@mui/joy/TextField';
import Typography from '@mui/joy/Typography';
import axios from 'axios';

import styles from '../styles/Login.module.css';

export default function Home() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const login = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail.endsWith('@xd.com')) {
      setError('邮箱必须以 @xd.com 结尾');
      return;
    }
    setError('');
    axios
      .post('/api/send_login_link', { email })
      .then(() => {
        setSent(true);
      })
      .catch((e) => {
        setError(e.message);
      });
  };
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>TDS Perf Review</h1>

        {!sent && <p className={styles.description}>请输入公司邮箱登录。</p>}

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

        {sent ? (
          <Typography
            variant="soft"
            color="success"
            startDecorator="🙌 "
            level="body"
            mt={10}
          >
            请点击发到邮箱的链接登录。
          </Typography>
        ) : (
          <Fragment>
            <div className={styles.form}>
              <TextField
                name="email"
                type="email"
                placeholder="johndoe@xd.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button sx={{ ml: 1 }} onClick={login}>
                登录
              </Button>
            </div>
            <Link
              sx={{ mt: 5 }}
              onClick={() => {
                alert('还没来得及做，欢迎提 PR。');
              }}
            >
              使用 SSO 登录
            </Link>
          </Fragment>
        )}
      </main>
    </div>
  );
}
