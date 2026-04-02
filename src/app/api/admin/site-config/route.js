import { requireAdminApi, unauthorizedResponse } from '@/lib/admin-auth';
import { getOrCreateSiteConfig } from '@/lib/site-config';
import { mergeSiteConfig } from '@/lib/siteDefaults';

export async function GET(request) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  const config = await getOrCreateSiteConfig();
  return Response.json(mergeSiteConfig(config.toObject()));
}

export async function PATCH(request) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  try {
    const updates = await request.json();
    const config = await getOrCreateSiteConfig();

    Object.assign(config, mergeSiteConfig(updates));
    await config.save();

    return Response.json({
      message: 'Site config updated',
      config: mergeSiteConfig(config.toObject()),
    });
  } catch (error) {
    return Response.json({ error: 'Failed to update config', details: error.message }, { status: 500 });
  }
}
