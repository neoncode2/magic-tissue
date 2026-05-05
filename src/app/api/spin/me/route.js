import dbConnect from '@/lib/mongodb';
import UserSpin from '@/models/UserSpin';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const [, token] = authHeader.split(' ');
    const spinUserId = String(token || '').trim();

    if (!spinUserId) {
      return Response.json({ error: 'Missing spin session token' }, { status: 401 });
    }

    if (!/^spin-user-[a-zA-Z0-9-]+$/.test(spinUserId)) {
      return Response.json({ error: 'Invalid spin session token' }, { status: 401 });
    }

    await dbConnect();
    const spin = await UserSpin.findOne({ userId: spinUserId }).lean();

    const hasActiveSpin = Boolean(spin && !spin.used);
    return Response.json({
      hasSpun: hasActiveSpin,
      used: spin?.used || false,
      reward: hasActiveSpin
        ? {
            label: spin.rewardLabel,
            type: spin.discount?.type || 'none',
            value: spin.discount?.value || 0,
          }
        : null,
    });
  } catch (error) {
    return Response.json({ error: 'Failed to load spin status', details: error.message }, { status: 500 });
  }
}
