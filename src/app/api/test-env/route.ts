import { NextResponse } from 'next/server';

export async function GET() {
  const mongoUri = process.env.MONGODB_URI;
  
  return NextResponse.json({
    hasMongoUri: !!mongoUri,
    uriPreview: mongoUri ? mongoUri.substring(0, 30) + '...' : 'NOT FOUND',
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('MONGO')),
  });
}

