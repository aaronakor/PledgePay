import {
  emailLayout,
  emailHeader,
  emailSection,
  emailCard,
  emailButton,
  emailDivider,
  emailStep,
} from './layout'

interface WelcomeTemplateProps {
  fullName: string
  appUrl: string
}

export function welcomeTemplateHTML({
  fullName,
  appUrl,
}: WelcomeTemplateProps): string {
  const firstName = fullName.split(' ')[0] || fullName

  const content = `
    ${emailHeader('Welcome to PledgePay', 'Accountability without harassment.')}

    ${emailSection(`
      <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 26px; color: #374151;">Hi ${firstName},</p>
      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 26px; color: #374151;">
        Welcome to PledgePay. We're excited to help you build trust, keep commitments, and manage financial promises with confidence.
      </p>

      ${emailCard(`
        <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #111827;">✅ Your account has been created successfully.</p>
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #4B5563; line-height: 22px;">Now you can:</p>
        <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="width: 100%;">
          <tr>
            <td style="padding-bottom: 8px; font-size: 14px; color: #4B5563; line-height: 22px;">• Create your first pledge</td>
          </tr>
          <tr>
            <td style="padding-bottom: 8px; font-size: 14px; color: #4B5563; line-height: 22px;">• Track repayments</td>
          </tr>
          <tr>
            <td style="padding-bottom: 8px; font-size: 14px; color: #4B5563; line-height: 22px;">• Build your trust reputation</td>
          </tr>
          <tr>
            <td style="font-size: 14px; color: #4B5563; line-height: 22px;">• Stay accountable without awkward reminders</td>
          </tr>
        </table>
      `)}

      ${emailButton('Go to Dashboard', `${appUrl}/dashboard`)}
    `)}

    <tr>
      <td style="padding: 0 40px;">
        ${emailDivider()}
      </td>
    </tr>

    ${emailSection(`
      <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #111827; line-height: 28px;">What's next?</h2>
      ${emailStep(1, 'Complete your profile')}
      ${emailStep(2, 'Create your first pledge')}
      ${emailStep(3, 'Invite someone you trust')}
    `)}

    <tr>
      <td style="padding: 0 40px;">
        ${emailDivider()}
      </td>
    </tr>

    ${emailSection(`
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 0;">
            <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">Need help?</p>
            <p style="margin: 0; font-size: 15px; color: #4B5563; line-height: 24px;">Contact us anytime.<br><a href="mailto:support@pledgepay.com" style="color: #059669; text-decoration: none; font-weight: 500;">support@pledgepay.com</a></p>
          </td>
        </tr>
      </table>
    `)}
  `

  return emailLayout({
    previewText: 'Your PledgePay account is ready. Start creating and tracking commitments today.',
    children: content,
  })
}

export function welcomeTemplateText({
  fullName,
  appUrl,
}: WelcomeTemplateProps): string {
  const firstName = fullName.split(' ')[0] || fullName
  return `Welcome to PledgePay

Hi ${firstName},

Welcome to PledgePay. We're excited to help you build trust, keep commitments, and manage financial promises with confidence.

Your account has been created successfully.

Now you can:
- Create your first pledge
- Track repayments
- Build your trust reputation
- Stay accountable without awkward reminders

Go to Dashboard: ${appUrl}/dashboard

What's next?
1. Complete your profile
2. Create your first pledge
3. Invite someone you trust

Need help?
Contact us anytime: support@pledgepay.com

PledgePay
Building trust through accountability.

This email was sent because you created a PledgePay account.`
}
