import dbConnect from '@/lib/mongodb';
import SiteConfig from '@/models/SiteConfig';
import { mergeSiteConfig, siteDefaults } from '@/lib/siteDefaults';

export async function getOrCreateSiteConfig() {
  await dbConnect();

  let config = await SiteConfig.findOne({ key: 'site' });

  if (!config) {
    config = await SiteConfig.create({
      key: 'site',
      ...siteDefaults,
    });
  }

  return config;
}

export async function getMergedSiteConfig() {
  const config = await getOrCreateSiteConfig();
  return mergeSiteConfig(config.toObject());
}
