import LC from 'leanengine';

import { findOrCreateUserByEmail } from './user';
import { getReviewCycleBySlug } from './review-cycle';
import { filterObject } from './util';

const PeerReview = LC.Object.extend('PeerReview');

function LCUserToUser(user) {
  return {
    id: user.getObjectId(),
    email: user.get('email'),
    username: user.get('username'),
  };
}

export async function createPeerReview(cycleSlug, revieweeId, reviewerEmail) {
  const reviewer = await findOrCreateUserByEmail(reviewerEmail);
  const reviewCycle = await getReviewCycleBySlug(cycleSlug);
  const reviewee = LC.Object.createWithoutData('_User', revieweeId);
  const peerReview = new PeerReview({
    reviewer,
    reviewCycle,
    reviewee,
    started: false,
  });
  return await peerReview.save();
}

export async function getUnfinishedPeerReviewers(cycle) {
  const reviewCycle = await getReviewCycleBySlug(cycle);
  const query1 = new LC.Query(PeerReview);
  query1.equalTo('reviewCycle', reviewCycle);
  query1.equalTo('finalized', false);
  const query2 = new LC.Query(PeerReview);
  query2.equalTo('reviewCycle', reviewCycle);
  query2.doesNotExist('finalized');
  const query = LC.Query.or(query1, query2);
  query.limit(1000);
  query.include('reviewer');
  const peerReviews = await query.find();
  return peerReviews.map((pr) => LCUserToUser(pr.get('reviewer')));
}

export async function deleteEmptyPeerReview(
  cycleSlug,
  revieweeId,
  reviewerEmail,
) {
  const reviewer = await findOrCreateUserByEmail(reviewerEmail);
  const reviewCycle = await getReviewCycleBySlug(cycleSlug);
  const reviewee = LC.Object.createWithoutData('_User', revieweeId);
  const query = new LC.Query(PeerReview);
  query.equalTo('reviewer', reviewer);
  query.equalTo('reviewCycle', reviewCycle);
  query.equalTo('reviewee', reviewee);
  const peerReview = await query.first();
  if (!peerReview) {
    console.error(
      `PeerReivew not found (reviewCycle: ${cycleSlug}, revieweeId: ${revieweeId}, reviewerEmail: ${reviewerEmail})`,
    );
    return false;
  }

  if (peerReview.get('started')) {
    return false;
  }

  await peerReview.destroy({ useMasterKey: true });
  return true;
}

export async function getPeerReviewsByReviewee(cycleSlug, revieweeId) {
  const reviewCycle = await getReviewCycleBySlug(cycleSlug);
  const reviewee = LC.Object.createWithoutData('_User', revieweeId);
  const query = new LC.Query(PeerReview);
  query.equalTo('reviewCycle', reviewCycle);
  query.equalTo('reviewee', reviewee);
  query.equalTo('finalized', true);
  query.include('reviewer');
  const peerReviews = await query.find();
  return peerReviews.map((r) =>
    filterObject(r.toJSON(), (v) => typeof v !== 'undefined'),
  );
}

export async function getPeerReviewerEmailsForUser(cycleSlug, revieweeId) {
  const reviewCycle = await getReviewCycleBySlug(cycleSlug);
  const reviewee = LC.Object.createWithoutData('_User', revieweeId);
  const query = new LC.Query(PeerReview);
  query.equalTo('reviewCycle', reviewCycle);
  query.equalTo('reviewee', reviewee);
  query.include('reviewer');
  const peerReviews = await query.find();
  return peerReviews.map((pr) => pr.get('reviewer').get('email'));
}

export async function getPeerReviewsByReviewer(cycleSlug, userId) {
  const reviewCycle = await getReviewCycleBySlug(cycleSlug);
  const reviewer = LC.Object.createWithoutData('_User', userId);
  const query = new LC.Query(PeerReview);
  query.equalTo('reviewCycle', reviewCycle);
  query.equalTo('reviewer', reviewer);
  query.include('reviewee');
  const peerReviews = await query.find();
  return peerReviews.map((pr) => {
    return {
      id: pr.getObjectId(),
      revieweeEmail: pr.get('reviewee').get('email'),
    };
  });
}

export async function getPeerReviewById(id) {
  const query = new LC.Query(PeerReview);
  query.include('reviewee');
  query.include('reviewer');
  query.include('reviewCycle');
  const peerReview = await query.get(id);
  const reviewee = peerReview.get('reviewee');
  const reviewer = peerReview.get('reviewer');
  const {
    analyticalSkillScore,
    analyticalSkillText,
    confidentialEval,
    cultureScore,
    cultureText,
    executionScore,
    executionText,
    familiarity,
    finalized,
    impactScore,
    impactText,
    strength,
    summary,
    weakness,
  } = peerReview.toJSON();
  return filterObject(
    {
      id: peerReview.getObjectId(),
      reviewee: LCUserToUser(reviewee),
      reviewer: LCUserToUser(reviewer),
      analyticalSkillScore,
      analyticalSkillText,
      confidentialEval,
      cultureScore,
      cultureText,
      executionScore,
      executionText,
      familiarity,
      finalized,
      impactScore,
      impactText,
      strength,
      summary,
      weakness,
    },
    (val) => typeof val !== 'undefined',
  );
}

export async function updatePeerReview(id, data) {
  const {
    analyticalSkillScore,
    analyticalSkillText,
    confidentialEval,
    cultureScore,
    cultureText,
    executionScore,
    executionText,
    familiarity,
    finalized,
    impactScore,
    impactText,
    started,
    strength,
    summary,
    weakness,
  } = data;
  const pr = LC.Object.createWithoutData('PeerReview', id);
  if (started !== null && started !== undefined) {
    pr.set('started', started);
  }
  return await pr.save(
    {
      analyticalSkillScore,
      analyticalSkillText,
      confidentialEval,
      cultureScore,
      cultureText,
      executionScore,
      executionText,
      familiarity,
      finalized,
      impactScore,
      impactText,
      strength,
      summary,
      weakness,
    },
    { useMasterKey: true },
  );
}
