import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function sendAccountDeletionRejectedEmail(
  email: string,
  name?: string | null
) {
  await resend.emails.send({
    from: "Zaynex <no-reply@zaynex.tech>",
    to: email,
    subject:
      "Account Deletion Request Not Approved",
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#111827;line-height:1.6;">

        <h1>Account Deletion Request Review</h1>

        <p>
          Hello ${name || "User"},
        </p>

        <p>
          Thank you for your request. After reviewing your account, we are unable to approve the deletion request at this time.
        </p>

        <div style="background:#fffbeb;padding:16px;border-radius:8px;border:1px solid #fde68a;margin:24px 0;">
          <strong>Why was the request not approved?</strong>

          <p style="margin-top:10px;">
            Our team reviews deletion requests carefully to help prevent the loss of important account information and interruptions to active services.
          </p>

          <ul style="padding-left:20px;">
            <li>Active projects may still be in progress.</li>
            <li>Open support tickets may require further communication.</li>
            <li>Important files, project assets, or documents may still be associated with the account.</li>
            <li>Invoice and project history may be needed for future reference.</li>
            <li>Permanent deletion could result in irreversible data loss.</li>
          </ul>
        </div>

        <p>
          Your account remains active and accessible, and no data has been removed.
        </p>

        <div style="margin:32px 0;">
          <a
            href="https://client.zaynex.tech"
            style="
              display:inline-block;
              background:#111827;
              color:#ffffff;
              text-decoration:none;
              padding:12px 20px;
              border-radius:8px;
              font-weight:600;
            "
          >
            Open Client Portal
          </a>
        </div>

        <p>
          If your circumstances change or you still wish to proceed with account deletion, please contact our support team so we can review your request further.
        </p>

        <div style="background:#f9fafb;padding:16px;border-radius:8px;">
          <strong>Support Information</strong>

          <p style="margin-top:10px;">
            Email: support@zaynex.tech
          </p>

          <p>
            Website: https://www.zaynex.tech
          </p>
        </div>

        <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />

        <p style="font-size:14px;color:#6b7280;">
          This is an automated notification from Zaynex. Please do not reply directly to this email.
        </p>

        <p>
          Regards,<br />
          <strong>Zaynex Team</strong>
        </p>

      </div>
    `,
  });
}