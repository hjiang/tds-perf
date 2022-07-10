import LC from 'leanengine';

export const ReviewCycle = LC.Object.extend('ReviewCycle');

export async function getReviewCycleBySlug(slug) {
  let query = new LC.Query(ReviewCycle);
  query.equalTo('slug', slug);
  return await query.first();
}
