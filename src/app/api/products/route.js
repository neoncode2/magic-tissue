import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request) {
  await dbConnect();

  try {
    const products = await Product.find({ inStock: true });
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const product = new Product(body);
    await product.save();

    return new Response(JSON.stringify(product), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create product' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
