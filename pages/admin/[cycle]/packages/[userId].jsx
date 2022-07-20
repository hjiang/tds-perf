import NextLink from 'next/link';
import JoyLink from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ReactMarkdown from 'react-markdown';

import { withSessionSsr } from '../../../../lib/session';
import { ssionSsr } from '../../../../lib/session';
import { sessionUser, userHasRole } from '../../../../lib/user';
import { getSelfReview } from '../../../../lib/self-review';
import RedirectToLogin from '../../../../components/RedirectToLogin';
import styles from '../../../../styles/FullPackage.module.scss';

export default function Package({ user, hasPermission, selfReview, cycle }) {
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

        <h2>自我评价</h2>
        <h3>工作总结</h3>
        <ReactMarkdown>{summary}</ReactMarkdown>
      </main>
    </div>
  );
}

export const getServerSideProps = withSessionSsr(async ({ req, query }) => {
  const user = sessionUser(req.session);
  const { cycle, userId } = query;
  const hasPermission = await userHasRole(user.id, 'admin');
  const selfReview = hasPermission ? await getSelfReview(userId, cycle) : {};
  return {
    props: {
      user,
      cycle,
      hasPermission,
      selfReview,
    },
  };
});
