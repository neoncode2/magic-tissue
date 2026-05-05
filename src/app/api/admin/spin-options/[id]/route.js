import dbConnect from '@/lib/mongodb';
import SpinOption from '@/models/SpinOption';
import SpinConfig from '@/models/SpinConfig';
import { requireAdminApi, unauthorizedResponse } from '@/lib/admin-auth';
import { normalizeSpinOptionPayload } from '@/lib/spin-utils';

export async function PATCH(request, context) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  await dbConnect();

  try {
    const { id } = await context.params;
    const option = await SpinOption.findByIdAndUpdate(id, normalizeSpinOptionPayload(await request.json()), {
      new: true,
      runValidators: true,
    });

    if (!option) {
      return Response.json({ error: 'Spin option not found' }, { status: 404 });
    }

    return Response.json(option);
  } catch (error) {
    return Response.json({ error: 'Failed to update spin option', details: error.message }, { status: 500 });
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
    await SpinConfig.updateMany({ forceResultOptionId: id }, { $set: { forceResultOptionId: null } });
    const deleted = await SpinOption.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json({ error: 'Spin option not found' }, { status: 404 });
    }

    return Response.json({ message: 'Spin option deleted' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete spin option', details: error.message }, { status: 500 });
  }
}
