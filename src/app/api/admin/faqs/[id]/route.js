import dbConnect from '@/lib/mongodb';
import FAQ from '@/models/FAQ';
import { requireAdminApi, unauthorizedResponse } from '@/lib/admin-auth';

export async function PATCH(request, context) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  await dbConnect();

  try {
    const { id } = await context.params;
    const updates = await request.json();
    const faq = await FAQ.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!faq) {
      return Response.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return Response.json(faq);
  } catch (error) {
    return Response.json({ error: 'Failed to update FAQ', details: error.message }, { status: 500 });
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
    const deleted = await FAQ.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return Response.json({ message: 'FAQ deleted' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete FAQ', details: error.message }, { status: 500 });
  }
}
