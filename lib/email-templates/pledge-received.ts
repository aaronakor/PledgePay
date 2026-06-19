interface PledgeReceivedTemplateProps {
  borrowerName: string
  lenderName: string
  amount: number
  purpose: string
  dueDate: string
  pledgeLink: string
}

export function pledgeReceivedTemplate({
  borrowerName,
  lenderName,
  amount,
  purpose,
  dueDate,
  pledgeLink,
}: PledgeReceivedTemplateProps): string {
  return `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h1 style="font-size: 24px; color: #111827;">You have a new pledge</h1>
      <p style="color: #6B7280;">Hi ${borrowerName},</p>
      <p style="color: #6B7280;">
        ${lenderName} has created a pledge for you on PledgePay.
      </p>
      <div style="background: #F9FAFB; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0; color: #111827; font-size: 20px; font-weight: 600;">
          ₦${amount.toLocaleString('en-NG')}
        </p>
        <p style="margin: 4px 0 0; color: #6B7280; font-size: 14px;">${purpose}</p>
        <p style="margin: 4px 0 0; color: #6B7280; font-size: 14px;">Due: ${dueDate}</p>
      </div>
      <a href="${pledgeLink}"
         style="display: inline-block; background: #0D7C6E; color: white;
                padding: 12px 24px; border-radius: 8px; text-decoration: none;
                font-weight: 600; font-size: 14px;">
        Review &amp; Accept Pledge
      </a>
      <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px;">
        PledgePay — Accountability without harassment.
      </p>
    </div>
  `
}
