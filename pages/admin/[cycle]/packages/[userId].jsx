import NextLink from 'next/link';
import JoyLink from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { withSessionSsr } from '../../../../lib/session';
import { ssionSsr } from '../../../../lib/session';
import { sessionUser, userHasRole } from '../../../../lib/user';
import { getSelfReview } from '../../../../lib/self-review';
import { getPeerReviewsByReviewee } from '../../../../lib/peer-review';
import RedirectToLogin from '../../../../components/RedirectToLogin';
import styles from '../../../../styles/FullPackage.module.scss';

const marks = ['从不', '很少', '有时', '经常', '总是'];
const toMark = (score) => {
  return score >= 0 ? marks[score] : '无法评价';
};

const familiarityMarks = [
  '不熟悉，没有一手协作经验',
  '有些熟悉，有时会一起协作',
  '非常熟悉，经常一起协作',
];

function Mkd({ children }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>;
}

export default function Package({
  user,
  hasPermission,
  selfReview,
  cycle,
  peerReviews,
}) {
  if (!user) {
    return <RedirectToLogin />;
  }
  if (!hasPermission) {
    return <p>You do not have permission to access this page.</p>;
  }
  const {
    summary,
    cultureScore,
    cultureText,
    analyticalSkillScore,
    analyticalSkillText,
    executionScore,
    executionText,
    impactScore,
    impactText,
    strength,
    weakness,
    feedbackManager,
    feedbackCompany,
  } = selfReview;
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>TDS Perf Review Package</h1>

        <p className={styles.description}>{selfReview.reviewer.email}</p>

        <div className={styles.bodyContent}>
          <h2>自评部分</h2>
          <h3>工作小结</h3>
          <p>
            请概括自己在本季度负责的具体项目及在其中贡献的价值。如果你有
            OKR、工作日志等，可以在这里给出链接，以便其他同事在给你写反馈时浏览。
          </p>
          <Mkd>{summary}</Mkd>
          <h3>自我评价</h3>
          <div>
            <h4>你认为自己是否在本季度实践了公司所倡导的文化？</h4>
            <p>
              包括促进信息在公司内的透明公开、在工作中友善地寻求协作和共识、给同事提供坦诚而善意的反馈等。
            </p>
            <p>
              分数：{cultureScore} - {marks[cultureScore]}
            </p>
            <Mkd>{cultureText}</Mkd>
          </div>
          <div>
            <h4>你认为自己在工作中是否有较高的分析和解决问题的能力？</h4>
            <p>
              比如在遇到难题或模糊的问题时，是否能很好地分析、拆解并设计和实现解决方案。
            </p>
            <p>
              分数：{analyticalSkillScore} - {marks[analyticalSkillScore]}
            </p>
            <Mkd>{analyticalSkillText}</Mkd>
          </div>
          <div>
            <h4>你认为自己在这段时间的工作中是否有较高的执行力？</h4>
            <p>如是否能无需主管或同事的较多帮助而持续输出高质量的工作？</p>
            <p>
              分数：{executionScore} - {marks[executionScore]}
            </p>
            <Mkd>{executionText}</Mkd>
          </div>
          <div>
            <h4>你认为自己在组织中是否有较高的影响力和存在感？</h4>
            <p>
              包括让自己的意见和建议被听到、正面影响他人的决策、主动承担困难的任务并对结果负责、在组织中分享经验和知识等。
            </p>
            <p>
              分数：{impactScore} - {marks[impactScore]}
            </p>
            <Mkd>{impactText}</Mkd>
          </div>
          <div>
            <h4>你认为自己有哪些做得较好的地方？</h4>
            <p>
              在这段时间的工作中有哪些做得比较好的方面，需要在未来继续坚持下去？
            </p>
            <Mkd>{strength}</Mkd>
          </div>
          <div>
            <h4>你认为自己在工作中存在哪些待改进的方面？</h4>
            <p>
              有哪些过去的行为需要在未来停止，或者有哪些行为需要开始培养和发展，有什么具体计划？
            </p>
            <Mkd>{weakness}</Mkd>
          </div>
          <h3>管理反馈</h3>
          <div>
            <h4>
              主管是否给你提供了足够支持，有哪些方面需要得到他/她的更多支持？
            </h4>
            <Mkd>{feedbackManager}</Mkd>
          </div>
          <div>
            <h4>
              公司是否给你提供了足够支持，公司进行哪些改变可以让你或团队工作得更好？
            </h4>
            <Mkd>{feedbackCompany}</Mkd>
          </div>
          <h2>环评部分</h2>
          {peerReviews.map((r) => (
            <div key={r.id}>
              <div>
                <h3>{r.reviewer.email}</h3>
                <p>
                  你在本周期与被评价人工作的熟悉程度：
                  {familiarityMarks[r.familiarity]}
                </p>
              </div>
              <div>
                <h4>
                  请描述自己与被评价人在工作中的具体协作，以及你对他/她的贡献的评价。将以匿名形式共享给本人。
                </h4>
                <Mkd>{r.summary}</Mkd>
              </div>
              <div>
                <h4>你认为他/她有哪些做得较好的地方？</h4>
                <Mkd>{r.strength}</Mkd>
              </div>
              <div>
                <h4>你认为他/她在工作中存在哪些待改进的方面？</h4>
                <Mkd>{r.weakness}</Mkd>
              </div>
              <div>
                <h4>他/她是否在本季度实践了公司所倡导的文化？</h4>
                <p>
                  {r.cultureScore} - {toMark(r.cultureScore)}
                </p>
                <Mkd>{r.cultureText}</Mkd>
              </div>
              <div>
                <h4>他/她在工作中是否有较高的分析和解决问题的能力？</h4>
                <p>
                  {r.analyticalSkillScore} - {toMark(r.analyticalSkillScore)}
                </p>
                <Mkd>{r.analyticalSkillText}</Mkd>
              </div>
              <div>
                <h4>他/她在这段时间的工作中是否有较高的执行力？</h4>
                <p>
                  {r.executionScore} - {toMark(r.executionScore)}
                </p>
                <Mkd>{r.executionText}</Mkd>
              </div>
              <div>
                <h4>他/她在组织中是否有较高的影响力和存在感？</h4>
                <p>
                  {r.impactScore} - {toMark(r.impactScore)}
                </p>
                <Mkd>{r.impactText}</Mkd>
              </div>
              <div>
                <h4>其他评价（保密）</h4>
                <p>{r.confidentialEval}</p>
              </div>
            </div>
          ))}

          <NextLink href={`/admin/${cycle}`} passHref>
            <JoyLink>返回</JoyLink>
          </NextLink>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = withSessionSsr(async ({ req, query }) => {
  const user = sessionUser(req.session);
  const { cycle, userId } = query;
  const hasPermission = user ? await userHasRole(user.id, 'admin') : false;
  const selfReview = hasPermission ? await getSelfReview(userId, cycle) : {};
  const peerReviews = hasPermission
    ? await getPeerReviewsByReviewee(cycle, userId)
    : [];
  return {
    props: {
      user,
      cycle,
      hasPermission,
      selfReview,
      peerReviews,
    },
  };
});
