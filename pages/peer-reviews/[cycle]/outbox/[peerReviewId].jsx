import Typography from '@mui/joy/Typography';
import axios from 'axios';
import { useState } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import Slider from '@mui/joy/Slider';
import Box from '@mui/joy/Box';

import styles from '../../../../styles/OutgoingPeerReview.module.scss';
import { withSessionSsr } from '../../../../lib/session';
import { sessionUser } from '../../../../lib/user';
import { getPeerReviewById } from '../../../../lib/peer-review';
import { getSelfReview } from '../../../../lib/self-review';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const marks = [
  { value: 0, label: '从不' },
  { value: 1, label: '很少' },
  { value: 2, label: '有时' },
  { value: 3, label: '经常' },
  { value: 4, label: '总是' },
];

const familiarityMarks = [
  { value: 0, label: '不熟悉，没有一手协作经验' },
  { value: 1, label: '有些熟悉，有时会一起协作' },
  { value: 2, label: '非常熟悉，经常一起协作' },
];
export default function PeerReview({ user, selfReview, peerReview }) {
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  const [familiarity, setFamiliarity] = useState(1);
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {!!info && (
          <Typography
            variant="soft"
            level="body1"
            color="success"
            startDecorator="👌 "
            className={styles.infoToast}
            onClick={() => setInfo('')}
          >
            {info}
          </Typography>
        )}
        {!!error && (
          <Typography
            variant="soft"
            level="body1"
            color="danger"
            className={styles.errorToast}
            startDecorator="🤦 "
            onClick={() => setError('')}
          >
            {error}
          </Typography>
        )}
        <h1 className={styles.title}>同事评价</h1>

        <p className={styles.description}>
          被评价人 {peerReview.reviewee.username}
        </p>

        <div className={styles.reviewItems}>
          <div className={styles.reviewSection}>
            <div className={styles.reviewItem}>
              <Typography variant="plain" level="h4" startDecorator="📖 ">
                被评价人工作小结
              </Typography>
              <MDEditor
                value={selfReview.summary}
                preview="preview"
                height={300}
                hideToolbar={true}
              />
              <Typography variant="plain" level="body1">
                请根据被评价人的以上工作总结，确认你在本周期与被评价人工作的熟悉程度：
              </Typography>
              <Box sx={{ paddingLeft: 5, paddingRight: 5 }}>
                <Slider
                  aria-label="Familiarity"
                  value={familiarity}
                  onChange={(e) => setFamiliarity(e.target.value)}
                  step={1}
                  marks={familiarityMarks}
                  min={0}
                  max={2}
                  valueLabelDisplay="auto"
                />
              </Box>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = withSessionSsr(async ({ req, query }) => {
  const user = sessionUser(req.session);
  const { cycle, peerReviewId } = query;
  const peerReview = user ? (await getPeerReviewById(peerReviewId)) || {} : {};
  const { summary } =
    peerReview && peerReview.reviewer.id === user.id
      ? (await getSelfReview(peerReview.reviewee.id, cycle)) || {}
      : {};
  const selfReview = { summary };
  return { props: { user, peerReview, selfReview } };
});
