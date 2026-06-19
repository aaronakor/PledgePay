interface WelcomeTemplateProps {
  fullName: string
  appUrl: string
}

export function welcomeTemplate({
  fullName,
  appUrl,
}: WelcomeTemplateProps): string {
  return `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h1 style="font-size: 24px; color: #111827;">Welcome to PledgePay</h1>
      <p style="color: #6B7280;">Hi ${fullName},</p>
      <p style="color: #6B7280;">
        Your account has been created successfully. You're now ready to create, manage, and track financial commitments with the people you trust.
      </p>
      <div style="background: #F9FAFB; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0; color: #111827; font-size: 14px; font-weight: 600;">Get started:</p>
        <ul style="color: #6B7280; font-size: 14px; padding-left: 20px; margin: 8px 0 0;">
          <li style="margin-bottom: 4px;">Complete your profile</li>
          <li style="margin-bottom: 4px;">Create your first pledge</li>
          <li>Invite someone you trust</li>
        </ul>
      </div>
      <a href="${appUrl}/dashboard"
         style="display: inline-block; background: #0D7C6E; color: white;
                padding: 12px 24px; border-radius: 8px; text-decoration: none;
                font-weight: 600; font-size: 14px;">
        Go to Dashboard
      </a>
      <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px;">
        PledgePay — Accountability without harassment.
      </p>
    </div>
  `
}
