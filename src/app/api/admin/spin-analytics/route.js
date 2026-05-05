import dbConnect from '@/lib/mongodb';
import SpinOption from '@/models/SpinOption';
import UserSpin from '@/models/UserSpin';
import { requireAdminApi, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(request) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  await dbConnect();

  const [recentSpins, allSpins, options] = await Promise.all([
    UserSpin.find().sort({ createdAt: -1 }).limit(20).lean(),
    UserSpin.find().lean(),
    SpinOption.find().lean(),
  ]);

  const totalSpins = allSpins.length;
  const consumedSpins = allSpins.filter((spin) => spin.used).length;
  const availableSpins = allSpins.filter((spin) => !spin.used).length;
  const rewardedOrders = allSpins.filter((spin) => spin.discount?.type && spin.discount.type !== 'none').length;

  const rewardBreakdown = options.map((option) => ({
    id: String(option._id),
    label: option.label,
    count: allSpins.filter((spin) => String(spin.discount?.optionId || '') === String(option._id)).length,
  }));

  return Response.json({
    totalSpins,
    consumedSpins,
    availableSpins,
    rewardedOrders,
    rewardBreakdown,
    recentSpins,
  });
}
