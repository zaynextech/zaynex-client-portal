import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function sendAccountSuspendedEmail(
  email: string,
  name?: string | null
) {
  await resend.emails.send({
    from: "Zaynex <no-reply@zaynex.tech>",
    to: email,
    subject:
      "Your Zaynex Account Has Been Suspended",
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#111827;line-height:1.6;">

        <h1 style="margin-bottom:8px;">
          Account Suspended
        </h1>

        <p>
          Hello ${name || "User"},
        </p>

        <p>
          We would like to inform you that your Zaynex account has been temporarily suspended by our administration team.
        </p>

        <p>
          While your account is suspended, access to the client portal and related services has been restricted.
        </p>

        <div style="background:#fef2f2;padding:16px;border-radius:8px;border:1px solid #fecaca;margin:24px 0;">
          <h3 style="margin-top:0;color:#b91c1c;">
            Access Restrictions
          </h3>

          <ul style="margin:0;padding-left:20px;">
            <li>Client portal access is disabled</li>
            <li>Project access is unavailable</li>
            <li>File uploads and downloads are restricted</li>
            <li>Support ticket creation is disabled</li>
            <li>Account management features are unavailable</li>
          </ul>
        </div>

        <p>
          If you believe this suspension was made in error or would like additional information, please contact our support team.
        </p>

        <div style="margin:32px 0;">
          <a
            href="https://www.zaynex.tech"
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
            Visit Zaynex
          </a>
        </div>

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