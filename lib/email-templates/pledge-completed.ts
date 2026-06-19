interface PledgeCompletedTemplateProps {
  name: string
  counterpartyName: string
  amount: number
  role: 'lender' | 'borrower'
}

export function pledgeCompletedTemplate({
  name,
  counterpartyName,
  amount,
  role,
}: PledgeCompletedTemplateProps): string {
  const message =
    role === 'lender'
      ? `${counterpartyName} has fully repaid the pledge of ₦${amount.toLocaleString('en-NG')}.`
      : `You have fully repaid your pledge of ₦${amount.toLocaleString('en-NG')} to ${counterpartyName}.`

  return `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h1 style="font-size: 24px; color: #111827;">Pledge completed</h1>
      <p style="color: #6B7280;">Hi ${name},</p>
      <p style="color: #6B7280;">${message}</p>
      <p style="color: #6B7280;">
        Your reputation score has been updated.
      </p>
      <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px;">
        PledgePay — Accountability without harassment.
      </p>
    </div>
  `
}
