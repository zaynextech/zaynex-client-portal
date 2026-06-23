import { resend } from "@/lib/resend";

interface SendMeetingConfirmationEmailProps {
  email: string;
  clientName: string;

  meetingDate: string;
  meetingTime: string;

  meetingLink: string;
}

export async function sendMeetingConfirmationEmail({
  email,
  clientName,
  meetingDate,
  meetingTime,
  meetingLink,
}: SendMeetingConfirmationEmailProps) {
  return await resend.emails.send({
    from: "Zaynex <hello@zaynex.tech>",

    to: email,

    subject: "Your Zaynex Meeting Has Been Confirmed",

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        
        <!-- Logo Header -->
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="https://res.cloudinary.com/dn39ukq3q/image/upload/v1782149488/logo_zilmtc.png" alt="Zaynex Logo" style="height: 100px; width: auto; display: inline-block;" />
        </div>

        <h2>
          Meeting Confirmed
        </h2> 

        <p>
          Hello ${clientName},
        </p>

        <p>
          Your meeting request has been approved and confirmed.
        </p>

        <div style="padding:16px;border:1px solid #e5e5e5;border-radius:8px;margin:20px 0;">
          
          <p>
            <strong>Date:</strong>
            ${meetingDate}
          </p>

          <p>
            <strong>Time:</strong>
            ${meetingTime}
          </p>

          <p>
            <strong>Meeting Link:</strong>
          </p>

          <p>
            <a href="${meetingLink}">
              Join Meeting
            </a>
          </p>

        </div>

        <p>
          Please join a few minutes before the scheduled time.
        </p>

        <p>
          Thank you,<br />
          Zaynex
        </p>

      </div>
    `,
  });
}