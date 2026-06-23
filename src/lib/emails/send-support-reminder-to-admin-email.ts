import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

interface SendSupportReminderToAdminEmailProps {
  clientName: string;
  clientEmail: string;
  subject: string;
  ticketId: string;
}

export async function sendSupportReminderToAdminEmail({
  clientName,
  clientEmail,
  subject,
  ticketId,
}: SendSupportReminderToAdminEmailProps) {
  await resend.emails.send({
    from: "Zaynex <no-reply@zaynex.tech>",
    to: "support@zaynex.tech",
    subject:
      "Client Waiting For Reply",
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#111827;line-height:1.6;">
        
        <h1>Client Waiting For Reply</h1>

        <p>
          A client has been waiting more than 24 hours for a response.
        </p>

        <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:24px 0;">
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Ticket ID:</strong> ${ticketId}</p>
        </div>

        <p>
          Open the admin portal and reply to the client.
        </p>

        <div style="margin:24px 0;">
          <a
            href="https://client.zaynex.tech/admin/support"
            style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;"
          >
            Open Support Dashboard
          </a>
        </div>

        <p>
          Regards,<br />
          <strong>Zaynex System</strong>
        </p>

      </div>
    `,
  });
}