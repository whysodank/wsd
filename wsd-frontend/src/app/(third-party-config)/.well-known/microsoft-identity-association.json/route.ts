import { NextResponse } from 'next/server'

import config from '@/config'

export async function GET() {
  const data = {
    associatedApplications: [
      {
        applicationId: config.verification.microsoft.associatedApplicationID,
      },
    ],
  }
  return NextResponse.json(data)
}
