import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import { requireAdminApi, unauthorizedResponse } from '@/lib/admin-auth';

function normalizeReviewUpdates(input = {}) {
  const updates = {};

  if (Object.prototype.hasOwnProperty.call(input, 'name')) {
    updates.name = String(input.name || '').trim() || 'Verified Customer';
  }

  if (Object.prototype.hasOwnProperty.call(input, 'rating')) {
    updates.rating = Math.min(5, Math.max(1, Number(input.rating || 5)));
  }

  if (Object.prototype.hasOwnProperty.call(input, 'comment')) {
    updates.comment = String(input.comment || '').trim();
  }

  if (Object.prototype.hasOwnProperty.call(input, 'image')) {
    updates.image = String(input.image || '').trim();
  }

  if (Object.prototype.hasOwnProperty.call(input, 'verified')) {
    updates.verified = Boolean(input.verified);
  }

  return updates;
}

export async function PATCH(request, context) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  await dbConnect();

  try {
    const { id } = await context.params;
    const payload = await request.json();
    const updates = normalizeReviewUpdates(payload);
    const review = await Review.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!review) {
      return Response.json({ error: 'Review not found' }, { status: 404 });
    }

    return Response.json(review);
  } catch (error) {
    return Response.json({ error: 'Failed to update review', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  await dbConnect();

  try {
    const { id } = await context.params;
    const deleted = await Review.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json({ error: 'Review not found' }, { status: 404 });
    }

    return Response.json({ message: 'Review deleted' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete review', details: error.message }, { status: 500 });
  }
}
