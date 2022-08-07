import JoyLink from '@mui/joy/Link';
import NextLink from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Fragment } from 'react';

import RedirectToLogin from '../../../components/RedirectToLogin';
import { withSessionSsr } from '../../../lib/session';
import { sessionUser } from '../../../lib/user';
import { getPeerReviewsByReviewee } from '../../../lib/peer-review';
import styles from '../../../styles/FullPackage.module.scss';

function Mkd({ children }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>;
}

export default function Inbox({ user, shuffledPeerReviews }) {
  if (!user) {
    return <RedirectToLogin />;
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Peer Review Summary</h1>

        <p className={styles.description}>{user.email}</p>

        <div className={styles.bodyContent}>
          {shuffledPeerReviews?.summaries?.length > 0 ? (
            <div>
              <h4>
                请描述自己与被评价人在工作中的具体协作，以及你对他/她的贡献的评价。
              </h4>
              {shuffledPeerReviews.summaries.map((s, i) => (
                <Fragment key={i}>
                  <Mkd>{s}</Mkd>
                  <br />
                </Fragment>
              ))}
              <h4>你认为他/她有哪些做得较好的地方？</h4>
              {shuffledPeerReviews.strengths.map((s, i) => (
                <Fragment key={i}>
                  <Mkd>{s}</Mkd>
                  <br />
                </Fragment>
              ))}
              <h4>你认为他/她在工作中存在哪些待改进的方面？</h4>
              {shuffledPeerReviews.weaknesses.map((s, i) => (
                <Fragment key={i}>
                  <Mkd>{s}</Mkd>
                  <br />
                </Fragment>
              ))}
            </div>
          ) : (
            <div>还没有人完成给你的互评。</div>
          )}
          <NextLink href={`/`} passHref>
            <JoyLink>返回</JoyLink>
          </NextLink>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = withSessionSsr(async ({ req, query }) => {
  const user = sessionUser(req.session);
  const { cycle } = query;
  const peerReviews = await getPeerReviewsByReviewee(cycle, user.id);
  const shuffledPeerReviews = peerReviews.reduce(
    (spr, r) => {
      spr.summaries.splice(
        Math.floor(spr.length * Math.random() + 0.5),
        0,
        r.summary,
      );
      spr.strengths.splice(
        Math.floor(spr.length * Math.random() + 0.5),
        0,
        r.strength,
      );
      spr.weaknesses.splice(
        Math.floor(spr.length * Math.random() + 0.5),
        0,
        r.weakness,
      );
      return spr;
    },
    { summaries: [], strengths: [], weaknesses: [] },
  );
  return {
    props: {
      user,
      cycle,
      shuffledPeerReviews,
    },
  };
});
