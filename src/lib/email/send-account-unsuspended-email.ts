import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function sendAccountUnsuspendedEmail(
  email: string,
  name?: string | null
) {
  await resend.emails.send({
    from: "Zaynex <no-reply@zaynex.tech>",
    to: email,
    subject:
      "Your Zaynex Account Has Been Restored",
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#111827;line-height:1.6;">
        
        <h1 style="margin-bottom:8px;">
          Account Restored
        </h1>

        <p>
          Hello ${name || "User"},
        </p>

        <p>
          We are pleased to inform you that your Zaynex account has been reviewed and restored.
        </p>

        <p>
          Your account is now active again and you can continue using all available services within the Zaynex Client Portal.
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
            Access Client Portal
          </a>
        </div>

        <div style="background:#f9fafb;padding:16px;border-radius:8px;">
          <h3 style="margin-top:0;">
            What you can access again
          </h3>

          <ul>
            <li>Projects and project updates</li>
            <li>File uploads and downloads</li>
            <li>Support tickets and communication</li>
            <li>Invoices and account records</li>
            <li>Client dashboard features</li>
          </ul>
        </div>

        <p style="margin-top:24px;">
          If you have any questions regarding your account status, please contact our support team.
        </p>

        <p>
          Email: support@zaynex.tech<br/>
          Website: https://www.zaynex.tech
        </p>

        <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />

        <p style="font-size:14px;color:#6b7280;">
          This is an automated message from Zaynex. Please do not reply directly to this email.
        </p>

        <p>
          Regards,<br/>
          <strong>Zaynex Team</strong>
        </p>
      </div>
    `,
  });
}