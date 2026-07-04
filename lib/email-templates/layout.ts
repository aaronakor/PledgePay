interface EmailLayoutProps {
  previewText: string
  children: string
}

export function emailLayout({ previewText, children }: EmailLayoutProps): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
      <title>PledgePay</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: Inter, Arial, Helvetica, sans-serif;">
      <div style="display: none; max-height: 0px; overflow: hidden;">
        ${previewText}
      </div>
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F3F4F6; padding: 40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden;">
              ${children}
            </table>
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

export function emailHeader(title: string, subtitle: string): string {
  return `
    <tr>
      <td style="padding: 40px 40px 20px 40px; text-align: center;">
        <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #10B981;">PledgePay</p>
        <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #111827; line-height: 36px;">${title}</h1>
        <p style="margin: 8px 0 0 0; font-size: 16px; color: #6B7280; line-height: 24px;">${subtitle}</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 40px;">
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 0;">
      </td>
    </tr>
  `
}

export function emailSection(content: string): string {
  return `
    <tr>
      <td style="padding: 32px 40px;">
        ${content}
      </td>
    </tr>
  `
}

export function emailCard(content: string): string {
  return `
    <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 24px;">
      ${content}
    </div>
  `
}

export function emailButton(text: string, url: string): string {
  return `
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 8px 0;">
          <table role="presentation" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="background-color: #059669; border-radius: 8px;">
                <a href="${url}" style="display: inline-block; background-color: #059669; color: #FFFFFF; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 36px; border-radius: 8px; line-height: 24px; mso-hide: all;">${text}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `
}

export function emailDivider(): string {
  return `
    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 0;">
  `
}

export function emailStep(number: number, text: string): string {
  return `
    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="width: 100%; margin-bottom: 12px;">
      <tr>
        <td width="32" valign="top" style="padding: 0;">
          <table role="presentation" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td width="28" height="28" align="center" style="background-color: #D1FAE5; border-radius: 50%; font-size: 14px; font-weight: 700; color: #059669; line-height: 28px;">
                ${number}
              </td>
            </tr>
          </table>
        </td>
        <td style="padding: 0 0 0 12px; font-size: 16px; line-height: 28px; color: #374151;">
          ${text}
        </td>
      </tr>
    </table>
  `
}
