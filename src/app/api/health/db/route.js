import dbConnect from '@/lib/mongodb';
import { getMongoDebugInfo } from '@/lib/env';

export async function GET() {
  try {
    const connection = await dbConnect();

    return Response.json({
      ok: true,
      status: 'connected',
      dbName: connection.connection?.name || process.env.MONGODB_DB_NAME || 'magic-tissue',
      readyState: connection.connection?.readyState ?? null,
    });
  } catch (error) {
    const debug = getMongoDebugInfo();

    return Response.json(
      {
        ok: false,
        status: 'disconnected',
        error: 'Database connection failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        debug: process.env.NODE_ENV === 'development'
          ? {
              username: debug.username,
              cluster: debug.cluster,
              dbName: debug.dbName,
              hasUri: debug.hasUri,
            }
          : undefined,
      },
      { status: 500 }
    );
  }
}
