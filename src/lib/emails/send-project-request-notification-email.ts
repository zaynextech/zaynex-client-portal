import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

type Props = {
  companyName: string;
  email: string;
  phone: string;
  projectName: string;
  projectType: string;
  budgetRange: string;
  targetLaunchDate: string;
  description: string;
};

export async function sendProjectRequestNotificationEmail({
  companyName,
  email,
  phone,
  projectName,
  projectType,
  budgetRange,
  targetLaunchDate,
  description,
}: Props) {
  await resend.emails.send({
    from: "Zaynex <no-reply@zaynex.tech>",
    to: "admin@zaynex.tech",
    subject:
      `New Project Request - ${companyName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;">
        <img
          src="https://res.cloudinary.com/dn39ukq3q/image/upload/v1782149488/logo_zilmtc.png"
          alt="Zaynex"
          style="height:100px;margin-bottom:20px;"
        />

        <h2>
          New Project Request
        </h2>

        <p>
          A new project request has been submitted.
        </p>

        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td><strong>Company</strong></td>
            <td>${companyName}</td>
          </tr>

          <tr>
            <td><strong>Email</strong></td>
            <td>${email}</td>
          </tr>

          <tr>
            <td><strong>Phone</strong></td>
            <td>${phone || "-"}</td>
          </tr>

          <tr>
            <td><strong>Project</strong></td>
            <td>${projectName}</td>
          </tr>

          <tr>
            <td><strong>Type</strong></td>
            <td>${projectType}</td>
          </tr>

          <tr>
            <td><strong>Budget</strong></td>
            <td>${budgetRange || "-"}</td>
          </tr>

          <tr>
            <td><strong>Launch Date</strong></td>
            <td>${targetLaunchDate || "-"}</td>
          </tr>
        </table>

        <div style="margin-top:20px;padding:16px;background:#f9fafb;border-radius:8px;">
          <strong>Description</strong>
          <p>
            ${description}
          </p>
        </div>

        <p style="margin-top:24px;">
          Review:
          https://client.zaynex.tech/admin/project-requests
        </p>
      </div>
    `,
  });
}