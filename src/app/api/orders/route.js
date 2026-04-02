import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request) {
  await dbConnect();

  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(orders), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const order = new Order(body);
    await order.save();

    return new Response(JSON.stringify(order), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create order', details: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
