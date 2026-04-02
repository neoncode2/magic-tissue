import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Review from '@/models/Review';
import { requireAdminApi, unauthorizedResponse } from '@/lib/admin-auth';

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date) {
  const value = new Date(date);
  const day = value.getDay();
  const diff = value.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(value.setDate(diff));
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfYear(date) {
  return new Date(date.getFullYear(), 0, 1);
}

export async function GET(request) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  await dbConnect();

  const now = new Date();
  const [orders, pendingReviews] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).lean(),
    Review.countDocuments({ verified: false }),
  ]);

  const nonCancelled = orders.filter((order) => order.status !== 'cancelled');
  const totalRevenue = nonCancelled.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);

  const periods = {
    daily: startOfDay(now),
    weekly: startOfWeek(now),
    monthly: startOfMonth(now),
    yearly: startOfYear(now),
  };

  const periodStats = Object.fromEntries(
    Object.entries(periods).map(([key, start]) => {
      const entries = nonCancelled.filter((order) => new Date(order.createdAt) >= start);
      return [
        key,
        {
          orders: entries.length,
          revenue: entries.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0),
        },
      ];
    })
  );

  const revenueByMonth = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const monthOrders = nonCancelled.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getFullYear() === date.getFullYear() && orderDate.getMonth() === date.getMonth();
    });

    return {
      label: date.toLocaleString('en-US', { month: 'short' }),
      revenue: monthOrders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0),
      orders: monthOrders.length,
    };
  });

  const statusBreakdown = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  }));

  return Response.json({
    totalOrders: orders.length,
    totalRevenue,
    pendingReviews,
    activeCustomers: new Set(orders.map((order) => order.phone)).size,
    periodStats,
    statusBreakdown,
    revenueByMonth,
    recentOrders: orders.slice(0, 6),
  });
}
