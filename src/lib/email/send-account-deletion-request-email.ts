import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function sendAccountDeletionRequestEmail(
  email: string,
  name?: string | null
) {
  await resend.emails.send({
    from: "Zaynex <no-reply@zaynex.tech>",
    to: email,
    subject:
      "Account Deletion Request Received",
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#111827;line-height:1.6;">

        <h1>Deletion Request Received</h1>

        <p>
          Hello ${name || "User"},
        </p>

        <p>
          We have received your request to delete your Zaynex account.
        </p>

        <p>
          Your request has been submitted successfully and is currently under review by our administration team.
        </p>

       <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:24px 0;">
                <strong>What happens next?</strong>

                <ul style="padding-left:20px;">
                    <li>Your request will be reviewed by an administrator.</li>
                    <li>You may cancel the request while it remains pending.</li>
                    <li>You will receive an email once a decision has been made.</li>
                    <li>No data will be removed until the request is approved.</li>
                </ul>
                </div>

                <div style="background:#fffbeb;padding:16px;border-radius:8px;border:1px solid #fde68a;margin:24px 0;">
                <strong>Important Information</strong>

                <p style="margin-top:10px;">
                    Account deletion requests are reviewed carefully to help protect your projects, files, invoices, support history, and other important account data.
                </p>

                <ul style="padding-left:20px;">
                    <li>Active projects may be interrupted.</li>
                    <li>Ongoing support requests may be terminated.</li>
                    <li>Project files and documents may become inaccessible.</li>
                    <li>Invoice and account history may be permanently removed.</li>
                    <li>Deleted account data may not be recoverable.</li>
                </ul>

                <p>
                    For these reasons, some deletion requests may require additional review before approval.
                </p>
                </div>

        <p>
            If your goal is simply to stop using the platform temporarily, we recommend contacting our support team before permanently deleting your account. In many cases we can help preserve your project history and important records.
        </p>
        <p>
          If you did not submit this request, please contact us immediately.
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