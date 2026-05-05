import dbConnect from '@/lib/mongodb';
import SpinConfig from '@/models/SpinConfig';
import SpinOption from '@/models/SpinOption';
import { defaultSpinConfig, defaultSpinOptions } from '@/lib/spin-defaults';

async function ensureSpinState() {
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

  return config;
}

export async function GET() {
  try {
    await dbConnect();
    const config = await ensureSpinState();
    const options = await SpinOption.find({ active: true }).sort({ createdAt: 1 }).lean();

    return Response.json({
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
  } catch (error) {
    return Response.json({ error: 'Failed to load spin config', details: error.message }, { status: 500 });
  }
}
