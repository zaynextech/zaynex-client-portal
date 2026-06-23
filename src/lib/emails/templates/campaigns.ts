// src/lib/emails/templates/campaigns.ts

export type CampaignType =
  | "MARKETING"
  | "ANNOUNCEMENT"
  | "HOLIDAY"
  | "NOTICE"
  | "REVIEW_REQUEST"
  | "PROJECT_UPDATE";

interface CampaignTemplate {
  subject: string;
  heading: string;
  intro: string;
  footer: string;
  ctaText: string;
}

export const CAMPAIGN_TEMPLATES: Record<CampaignType, CampaignTemplate> = {
MARKETING: {
subject: "Grow Your Business Online",
heading: "Take Your Business Further",
intro: "From professional websites to custom web applications, we help businesses build a stronger digital presence.",
footer: "Discover solutions designed to help your business grow and succeed online.",
ctaText: "Explore Services",
},

ANNOUNCEMENT: {
subject: "New Update Available",
heading: "What's New",
intro: "We've introduced new improvements and features to enhance your experience.",
footer: "Visit your dashboard to see the latest updates and improvements.",
ctaText: "View Updates",
},

HOLIDAY: {
subject: "Season's Greetings",
heading: "Thank You for Choosing Zaynex",
intro: "We appreciate your trust and support. Thank you for being part of our journey.",
footer: "We look forward to helping you achieve even greater success in the future.",
ctaText: "Visit Dashboard",
},


NOTICE: {
subject: "Important Notice",
heading: "Account Update",
intro: "There is an important update related to your account or project that requires your attention.",
footer: "Please review the latest information and contact us if you have any questions.",
ctaText: "View Details",
},


REVIEW_REQUEST: {
subject: "Share Your Feedback",
heading: "How Was Your Experience?",
intro: "Your feedback helps us improve our services and deliver even better results for our clients.",
footer: "We appreciate your time and would love to hear about your experience working with Zaynex.",
ctaText: "Leave a Review",
},


PROJECT_UPDATE: {
  subject: "Project Update",
  heading: "New Project Update Available",
  intro: "We've made progress on your project and added new updates for you to review.",
  footer: "Visit your client dashboard for the latest details, files, and project activity.",
  ctaText: "Open Dashboard",
},
};

interface BuildCampaignEmailParams {
  type: CampaignType;
  title: string;
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
const greeting = recipientName
? `Hello ${recipientName},`
: "Hello,";


      return {
      subject: title || template.subject,
      heading: title || template.heading,
      html: ` <!DOCTYPE html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>${title || template.subject}</title> </head> <body style="margin:0;padding:0;-webkit-font-smoothing:antialiased;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding:40px 20px;"> <tr> <td align="left"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;">

            <tr>
              <td style="padding:0 0 32px 0;">
                <img
                  src="https://res.cloudinary.com/dn39ukq3q/image/upload/v1782149488/logo_zilmtc.png"
                  alt="Zaynex"
                  style="height:100px;width:auto;display:block;"
                />
              </td>
            </tr>

            <tr>
              <td style="color:#18181b;padding:0;">
                <h1 style="margin:0 0 16px 0;font-size:28px;font-weight:700;color:#09090b;line-height:1.2;letter-spacing:-0.03em;">
                  ${title || template.heading}
                </h1>

                <p style="margin:0 0 20px 0;font-size:13px;color:#71717a;">
                  ${greeting}
                </p>

                <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#3f3f46;">
                  ${template.intro}
                </p>

                <div style="margin:24px 0;padding:0 0 0 16px;border-left:2px solid #09090b;font-size:14px;line-height:1.6;color:#09090b;">
                  ${message}
                </div>

                ${
                  includeWebsiteLink
                    ? `
                <table border="0" cellpadding="0" cellspacing="0" style="margin:24px 0 0 0;">
                  <tr>
                    <td>
                      <a
                        href="https://www.zaynex.tech"
                        target="_blank"
                        style="display:inline-block;font-size:14px;font-weight:600;color:#09090b;text-decoration:none;"
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
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:40px 0 0 0;padding:20px 0 0 0;border-top:1px solid #e4e4e7;">
                  <tr>
                    <td>
                      <p style="margin:0 0 8px 0;font-size:13px;color:#71717a;line-height:1.4;">
                        We'd love to hear about your experience working with Zaynex.
                      </p>

                      <a
                        href="https://www.trustpilot.com/review/zaynex.tech"
                        target="_blank"
                        style="font-size:13px;font-weight:600;color:#09090b;text-decoration:none;"
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
              <td style="padding:40px 0 0 0;border-top:1px solid #e4e4e7;">
                <p style="margin:0 0 20px 0;font-size:12px;line-height:1.5;color:#71717a;">
                  ${template.footer}
                </p>

                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td>
                      <p style="margin:0;font-size:12px;font-weight:700;color:#09090b;letter-spacing:-0.01em;">
                        Zaynex
                      </p>

                      <p style="margin:2px 0 0 0;font-size:10px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.05em;">
                        Websites • Web Applications • Digital Solutions
                      </p>
                    </td>

                    <td align="right" style="vertical-align:bottom;">
                      <a
                        href="https://www.zaynex.tech"
                        target="_blank"
                        style="font-size:12px;font-weight:600;color:#71717a;text-decoration:none;"
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