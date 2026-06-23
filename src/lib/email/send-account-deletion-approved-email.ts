import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function sendAccountDeletionApprovedEmail(
  email: string,
  name?: string | null
) {
  await resend.emails.send({
    from: "Zaynex <no-reply@zaynex.tech>",
    to: email,
    subject:
      "Account Deletion Request Approved",
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#111827;line-height:1.6;">

        <h1>Deletion Request Approved</h1>

        <p>
          Hello ${name || "User"},
        </p>

        <p>
          Your account deletion request has been approved by the Zaynex administration team.
        </p>

        <p>
          Your account is scheduled for permanent deletion.
        </p>

        <div style="background:#fef2f2;padding:16px;border-radius:8px;border:1px solid #fecaca;margin:24px 0;">
          <strong>Important</strong>

          <ul style="padding-left:20px;">
            <li>Your account data may be permanently removed.</li>
            <li>Access to projects and files may be lost.</li>
            <li>This action may not be reversible.</li>
          </ul>
        </div>

        <p>
          If you believe this request was approved in error, contact support immediately.
        </p>

        <p>
          Email: support@zaynex.tech<br/>
          Website: https://www.zaynex.tech
        </p>

        <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />

        <p style="font-size:14px;color:#6b7280;">
          This is an automated notification from Zaynex.
        </p>

        <p>
          Regards,<br />
          <strong>Zaynex Team</strong>
        </p>

      </div>
    `,
  });
}