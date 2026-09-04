// src/lib/emails/templates/campaigns.ts

export type CampaignType =
  | "GENERAL"
  | "ANNOUNCEMENT"
  | "WELCOME"
  | "PROJECT_UPDATE"
  | "PROJECT_COMPLETED"
  | "TASK_UPDATE"
  | "PAYMENT_INVOICE"
  | "ACCOUNT_ACCESS"
  | "REVIEW_REQUEST"
  | "NOTICE"
  | "MARKETING";

interface CampaignTemplate {
  subject: string;
  heading: string;
  intro: string;
  footer: string;
  ctaText: string;
}

export const CAMPAIGN_TEMPLATES: Record<
  CampaignType,
  CampaignTemplate
> = {
  GENERAL: {
    subject: "Message from Zaynex",
    heading: "A Message from Zaynex",
    intro:
      "We wanted to share an important message with you.",
    footer:
      "If you have any questions, please contact the Zaynex team.",
    ctaText: "Visit Zaynex",
  },

  ANNOUNCEMENT: {
    subject: "Zaynex Announcement",
    heading: "Important Announcement",
    intro:
      "We have an important update to share with you.",
    footer:
      "Thank you for being part of Zaynex.",
    ctaText: "View Update",
  },

  WELCOME: {
    subject: "Welcome to Zaynex",
    heading: "Welcome to Zaynex",
    intro:
      "We're happy to have you with us and look forward to working with you.",
    footer:
      "If you need any help, our team is here to assist you.",
    ctaText: "Visit Dashboard",
  },

  PROJECT_UPDATE: {
    subject: "Project Update",
    heading: "Your Project Has Been Updated",
    intro:
      "We've made progress on your project and have new updates for you.",
    footer:
      "Visit your dashboard to view the latest project details and activity.",
    ctaText: "Open Project",
  },

  PROJECT_COMPLETED: {
    subject: "Project Completed",
    heading: "Your Project Is Complete",
    intro:
      "We're pleased to let you know that your project has been completed.",
    footer:
      "Thank you for choosing Zaynex. We appreciate the opportunity to work with you.",
    ctaText: "View Project",
  },

  TASK_UPDATE: {
    subject: "Task Update",
    heading: "Task Update",
    intro:
      "There is a new update related to your assigned task.",
    footer:
      "Please check your dashboard for the latest task information.",
    ctaText: "View Task",
  },

  PAYMENT_INVOICE: {
    subject: "Payment / Invoice Update",
    heading: "Payment or Invoice Update",
    intro:
      "There is a new payment or invoice update that may require your attention.",
    footer:
      "Please review the details in your dashboard and contact us if you have any questions.",
    ctaText: "View Invoice",
  },

  ACCOUNT_ACCESS: {
    subject: "Account Access Update",
    heading: "Account Update",
    intro:
      "There is an update related to your Zaynex account or access.",
    footer:
      "If you did not expect this update, please contact the Zaynex team.",
    ctaText: "Open Dashboard",
  },

  REVIEW_REQUEST: {
    subject: "Share Your Feedback",
    heading: "How Was Your Experience?",
    intro:
      "Your feedback helps us improve our services and serve our clients better.",
    footer:
      "We appreciate your time and would love to hear about your experience with Zaynex.",
    ctaText: "Leave a Review",
  },

  NOTICE: {
    subject: "Important Notice",
    heading: "Important Notice",
    intro:
      "We have an important notice that requires your attention.",
    footer:
      "Please review the information and contact us if you have any questions.",
    ctaText: "View Details",
  },

  MARKETING: {
    subject: "Grow Your Business with Zaynex",
    heading: "Take Your Business Further",
    intro:
      "From professional websites to custom web applications, we help businesses build a stronger digital presence.",
    footer:
      "Discover digital solutions designed to help your business grow.",
    ctaText: "Explore Services",
  },
};

interface BuildCampaignEmailParams {
  type: CampaignType;
  title?: string;
  message: string;
  recipientName?: string;
  includeRatingLink?: boolean;
  includeWebsiteLink?: boolean;
}

export function buildCampaignEmail({
  type,
  title,
  message,
  recipientName,
  includeRatingLink = false,
  includeWebsiteLink = true,
}: BuildCampaignEmailParams) {
  const template = CAMPAIGN_TEMPLATES[type];

  const subject = title || template.subject;
  const heading = title || template.heading;
  const greeting = recipientName
    ? `Hello ${recipientName},`
    : "Hello,";

  const formattedMessage = message
    .trim()
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px 0;">${paragraph.replace(/\n/g, "<br>")}</p>`
    )
    .join("");

  return {
    subject,
    heading,

    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${subject}</title>
  <style>
    /* Default / Light Mode Styles */
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      color: #09090b;
      -webkit-font-smoothing: antialiased;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
    .email-bg { background-color: #ffffff; }
    .heading-text { color: #09090b !important; }
    .greeting-text { color: #71717a !important; }
    .intro-text { color: #3f3f46 !important; }
    .message-box { border-left: 2px solid #09090b; color: #09090b !important; }
    .link-text { color: #09090b !important; }
    .review-desc { color: #71717a !important; }
    .footer-text { color: #71717a !important; }
    .brand-title { color: #09090b !important; }
    .brand-sub { color: #a1a1aa !important; }
    .divider { border-top: 1px solid #e4e4e7 !important; }

    /* Dark Mode Styles */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #09090b !important;
        color: #f4f4f5 !important;
      }
      .email-bg { background-color: #09090b !important; }
      .heading-text { color: #f4f4f5 !important; }
      .greeting-text { color: #a1a1aa !important; }
      .intro-text { color: #d4d4d8 !important; }
      .message-box { border-left: 2px solid #f4f4f5; color: #f4f4f5 !important; }
      .link-text { color: #f4f4f5 !important; }
      .review-desc { color: #a1a1aa !important; }
      .footer-text { color: #a1a1aa !important; }
      .brand-title { color: #f4f4f5 !important; }
      .brand-sub { color: #71717a !important; }
      .divider { border-top: 1px solid #27272a !important; }
    }
  </style>
</head>

<body class="email-bg">

<table
  width="100%"
  border="0"
  cellpadding="0"
  cellspacing="0"
  style="padding:40px 20px;"
  class="email-bg"
>
  <tr>
    <td align="center" class="email-bg">

      <table
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
        style="max-width:560px;margin:0 auto;"
      >

        <tr>
          <td style="padding:0 0 32px 0;">
            <img
              src="https://res.cloudinary.com/dn39ukq3q/image/upload/v1782149488/logo_zilmtc.png"
              alt="Zaynex"
              style="
                height:80px;
                width:auto;
                display:block;
              "
            />
          </td>
        </tr>

        <tr>
          <td>

            <h1
              class="heading-text"
              style="
                margin:0 0 16px 0;
                font-size:28px;
                font-weight:700;
                line-height:1.2;
                letter-spacing:-0.03em;
              "
            >
              ${heading}
            </h1>

            <p
              class="greeting-text"
              style="
                margin:0 0 20px 0;
                font-size:13px;
              "
            >
              ${greeting}
            </p>

            <p
              class="intro-text"
              style="
                margin:0 0 20px 0;
                font-size:14px;
                line-height:1.6;
              "
            >
              ${template.intro}
            </p>

            <div
              class="message-box"
              style="
                margin:24px 0;
                padding:0 0 0 16px;
                font-size:14px;
                line-height:1.6;
              "
            >
              ${formattedMessage}
            </div>

            ${
              includeWebsiteLink
                ? `
            <table
              border="0"
              cellpadding="0"
              cellspacing="0"
              style="margin:24px 0 0 0;"
            >
              <tr>
                <td>
                  <a
                    href="https://www.zaynex.tech"
                    target="_blank"
                    class="link-text"
                    style="
                      display:inline-block;
                      font-size:14px;
                      font-weight:600;
                      text-decoration:none;
                    "
                  >
                    ${template.ctaText} →
                  </a>
                </td>
              </tr>
            </table>
            `
                : ""
            }

            ${
              includeRatingLink
                ? `
            <table
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="100%"
              class="divider"
              style="
                margin:40px 0 0 0;
                padding:20px 0 0 0;
              "
            >
              <tr>
                <td>

                  <p
                    class="review-desc"
                    style="
                      margin:0 0 8px 0;
                      font-size:13px;
                      line-height:1.4;
                    "
                  >
                    We'd love to hear about your experience working with Zaynex.
                  </p>

                  <a
                    href="https://www.trustpilot.com/review/zaynex.tech"
                    target="_blank"
                    class="link-text"
                    style="
                      font-size:13px;
                      font-weight:600;
                      text-decoration:none;
                    "
                  >
                    Leave a Review →
                  </a>

                </td>
              </tr>
            </table>
            `
                : ""
            }

          </td>
        </tr>

        <tr>
          <td
            class="divider"
            style="
              padding:40px 0 0 0;
            "
          >

            <p
              class="footer-text"
              style="
                margin:0 0 20px 0;
                font-size:12px;
                line-height:1.5;
              "
            >
              ${template.footer}
            </p>

            <table
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
            >
              <tr>

                <td>
                  <p
                    class="brand-title"
                    style="
                      margin:0;
                      font-size:12px;
                      font-weight:700;
                    "
                  >
                    Zaynex
                  </p>

                  <p
                    class="brand-sub"
                    style="
                      margin:2px 0 0 0;
                      font-size:10px;
                      text-transform:uppercase;
                      letter-spacing:0.05em;
                    "
                  >
                    Websites • Web Applications • Digital Solutions
                  </p>
                </td>

                <td
                  align="right"
                  style="vertical-align:bottom;"
                >
                  <a
                    href="https://www.zaynex.tech"
                    target="_blank"
                    class="footer-text"
                    style="
                      font-size:12px;
                      font-weight:600;
                      text-decoration:none;
                    "
                  >
                    zaynex.tech
                  </a>
                </td>

              </tr>
            </table>

          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>
`,
  };
}