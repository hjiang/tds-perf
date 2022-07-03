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
  const [analyticalSkillScore, setAnalyticalSkillScore] = useState(2);
  const [analyticalSkillText, setAnalyticalSkillText] = useState('');
  const [executionScore, setExecutionScore] = useState(2);
  const [executionText, setExecutionText] = useState('');
  const [impactScore, setImpactScore] = useState(2);
  const [impactText, setImpactText] = useState('');
  const [strength, setStrength] = useState('');
  const [weakness, setWeakness] = useState('');
  const [feedbackManager, setFeedbackManager] = useState('');
  const [feedbackCompany, setFeedbackCompany] = useState('');
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

  const submit = () => {};
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>{slug} 自我评价</h1>

        <p className={styles.description}>请尽可能详细地回答以下问题</p>

        <Typography
          variant="soft"
          level="body1"
          startDecorator="💡 "
          color="info"
        >
          其中所有文字部分都支持 Markdown 格式。
        </Typography>

        <div className={styles.reviewItems}>
          <div className={styles.reviewSection}>
            <div className={styles.reviewItem}>
              <Typography variant="plain" level="h4" startDecorator="📖 ">
                工作小结
              </Typography>
              <Typography variant="plain" level="body1">
                请概括自己在本季度负责的具体项目及在其中贡献的价值。如果你有
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
          </div>
          <div className={styles.reviewSection}>
            <Typography
              className={styles.title}
              variant="plain"
              level="h4"
              startDecorator="⚖ "
            >
              自我评价
            </Typography>
            <Typography variant="plain" level="body1">
              此部分不向给你写反馈的同事公开。这部分问题除了帮助大家从各个对职业成长很重要的维度来评估自己的优劣势外，也帮助公司了解在员工成长方面需要投入更多资源和注意力的方面。
            </Typography>

            <section className={styles.reviewItem}>
              <Typography variant="plain" level="h5" startDecorator="🌞 ">
                你认为自己是否在本季度实践了公司所倡导的文化？
              </Typography>
              <Typography variant="plain" level="body1">
                包括促进信息在公司内的透明公开、在工作中友善地寻求协作和共识、给同事提供坦诚而善意的反馈等。
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
              <Typography variant="plain" level="body1">
                如果有请提供具体说明和事例。
              </Typography>
              <MDEditor
                value={cultureText}
                onChange={setCultureText}
                preview="edit"
                hideToolbar={true}
                height={150}
              />
            </section>

            <section className={styles.reviewItem}>
              <Typography variant="plain" level="h5" startDecorator="🧮 ">
                你认为自己在工作中是否有较高的分析和解决问题的能力？
              </Typography>
              <Typography variant="plain" level="body1">
                比如在遇到难题或模糊的问题时，是否能很好地分析、拆解并设计和实现解决方案。
              </Typography>
              <Box sx={{ paddingLeft: 5, paddingRight: 5 }}>
                <Slider
                  aria-label="AnalyticalSkills"
                  value={analyticalSkillScore}
                  onChange={(e) => setAnalyticalSkillScore(e.target.value)}
                  step={1}
                  marks={marks}
                  min={0}
                  max={4}
                  valueLabelDisplay="auto"
                />
              </Box>
              <Typography variant="plain" level="body1">
                如果有请提供具体说明和事例。
              </Typography>
              <MDEditor
                value={analyticalSkillText}
                onChange={setAnalyticalSkillText}
                preview="edit"
                hideToolbar={true}
                height={150}
              />
            </section>

            <section className={styles.reviewItem}>
              <Typography variant="plain" level="h5" startDecorator="🎯 ">
                你认为自己在这段时间的工作中是否有较高的执行力？
              </Typography>
              <Typography variant="plain" level="body1">
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
              <Typography variant="plain" level="body1">
                如果有请提供具体说明和事例。
              </Typography>
              <MDEditor
                value={executionText}
                onChange={setExecutionText}
                preview="edit"
                hideToolbar={true}
                height={150}
              />
            </section>

            <section className={styles.reviewItem}>
              <Typography variant="plain" level="h5" startDecorator="🚩 ">
                你认为自己在组织中是否有较高的影响力和存在感？
              </Typography>
              <Typography variant="plain" level="body1">
                包括让自己的意见和建议被听到、正面影响他人的决策、主动承担困难的任务并对结果负责、在组织中分享经验和知识等。
              </Typography>
              <Box sx={{ paddingLeft: 5, paddingRight: 5 }}>
                <Slider
                  aria-label="Impact"
                  value={impactScore}
                  onChange={(e) => setImpactScore(e.target.value)}
                  step={1}
                  marks={marks}
                  min={0}
                  max={4}
                  valueLabelDisplay="auto"
                />
              </Box>
              <Typography variant="plain" level="body1">
                如果有请提供具体说明和事例。
              </Typography>
              <MDEditor
                value={impactText}
                onChange={setImpactText}
                preview="edit"
                hideToolbar={true}
                height={150}
              />
            </section>

            <div className={styles.reviewItem}>
              <Typography variant="plain" level="h5" startDecorator="💪 ">
                你认为自己有哪些强项？
              </Typography>
              <Typography variant="plain" level="body1">
                有哪些做得比较好的方面，需要在未来继续坚持下去？
              </Typography>
              <MDEditor
                value={strength}
                onChange={setStrength}
                preview="edit"
                hideToolbar={true}
                height={150}
              />
            </div>

            <div className={styles.reviewItem}>
              <Typography variant="plain" level="h5" startDecorator="⛳ ">
                你认为自己有哪些弱点？
              </Typography>
              <Typography variant="plain" level="body1">
                有哪些过去的行为需要在未来停止，或者有哪些行为需要开始培养和发展，有什么具体计划？
              </Typography>
              <MDEditor
                value={weakness}
                onChange={setWeakness}
                preview="edit"
                hideToolbar={true}
                height={150}
              />
            </div>
          </div>

          <div className={styles.reviewSection}>
            <Typography
              className={styles.title}
              variant="plain"
              level="h4"
              startDecorator="🔊 "
            >
              管理反馈
            </Typography>
            <div className={styles.reviewItem}>
              <Typography variant="plain" level="h5" startDecorator="🪜 ">
                主管是否给你提供了足够支持，有哪些方面需要得到他/她的更多支持？
              </Typography>
              <MDEditor
                value={weakness}
                onChange={setWeakness}
                preview="edit"
                hideToolbar={true}
                height={150}
              />
            </div>
            <div className={styles.reviewItem}>
              <Typography variant="plain" level="h5" startDecorator="👨‍🦲 ">
                公司是否给你提供了足够支持，公司进行哪些改变可以让你或团队工作得更好？
              </Typography>
              <MDEditor
                value={weakness}
                onChange={setWeakness}
                preview="edit"
                hideToolbar={true}
                height={150}
              />
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <Button className={styles.action} onClick={save}>
            保存
          </Button>
          <Button className={styles.action} onClick={submit} color="secondary">
            提交
          </Button>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = withSessionSsr(({ req }) => {
  return { props: { user: req.session.user } };
});
