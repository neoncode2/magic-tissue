import dbConnect from '@/lib/mongodb';
import SpinOption from '@/models/SpinOption';
import { requireAdminApi, unauthorizedResponse } from '@/lib/admin-auth';
import { defaultSpinOptions } from '@/lib/spin-defaults';
import { normalizeSpinOptionPayload } from '@/lib/spin-utils';

async function ensureSeedOptions() {
  const count = await SpinOption.countDocuments();

  if (count === 0) {
    await SpinOption.insertMany(defaultSpinOptions);
  }
}

export async function GET(request) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  await dbConnect();
  await ensureSeedOptions();

  const options = await SpinOption.find().sort({ createdAt: 1 }).lean();
  return Response.json(options);
}

export async function POST(request) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  await dbConnect();

  try {
    const payload = normalizeSpinOptionPayload(await request.json());
    const option = await SpinOption.create(payload);
    return Response.json(option, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to create spin option', details: error.message }, { status: 500 });
  }
}
