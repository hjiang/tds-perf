import Typography from '@mui/joy/Typography';
import axios from 'axios';
import { useState, Fragment } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import Slider from '@mui/joy/Slider';
import Box from '@mui/joy/Box';
import Checkbox from '@mui/joy/Checkbox';
import Button from '@mui/joy/Button';
import NextLink from 'next/link';
import JoyLink from '@mui/joy/Link';

import styles from '../../../../styles/OutgoingPeerReview.module.scss';
import { withSessionSsr } from '../../../../lib/session';
import { sessionUser } from '../../../../lib/user';
import { getPeerReviewById } from '../../../../lib/peer-review';
import { getSelfReview } from '../../../../lib/self-review';
import { storedOrDefault } from '../../../../lib/util';
import RedirectToLogin from '../../../../components/RedirectToLogin';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const marks = [
  { value: -1, label: '无法判断' },
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

export default function PeerReview({ user, cycle, selfReview, peerReview }) {
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  const [familiarity, setFamiliarity] = useState(
    storedOrDefault(peerReview.familiarity, 1),
  );
  const [showEditorToolbar, setShowEditorToolbar] = useState(true);
  const [summary, setSummary] = useState(peerReview.summary || '');
  const [strength, setStrength] = useState(peerReview.strength || '');
  const [weakness, setWeakness] = useState(peerReview.weakness || '');
  const [cultureScore, setCultureScore] = useState(
    storedOrDefault(peerReview.cultureScore, -1),
  );
  const [cultureText, setCultureText] = useState(peerReview.cultureText || '');
  const [analyticalSkillScore, setAnalyticalSkillScore] = useState(
    storedOrDefault(peerReview.analyticalSkillScore, -1),
  );
  const [analyticalSkillText, setAnalyticalSkillText] = useState(
    peerReview.analyticalSkillText || '',
  );
  const [executionScore, setExecutionScore] = useState(
    storedOrDefault(peerReview.executionScore, -1),
  );
  const [executionText, setExecutionText] = useState(
    peerReview.executionText || '',
  );
  const [impactScore, setImpactScore] = useState(
    storedOrDefault(peerReview.impactScore, -1),
  );
  const [impactText, setImpactText] = useState(peerReview.impactText || '');
  const [confidentialEval, setConfidentialEval] = useState(
    peerReview.confidentialEval || '',
  );
  const [finalized, setFinalized] = useState(
    storedOrDefault(peerReview.finalized, false),
  );

  const save = async () => {
    setError('');
    try {
      await axios.put(`/api/cycles/${cycle}/peer-reviews/${peerReview.id}`, {
        familiarity,
        summary,
        strength,
        weakness,
        cultureScore,
        cultureText,
        analyticalSkillScore,
        analyticalSkillText,
        executionScore,
        executionText,
        impactScore,
        impactText,
        confidentialEval,
        finalized,
      });
      setInfo('已保存');
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || e.message);
    }
  };

  if (!user) {
    return <RedirectToLogin />;
  }
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

        <Typography
          variant="soft"
          level="body1"
          startDecorator="💡 "
          color="info"
        >
          文字部分支持 Markdown 格式。{' '}
          <Checkbox
            label="显示编辑器工具栏"
            variant="outlined"
            checked={showEditorToolbar}
            onChange={(e) => setShowEditorToolbar(e.target.checked)}
          />
        </Typography>
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
              <Box sx={{ px: 5, mb: 3 }}>
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

              {familiarity === 0 && (
                <Typography
                  variant="soft"
                  level="body1"
                  startDecorator="💡 "
                  color="info"
                >
                  你无需填写剩余部分。
                </Typography>
              )}

              {familiarity > 0 && (
                <Fragment>
                  <Typography variant="plain" level="body1">
                    请描述自己与被评价人在工作中的具体协作，以及你对他/她的贡献的评价。将以匿名形式共享给本人。
                  </Typography>
                  <MDEditor
                    value={summary}
                    onChange={setSummary}
                    preview="edit"
                    hideToolbar={!showEditorToolbar}
                    height={300}
                  />
                </Fragment>
              )}
            </div>

            {familiarity > 0 && (
              <Fragment>
                <div className={styles.reviewItem}>
                  <Typography variant="plain" level="h5" startDecorator="💪 ">
                    你认为他/她有哪些做得较好的地方？
                  </Typography>
                  <Typography variant="plain" level="body1">
                    在这段时间的工作中他/她有哪些做得比较好的方面，需要在未来继续坚持下去？将以匿名形式共享给本人。
                  </Typography>
                  <MDEditor
                    value={strength}
                    onChange={setStrength}
                    preview="edit"
                    hideToolbar={!showEditorToolbar}
                    height={150}
                  />
                </div>

                <div className={styles.reviewItem}>
                  <Typography variant="plain" level="h5" startDecorator="⛳ ">
                    你认为他/她在工作中存在哪些待改进的方面？
                  </Typography>
                  <Typography variant="plain" level="body1">
                    他/她有哪些过去的行为需要在未来停止，或者有哪些行为需要开始培养和发展？将以匿名形式共享给本人。
                  </Typography>
                  <MDEditor
                    value={weakness}
                    onChange={setWeakness}
                    preview="edit"
                    hideToolbar={!showEditorToolbar}
                    height={150}
                  />
                </div>

                <Typography variant="plain" level="h4" sx={{ my: 5 }}>
                  以下部分将对被评价人保密。
                </Typography>

                <section className={styles.reviewItem}>
                  <Typography variant="plain" level="h5" startDecorator="🌞 ">
                    他/她是否在本季度实践了公司所倡导的文化？
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
                      min={-1}
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
                    hideToolbar={!showEditorToolbar}
                    height={150}
                  />
                </section>

                <section className={styles.reviewItem}>
                  <Typography variant="plain" level="h5" startDecorator="🧮 ">
                    他/她在工作中是否有较高的分析和解决问题的能力？
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
                      min={-1}
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
                    hideToolbar={!showEditorToolbar}
                    height={150}
                  />
                </section>

                <section className={styles.reviewItem}>
                  <Typography variant="plain" level="h5" startDecorator="🎯 ">
                    他/她在这段时间的工作中是否有较高的执行力？
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
                      min={-1}
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
                    hideToolbar={!showEditorToolbar}
                    height={150}
                  />
                </section>

                <section className={styles.reviewItem}>
                  <Typography variant="plain" level="h5" startDecorator="🚩 ">
                    他/她在组织中是否有较高的影响力和存在感？
                  </Typography>
                  <Typography variant="plain" level="body1">
                    包括意见和建议被其他人听到、正面影响他人的决策、主动承担困难的任务并对结果负责、在组织中分享经验和知识等。
                  </Typography>
                  <Box sx={{ paddingLeft: 5, paddingRight: 5 }}>
                    <Slider
                      aria-label="Impact"
                      value={impactScore}
                      onChange={(e) => setImpactScore(e.target.value)}
                      step={1}
                      marks={marks}
                      min={-1}
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
                    hideToolbar={!showEditorToolbar}
                    height={150}
                  />
                </section>

                <section className={styles.reviewItem}>
                  <Typography variant="plain" level="h5" startDecorator="🔒 ">
                    其他评价
                  </Typography>
                  <Typography variant="plain" level="body1">
                    你是否有其他对他/她的评价希望提供给部门负责人或 HR。
                  </Typography>
                  <MDEditor
                    value={confidentialEval}
                    onChange={setConfidentialEval}
                    preview="edit"
                    hideToolbar={!showEditorToolbar}
                    height={150}
                  />
                </section>
              </Fragment>
            )}
          </div>
          <div className={styles.actions}>
            <Checkbox
              className={styles.action}
              onChange={(e) => setFinalized(e.target.checked)}
              checked={finalized}
              variant="outlined"
              label="已完成"
            />
            <Button className={styles.action} onClick={save}>
              保存
            </Button>
          </div>
          <NextLink href={`/peer-reviews/${cycle}/outbox`} passHref>
            <JoyLink>返回</JoyLink>
          </NextLink>
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
  return { props: { user, cycle, peerReview, selfReview } };
});
