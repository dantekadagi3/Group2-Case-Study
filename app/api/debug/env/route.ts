import { NextResponse } from "next/server"

export async function GET() {
  try {
    const debug = {
      QUIKK_API_KEY: process.env.QUIKK_API_KEY ? `${process.env.QUIKK_API_KEY.substring(0, 8)}...` : 'NOT SET',
      QUIKK_API_SECRET: process.env.QUIKK_API_SECRET ? `${process.env.QUIKK_API_SECRET.substring(0, 8)}...` : 'NOT SET',
      MPESA_SHORTCODE: process.env.MPESA_SHORTCODE || 'NOT SET',
      NEXT_PUBLIC_QUIKK_CALLBACK_URL: process.env.NEXT_PUBLIC_QUIKK_CALLBACK_URL || 'NOT SET',
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'NOT SET',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20)}...` : 'NOT SET',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'NOT SET',
      nodeEnv: process.env.NODE_ENV || 'NOT SET'
    }

    return NextResponse.json({ 
      message: 'Environment Debug Info',
      debug,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[Debug] Environment check error:', error)
    return NextResponse.json({ error: 'Debug check failed' }, { status: 500 })
  }
}