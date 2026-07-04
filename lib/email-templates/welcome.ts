interface WelcomeTemplateProps {
  fullName: string
  appUrl: string
}

export function welcomeTemplateHTML({
  fullName,
  appUrl,
}: WelcomeTemplateProps): string {
  const firstName = fullName.split(' ')[0] || fullName;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to PledgePay</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: Inter, Arial, Helvetica, sans-serif;">
      <div style="display: none; max-height: 0px; overflow: hidden;">
        Your PledgePay account is ready. Start creating and tracking commitments today.
      </div>
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F3F4F6; padding: 40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
              
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center; border-bottom: 1px solid #E5E7EB;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #111827;">Welcome to PledgePay</h1>
                  <p style="margin: 8px 0 0 0; font-size: 16px; color: #6B7280;">Accountability without harassment.</p>
                </td>
              </tr>
              
              <!-- Greeting & Intro -->
              <tr>
                <td style="padding: 40px 40px 20px 40px;">
                  <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #374151;">Hi ${firstName},</p>
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #374151;">
                    Welcome to PledgePay. We're excited to help you build trust, keep commitments, and manage financial promises with confidence.
                  </p>
                  
                  <!-- Main Content Card -->
                  <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
                    <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #111827;">✅ Your account has been created successfully.</p>
                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #4B5563;">Now you can:</p>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="width: 100%;">
                      <tr>
                        <td style="padding-bottom: 8px; font-size: 14px; color: #4B5563;">• Create your first pledge</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px; font-size: 14px; color: #4B5563;">• Track repayments</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px; font-size: 14px; color: #4B5563;">• Build your trust reputation</td>
                      </tr>
                      <tr>
                        <td style="font-size: 14px; color: #4B5563;">• Stay accountable without awkward reminders</td>
                      </tr>
                    </table>
                  </div>

                  <!-- CTA -->
                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <a href="${appUrl}/dashboard" style="display: inline-block; background-color: #10B981; color: #FFFFFF; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px;">Go to Dashboard</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Secondary Section -->
              <tr>
                <td style="padding: 20px 40px 32px 40px;">
                  <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #111827;">What's next?</h2>
                  <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="width: 100%;">
                    <tr>
                      <td style="padding-bottom: 12px; font-size: 16px; color: #4B5563;">1. Complete your profile</td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 12px; font-size: 16px; color: #4B5563;">2. Create your first pledge</td>
                    </tr>
                    <tr>
                      <td style="font-size: 16px; color: #4B5563;">3. Invite someone you trust</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Support Section -->
              <tr>
                <td style="padding: 0 40px;">
                  <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 0;">
                </td>
              </tr>
              <tr>
                <td style="padding: 32px 40px 40px 40px; text-align: center;">
                  <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">Need help?</p>
                  <p style="margin: 0; font-size: 16px; color: #4B5563;">Contact us anytime. <a href="mailto:support@pledgepay.com" style="color: #10B981; text-decoration: none;">support@pledgepay.com</a></p>
                </td>
              </tr>
            </table>

            <!-- Footer -->
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px;">
              <tr>
                <td style="padding: 32px 40px; text-align: center;">
                  <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #6B7280;">PledgePay</p>
                  <p style="margin: 0 0 16px 0; font-size: 14px; color: #9CA3AF;">Building trust through accountability.</p>
                  <p style="margin: 0; font-size: 12px; color: #9CA3AF;">This email was sent because you created a PledgePay account.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

export function welcomeTemplateText({
  fullName,
  appUrl,
}: WelcomeTemplateProps): string {
  const firstName = fullName.split(' ')[0] || fullName;
  return \`Welcome to PledgePay

Hi \${firstName},

Welcome to PledgePay. We're excited to help you build trust, keep commitments, and manage financial promises with confidence.

Your account has been created successfully.

Now you can:
- Create your first pledge
- Track repayments
- Build your trust reputation
- Stay accountable without awkward reminders

Go to Dashboard: \${appUrl}/dashboard

What's next?
1. Complete your profile
2. Create your first pledge
3. Invite someone you trust

Need help?
Contact us anytime: support@pledgepay.com

PledgePay
Building trust through accountability.

This email was sent because you created a PledgePay account.\`
}
