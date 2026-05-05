import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import { NextResponse } from 'next/server';
import { requireAdminApi, unauthorizedResponse } from '@/lib/admin-auth';

function normalizeReviewPayload(input = {}) {
  return {
    name: String(input?.name || '').trim() || 'Verified Customer',
    rating: Math.min(5, Math.max(1, Number(input?.rating || 5))),
    comment: String(input?.comment || '').trim(),
    image: String(input?.image || '').trim(),
    verified: Boolean(input?.verified),
  };
}

export async function GET(request) {
  try {
    const admin = await requireAdminApi(request);

    if (!admin) {
      return unauthorizedResponse();
    }

    await dbConnect();

    const reviews = await Review.find({}).sort({ createdAt: -1 });

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error('GET Reviews Error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = await requireAdminApi(request);

    if (!admin) {
      return unauthorizedResponse();
    }

    await dbConnect();

    const body = await request.json();
    const review = new Review(normalizeReviewPayload(body));
    await review.save();

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('POST Review Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create review' }, { status: 500 });
  }
}
