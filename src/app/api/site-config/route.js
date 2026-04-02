import { getMergedSiteConfig } from '@/lib/site-config';

export async function GET() {
  try {
    const config = await getMergedSiteConfig();
    return Response.json(config);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch site config', details: error.message }, { status: 500 });
  }
}
