import dbConnect from '@/lib/mongodb';
import FAQ from '@/models/FAQ';

export async function GET(request) {
  await dbConnect();

  try {
    const faqs = await FAQ.find({ active: true }).sort({ order: 1 });
    return new Response(JSON.stringify(faqs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch FAQs' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const faq = new FAQ(body);
    await faq.save();

    return new Response(JSON.stringify(faq), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create FAQ' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
