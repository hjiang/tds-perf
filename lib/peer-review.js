import LC from 'leanengine';

import { findOrCreateUserByEmail } from './user';
import { getReviewCycleBySlug } from './review-cycle';

const PeerReview = LC.Object.extend('PeerReview');

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