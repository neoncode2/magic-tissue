import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import SiteConfig from '@/models/SiteConfig';
import UserSpin from '@/models/UserSpin';

const fallbackPackages = [
  { id: 'single-pack', label: 'Magic Tissue - 1 Piece', price: 249 },
  { id: 'double-pack', label: 'Magic Tissue - 2 Pieces', price: 449 },
];

function calculateDiscountAmount(basePrice, discount) {
  const safeBasePrice = Math.max(0, Number(basePrice || 0));

  if (!discount || discount.type === 'none') {
    return 0;
  }

  if (discount.type === 'percentage') {
    return Math.min(safeBasePrice, Math.round((safeBasePrice * Number(discount.value || 0)) / 100));
  }

  if (discount.type === 'fixed') {
    return Math.min(safeBasePrice, Math.max(0, Number(discount.value || 0)));
  }

  return 0;
}

function validatePayload(payload) {
  const requiredFields = ['name', 'phone', 'city', 'address', 'packageId'];
  return requiredFields.filter((field) => !String(payload?.[field] || '').trim());
}

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
    const payload = await request.json();
    const missingFields = validatePayload(payload);

    if (missingFields.length > 0) {
      return Response.json({ error: `Missing fields: ${missingFields.join(', ')}` }, { status: 400 });
    }

    const siteConfig = await SiteConfig.findOne({ key: 'site' }).lean();
    const packages = Array.isArray(siteConfig?.packages) && siteConfig.packages.length > 0 ? siteConfig.packages : fallbackPackages;
    const selectedPackage = packages.find((entry) => entry.id === payload.packageId);

    if (!selectedPackage) {
      return Response.json({ error: 'Selected package is invalid' }, { status: 400 });
    }

    const availableSpin = await UserSpin.findOne({ userId: spinUserId, used: false });
    const discountAmount = calculateDiscountAmount(selectedPackage.price, availableSpin?.discount);
    const totalPrice = Math.max(0, Number(selectedPackage.price || 0) - discountAmount);

    const order = await Order.create({
      name: String(payload.name).trim(),
      phone: String(payload.phone).trim(),
      city: String(payload.city).trim(),
      address: String(payload.address).trim(),
      productLabel: String(payload.productLabel || 'Magic Tissue').trim(),
      packageLabel: selectedPackage.label,
      packageId: selectedPackage.id,
      quantity: Math.max(1, Number(payload.quantity || 1)),
      basePrice: Number(selectedPackage.price || 0),
      totalPrice,
      paymentMethod: ['COD', 'bKash', 'Nagad'].includes(payload.paymentMethod) ? payload.paymentMethod : 'COD',
      status: 'pending',
      userId: spinUserId,
      discount: {
        type: availableSpin?.discount?.type || 'none',
        value: availableSpin?.discount?.value || 0,
        amount: discountAmount,
        label: availableSpin?.rewardLabel || '',
        spinId: availableSpin?._id || null,
      },
      notes: String(payload.notes || '').trim(),
    });

    if (availableSpin) {
      availableSpin.used = true;
      availableSpin.orderId = order._id;
      availableSpin.usedAt = new Date();
      await availableSpin.save();
    }

    return Response.json(
      {
        orderId: String(order._id),
        totalPrice: order.totalPrice,
        discount: order.discount,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ error: 'Failed to place order', details: error.message }, { status: 500 });
  }
}
