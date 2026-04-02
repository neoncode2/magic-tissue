import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

export async function GET(request) {
  await dbConnect();

  try {
    const reviews = await Review.find({ verified: true }).sort({ createdAt: -1 });
    return new Response(JSON.stringify(reviews), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch reviews' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const review = new Review({
      ...body,
      verified: false,
    });
    await review.save();

    return new Response(JSON.stringify(review), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create review' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
