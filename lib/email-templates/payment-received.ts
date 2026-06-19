interface PaymentReceivedTemplateProps {
  lenderName: string
  borrowerName: string
  amount: number
  outstandingBalance: number
  pledgeLink: string
}

export function paymentReceivedTemplate({
  lenderName,
  borrowerName,
  amount,
  outstandingBalance,
  pledgeLink,
}: PaymentReceivedTemplateProps): string {
  return `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h1 style="font-size: 24px; color: #111827;">Payment received</h1>
      <p style="color: #6B7280;">Hi ${lenderName},</p>
      <p style="color: #6B7280;">
        ${borrowerName} has made a repayment of ₦${amount.toLocaleString('en-NG')}.
      </p>
      <p style="color: #6B7280;">
        Outstanding balance: ₦${outstandingBalance.toLocaleString('en-NG')}
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
