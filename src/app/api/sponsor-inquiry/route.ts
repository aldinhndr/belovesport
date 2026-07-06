import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate
    if (!body.email || !body.company || !body.tier) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // TODO: Save inquiry to database
    // TODO: Send notification email to business team

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry received. Our team will contact you soon.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Sponsor inquiry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
