import { Router } from 'express';
import { connectToDatabase } from '../lib/mongoose.mjs';
import { requireFirebaseUser } from '../middleware/auth.mjs';
import { Order } from '../models/Order.mjs';
import { SiteConfig } from '../models/SiteConfig.mjs';
import { UserSpin } from '../models/UserSpin.mjs';
import { calculateDiscountAmount } from '../services/spin.mjs';

const router = Router();
const fallbackPackages = [
  { id: 'single-pack', label: 'Magic Tissue - 1 Piece', price: 249 },
  { id: 'double-pack', label: 'Magic Tissue - 2 Pieces', price: 449 },
];

function validatePayload(payload) {
  const requiredFields = ['name', 'phone', 'city', 'address', 'packageId'];
  const missing = requiredFields.filter((field) => !String(payload?.[field] || '').trim());
  return missing;
}

router.post('/', requireFirebaseUser, async (req, res) => {
  await connectToDatabase();

  const missingFields = validatePayload(req.body);

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
  }

  const siteConfig = await SiteConfig.findOne({ key: 'site' }).lean();
  const packages = Array.isArray(siteConfig?.packages) && siteConfig.packages.length > 0 ? siteConfig.packages : fallbackPackages;
  const selectedPackage = packages.find((entry) => entry.id === req.body.packageId);

  if (!selectedPackage) {
    return res.status(400).json({ error: 'Selected package is invalid' });
  }

  const availableSpin = await UserSpin.findOne({ userId: req.user.uid, used: false });
  const discountAmount = calculateDiscountAmount(selectedPackage.price, availableSpin?.discount);
  const totalPrice = Math.max(0, Number(selectedPackage.price || 0) - discountAmount);

  const order = await Order.create({
    name: String(req.body.name).trim(),
    phone: String(req.body.phone).trim(),
    city: String(req.body.city).trim(),
    address: String(req.body.address).trim(),
    productLabel: String(req.body.productLabel || 'Magic Tissue').trim(),
    packageLabel: selectedPackage.label,
    packageId: selectedPackage.id,
    quantity: Math.max(1, Number(req.body.quantity || 1)),
    basePrice: Number(selectedPackage.price || 0),
    totalPrice,
    paymentMethod: ['COD', 'bKash', 'Nagad'].includes(req.body.paymentMethod) ? req.body.paymentMethod : 'COD',
    status: 'pending',
    userId: req.user.uid,
    discount: {
      type: availableSpin?.discount?.type || 'none',
      value: availableSpin?.discount?.value || 0,
      amount: discountAmount,
      label: availableSpin?.rewardLabel || '',
      spinId: availableSpin?._id || null,
    },
    notes: String(req.body.notes || '').trim(),
  });

  if (availableSpin) {
    availableSpin.used = true;
    availableSpin.orderId = order._id;
    availableSpin.usedAt = new Date();
    await availableSpin.save();
  }

  return res.status(201).json({
    orderId: String(order._id),
    totalPrice: order.totalPrice,
    discount: order.discount,
  });
});

export default router;
