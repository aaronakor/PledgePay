interface FundingConfirmedTemplateProps {
  borrowerName: string
  lenderName: string
  amount: number
  dueDate: string
  pledgeLink: string
}

export function fundingConfirmedTemplate({
  borrowerName,
  lenderName,
  amount,
  dueDate,
  pledgeLink,
}: FundingConfirmedTemplateProps): string {
  return `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h1 style="font-size: 24px; color: #111827;">Funding confirmed</h1>
      <p style="color: #6B7280;">Hi ${borrowerName},</p>
      <p style="color: #6B7280;">
        ${lenderName} has confirmed funding of ₦${amount.toLocaleString('en-NG')}.
      </p>
      <p style="color: #6B7280;">
        Repayment tracking has begun. Your first repayment is due on ${dueDate}.
      </p>
      <a href="${pledgeLink}"
         style="display: inline-block; background: #0D7C6E; color: white;
                padding: 12px 24px; border-radius: 8px; text-decoration: none;
                font-weight: 600; font-size: 14px;">
        View Pledge
      </a>
      <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px;">
        PledgePay — Accountability without harassment.
      </p>
    </div>
  `
}
