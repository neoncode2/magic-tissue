import dbConnect from '@/lib/mongodb';
import SpinConfig from '@/models/SpinConfig';
import SpinOption from '@/models/SpinOption';
import UserSpin from '@/models/UserSpin';
import { defaultSpinConfig, defaultSpinOptions } from '@/lib/spin-defaults';
import { pickWeightedReward } from '@/lib/spin-utils';

export async function POST(request) {
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

    const optionCount = await SpinOption.countDocuments();
    if (optionCount === 0) {
      await SpinOption.insertMany(defaultSpinOptions);
    }

    let config = await SpinConfig.findOne({ key: 'default' });
    if (!config) {
      config = await SpinConfig.create({
        key: 'default',
        ...defaultSpinConfig,
      });
    }

    const existingSpin = await UserSpin.findOne({ userId: spinUserId }).lean();
    if (existingSpin) {
      return Response.json(
        {
          error: 'Spin already used',
          reward: {
            label: existingSpin.rewardLabel,
            type: existingSpin.discount?.type || 'none',
            value: existingSpin.discount?.value || 0,
          },
          used: existingSpin.used,
        },
        { status: 409 }
      );
    }

    const options = await SpinOption.find({ active: true }).sort({ createdAt: 1 });

    let selected = null;
    if (config.forceResultOptionId) {
      selected = options.find((option) => String(option._id) === String(config.forceResultOptionId)) || null;
    }

    if (!selected) {
      selected = pickWeightedReward(options);
    }

    if (!selected) {
      return Response.json({ error: 'No active spin options configured' }, { status: 400 });
    }

    const userSpin = await UserSpin.create({
      userId: spinUserId,
      used: false,
      rewardLabel: selected.label,
      discount: {
        type: selected.type,
        value: selected.value,
        optionId: selected._id,
      },
    });

    return Response.json(
      {
        spinId: String(userSpin._id),
        reward: {
          id: String(selected._id),
          label: selected.label,
          type: selected.type,
          value: selected.value,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ error: 'Failed to complete spin', details: error.message }, { status: 500 });
  }
}
