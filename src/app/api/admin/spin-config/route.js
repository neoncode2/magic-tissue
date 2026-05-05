import dbConnect from '@/lib/mongodb';
import SpinConfig from '@/models/SpinConfig';
import { requireAdminApi, unauthorizedResponse } from '@/lib/admin-auth';
import { defaultSpinConfig } from '@/lib/spin-defaults';
import { normalizeSpinConfigPayload } from '@/lib/spin-utils';

async function getOrCreateSpinConfig() {
  let config = await SpinConfig.findOne({ key: 'default' });

  if (!config) {
    config = await SpinConfig.create({
      key: 'default',
      ...defaultSpinConfig,
    });
  }

  return config;
}

export async function GET(request) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  await dbConnect();
  const config = await getOrCreateSpinConfig();
  return Response.json(config);
}

export async function PATCH(request) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  await dbConnect();

  try {
    const config = await getOrCreateSpinConfig();
    const payload = normalizeSpinConfigPayload(await request.json());
    Object.assign(config, payload);
    await config.save();
    return Response.json(config);
  } catch (error) {
    return Response.json({ error: 'Failed to update spin config', details: error.message }, { status: 500 });
  }
}
