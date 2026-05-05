import { Router } from 'express';
import { connectToDatabase } from '../lib/mongoose.mjs';
import { requireSpinUser } from '../middleware/auth.mjs';
import { SpinConfig } from '../models/SpinConfig.mjs';
import { SpinOption } from '../models/SpinOption.mjs';
import { UserSpin } from '../models/UserSpin.mjs';
import { pickWeightedReward } from '../services/spin.mjs';

const router = Router();

const seedOptions = [
  { label: '10% OFF', type: 'percentage', value: 10, probability: 30, active: true, color: '#e11d48' },
  { label: '50 TK OFF', type: 'fixed', value: 50, probability: 20, active: true, color: '#f97316' },
  { label: 'No Discount', type: 'none', value: 0, probability: 50, active: true, color: '#111827' },
];

async function ensureSpinState() {
  const optionCount = await SpinOption.countDocuments();

  if (optionCount === 0) {
    await SpinOption.insertMany(seedOptions);
  }

  let config = await SpinConfig.findOne({ key: 'default' });

  if (!config) {
    config = await SpinConfig.create({
      key: 'default',
      popupEnabled: true,
      minDelaySeconds: 5,
      maxDelaySeconds: 20,
      showProbability: 0.5,
      exitIntentEnabled: true,
      popupTitle: 'Spin the wheel for a surprise discount',
      popupSubtitle: 'Try your luck once and unlock a verified reward for checkout.',
      popupButtonText: 'Spin Now',
    });
  }

  return config;
}

router.get('/config', async (_req, res) => {
  await connectToDatabase();
  const config = await ensureSpinState();
  const options = await SpinOption.find({ active: true }).sort({ createdAt: 1 }).lean();

  return res.json({
    popupEnabled: config.popupEnabled,
    minDelaySeconds: config.minDelaySeconds,
    maxDelaySeconds: config.maxDelaySeconds,
    showProbability: config.showProbability,
    exitIntentEnabled: config.exitIntentEnabled,
    sideImageUrl: config.sideImageUrl,
    popupTitle: config.popupTitle,
    popupSubtitle: config.popupSubtitle,
    popupButtonText: config.popupButtonText,
    options: options.map((option) => ({
      id: String(option._id),
      label: option.label,
      type: option.type,
      value: option.value,
      probability: option.probability,
      color: option.color,
    })),
  });
});

router.get('/me', requireSpinUser, async (req, res) => {
  await connectToDatabase();
  const spin = await UserSpin.findOne({ userId: req.user.uid }).lean();

  return res.json({
    hasSpun: Boolean(spin),
    used: spin?.used || false,
    reward: spin
      ? {
          label: spin.rewardLabel,
          type: spin.discount?.type || 'none',
          value: spin.discount?.value || 0,
        }
      : null,
  });
});

router.post('/', requireSpinUser, async (req, res) => {
  await connectToDatabase();
  const existingSpin = await UserSpin.findOne({ userId: req.user.uid }).lean();

  if (existingSpin) {
    return res.status(409).json({
      error: 'Spin already used',
      reward: {
        label: existingSpin.rewardLabel,
        type: existingSpin.discount?.type || 'none',
        value: existingSpin.discount?.value || 0,
      },
      used: existingSpin.used,
    });
  }

  const config = await ensureSpinState();
  const options = await SpinOption.find({ active: true }).sort({ createdAt: 1 });

  let selected = null;

  if (config.forceResultOptionId) {
    selected = options.find((option) => String(option._id) === String(config.forceResultOptionId)) || null;
  }

  if (!selected) {
    selected = pickWeightedReward(options);
  }

  if (!selected) {
    return res.status(400).json({ error: 'No active spin options configured' });
  }

  const userSpin = await UserSpin.create({
    userId: req.user.uid,
    used: false,
    rewardLabel: selected.label,
    discount: {
      type: selected.type,
      value: selected.value,
      optionId: selected._id,
    },
  });

  return res.status(201).json({
    spinId: String(userSpin._id),
    reward: {
      id: String(selected._id),
      label: selected.label,
      type: selected.type,
      value: selected.value,
    },
  });
});

export default router;
