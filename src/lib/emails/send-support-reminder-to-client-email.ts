import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function sendSupportReminderToClientEmail(
  email: string,
  name: string | null,
  subject: string
) {
  await resend.emails.send({
    from: "Zaynex <no-reply@zaynex.tech>",
    to: email,
    subject: "We Are Waiting For Your Reply",
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#111827;line-height:1.6;">

        <!-- Logo Header -->
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="https://res.cloudinary.com/dn39ukq3q/image/upload/v1782149488/logo_zilmtc.png" alt="Zaynex Logo" style="height: 100px; width: auto; display: inline-block;" />
        </div>

        <h1>Awaiting Your Response</h1>

        <p>
          Hello ${name || "Client"},
        </p>

        <p>
          The Zaynex team replied to your support conversation more than 24 hours ago and is currently waiting for your response.
        </p>

        <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:24px 0;">
          <p>
            <strong>Conversation:</strong>
            ${subject}
          </p>
        </div>

        <p>
          If you still need assistance, please continue the conversation in your client portal.
        </p>

        <div style="margin:24px 0;">
          <a
            href="https://client.zaynex.tech/client/support"
            style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;"
          >
            Open Client Portal
          </a>
        </div>

        <p>
          Thank you for choosing Zaynex.
        </p>

        <p>
          Regards,<br />
          <strong>Zaynex Team</strong>
        </p>

      </div>
    `,
  });
}