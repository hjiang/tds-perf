import LC from './leancloud';

const ReviewCycle = LC.Object.extend('ReviewCycle');
const SelfReview = LC.Object.extend('SelfReview');

export async function getSelfReview(userId, reviewCycleSlug) {
  const reviewer = LC.Object.createWithoutData('_User', userId);
  let query = new LC.Query(ReviewCycle);
  query.equalTo('slug', reviewCycleSlug);
  const cycle = await query.first();
  if (!cycle) {
    throw new Error(`Review cycle ${reviewCycleSlug} doesn't exist.`);
  }
  query = new LC.Query(SelfReview);
  query.equalTo('reviewer', reviewer);
  query.equalTo('reviewCycle', cycle);
  const review = await query.first();
  if (review) {
    return review.toJSON();
  } else {
    return null;
  }
}

export async function saveSelfReview(userId, reviewCycleSlug, selfReviewData) {
  let query = new LC.Query(ReviewCycle);
  query.equalTo('slug', reviewCycleSlug);
  const cycle = await query.first();
  if (!cycle) {
    throw new Error(`Review cycle ${reviewCycleSlug} doesn't exist.`);
  }
  query = new LC.Query(LC.User);
  const reviewer = await query.get(userId);
  if (!reviewer) {
    throw new Error(`User ID ${userId} doesn't exist!`);
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
    finalized,
  } = selfReviewData;
  query = new LC.Query(SelfReview);
  query.equalTo('reviewer', reviewer);
  query.equalTo('reviewCycle', cycle);
  let selfReview = await query.first();
  if (!selfReview) {
    selfReview = new SelfReview({ reviewer, reviewCycle: cycle });
  }
  await selfReview.save({
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
    finalized,
  });
  return selfReview.toJSON();
}
