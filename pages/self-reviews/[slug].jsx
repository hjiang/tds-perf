import Head from 'next/head';
import NextLink from 'next/link';
import JoyLink from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import { useRouter } from 'next/router';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Button from '@mui/joy/Button';
import Slider from '@mui/joy/Slider';
import Box from '@mui/joy/Box';

import styles from '../../styles/SelfReviews.module.css';
import { withSessionSsr } from '../../lib/session';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function Home({ user }) {
  const router = useRouter();
  const [summary, setSummary] = useState('');
  const [cultureScore, setCultureScore] = useState(2);
  const [cultureText, setCultureText] = useState('');
  const [executionScore, setExecutionScore] = useState(2);
  const [executionText, setExecutionText] = useState('');
  const marks = [
    { value: 0, label: '从不' },
    { value: 1, label: '很少' },
    { value: 2, label: '有时' },
    { value: 3, label: '经常' },
    { value: 4, label: '总是' },
  ];

  if (!user) {
    return (
      <div>
        <Head>
          <meta httpEquiv="refresh" content="0; URL='/login'" />
        </Head>
        Redirecting you to the login page.
      </div>
    );
  }

  const { slug } = router.query;
  const save = () => {
    console.log(summary);
  };
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>{slug} 自我评价</h1>

        <p className={styles.description}>请尽可能详细地回答以下问题</p>

        <Typography
          variant="soft"
          level="body2"
          startDecorator="💡 "
          color="info"
        >
          其中所有文字部分都支持 Markdown 格式。
        </Typography>

        <div className={styles.reviewItems}>
          <div>
            <Typography variant="plain" level="h4" startDecorator="📖 ">
              工作小结
            </Typography>
            <Typography variant="plain" level="body2">
              请概括自己在本季度的工作情况及贡献的价值。如果你有
              OKR、工作日志等，可以在这里给出链接，以便其他同事在给你写反馈时浏览。
            </Typography>
            <MDEditor
              value={summary}
              onChange={setSummary}
              preview="edit"
              hideToolbar={true}
              height={300}
            />
          </div>
          <div>
            <Typography variant="plain" level="h4" startDecorator="⚖ ">
              自我评价
            </Typography>
            <Typography variant="plain" level="body2">
              此部分不向给你写反馈的同事公开。
            </Typography>

            <Typography variant="plain" level="h5">
              你认为自己是否在本季度实践了公司所倡导的文化？
            </Typography>
            <Typography variant="plain" level="body2">
              包括促进信息的透明公开、在工作中友善地寻求协作和共识、给同事提供坦诚而善意的反馈等。
            </Typography>
            <Box sx={{ paddingLeft: 5, paddingRight: 5 }}>
              <Slider
                aria-label="Culture"
                value={cultureScore}
                onChange={(e) => setCultureScore(e.target.value)}
                step={1}
                marks={marks}
                min={0}
                max={4}
                valueLabelDisplay="auto"
              />
            </Box>
            <Typography variant="plain" level="body2">
              如果有请提供具体说明和事例。
            </Typography>
            <MDEditor
              value={cultureText}
              onChange={setCultureText}
              preview="edit"
              hideToolbar={true}
              height={150}
            />

            <Typography variant="plain" level="h5">
              你认为自己在这段时间的工作中是否有较高的执行力？
            </Typography>
            <Typography variant="plain" level="body2">
              如是否能无需主管或同事的较多帮助而持续输出高质量的工作？
            </Typography>
            <Box sx={{ paddingLeft: 5, paddingRight: 5 }}>
              <Slider
                aria-label="Execution"
                value={executionScore}
                onChange={(e) => setExecutionScore(e.target.value)}
                step={1}
                marks={marks}
                min={0}
                max={4}
                valueLabelDisplay="auto"
              />
            </Box>
            <Typography variant="plain" level="body2">
              如果有请提供具体说明和事例。
            </Typography>
            <MDEditor
              value={executionText}
              onChange={setExecutionText}
              preview="edit"
              hideToolbar={true}
              height={150}
            />
          </div>
        </div>
        <Button onClick={save}>Save</Button>
      </main>
    </div>
  );
}

export const getServerSideProps = withSessionSsr(({ req }) => {
  return { props: { user: req.session.user } };
});
