import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

type SendClientInvitationEmailProps = {
  email: string;
  companyName: string;
  password: string;
};

export async function sendClientInvitationEmail({
  email,
  companyName,
  password,
}: SendClientInvitationEmailProps) {
  await resend.emails.send({
    from: "Zaynex <no-reply@zaynex.tech>",
    to: email,
    subject:
      "Welcome to Zaynex - Your Client Account is Ready",
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#111827;line-height:1.6;">

        <div style="text-align:center;margin-bottom:32px;">
          <img
            src="https://res.cloudinary.com/dn39ukq3q/image/upload/v1782149488/logo_zilmtc.png"
            alt="Zaynex"
            style="height:64px;"
          />
        </div>

        <h1>Welcome to Zaynex</h1>

        <p>
          Hello ${companyName},
        </p>

        <p>
          Your client account has been created successfully and your project request has been approved.
        </p>

        <p>
          You can now access the Zaynex Client Portal to:
        </p>

        <ul>
          <li>Track project progress</li>
          <li>Communicate with the Zaynex team</li>
          <li>Receive project updates</li>
          <li>Manage your services</li>
        </ul>

        <div style="background:#f9fafb;padding:20px;border:1px solid #e5e7eb;border-radius:8px;margin:24px 0;">
          <h3 style="margin-top:0;">Login Details</h3>

          <p>
            <strong>Portal:</strong><br/>
            https://client.zaynex.tech
          </p>

          <p>
            <strong>Email:</strong><br/>
            ${email}
          </p>

          <p>
            <strong>Temporary Password:</strong><br/>
            ${password}
          </p>
        </div>

        <div style="background:#eff6ff;padding:16px;border-radius:8px;border:1px solid #bfdbfe;margin:24px 0;">
          <strong>Important Security Notice</strong>

          <p style="margin-top:10px;">
            After your first login:
          </p>

          <p>
            Settings → Password → Send Reset Email
          </p>

          <p>
            Please change your password immediately for security purposes.
          </p>
        </div>

        <h3>Need Help?</h3>

        <p>
          Email: support@zaynex.tech<br/>
          Website: https://www.zaynex.tech
        </p>

        <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />

        <p style="font-size:14px;color:#6b7280;">
          This is an automated email from Zaynex.
        </p>

        <p>
          Best regards,<br/>
          <strong>Zaynex Team</strong>
        </p>

      </div>
    `,
  });
}