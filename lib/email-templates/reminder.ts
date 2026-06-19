interface ReminderTemplateProps {
  borrowerName: string
  lenderName: string
  amount: number
  dueDate: string
  daysLeft: number
  pledgeLink: string
}

export function reminderTemplate({
  borrowerName,
  lenderName,
  amount,
  dueDate,
  daysLeft,
  pledgeLink,
}: ReminderTemplateProps): string {
  return `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h1 style="font-size: 24px; color: #111827;">Repayment reminder</h1>
      <p style="color: #6B7280;">Hi ${borrowerName},</p>
      <p style="color: #6B7280;">
        This is a reminder about your pledge to ${lenderName}.
      </p>
      <div style="background: #F9FAFB; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0; color: #111827; font-size: 20px; font-weight: 600;">
          ₦${amount.toLocaleString('en-NG')}
        </p>
        <p style="margin: 4px 0 0; color: #6B7280; font-size: 14px;">
          Due: ${dueDate} (${daysLeft} days left)
        </p>
      </div>
      <a href="${pledgeLink}"
         style="display: inline-block; background: #0D7C6E; color: white;
                padding: 12px 24px; border-radius: 8px; text-decoration: none;
                font-weight: 600; font-size: 14px;">
        Pay Now
      </a>
      <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px;">
        PledgePay — Accountability without harassment.
      </p>
    </div>
  `
}
