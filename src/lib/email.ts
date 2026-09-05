import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.EMAIL_FROM ?? "SOCIS Incubator <incubator@socis.ca>";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type Mail = { to: string | string[]; subject: string; body: string[] };

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]);
}

/**
 * Plain-text-first transactional email. If RESEND_API_KEY is missing (local
 * development) the message is logged instead of sent, so nothing breaks.
 */
async function send({ to, subject, body }: Mail) {
  const text = body.join("\n\n");
  const safeSite = escapeHtml(SITE);
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#171717;max-width:34rem">
${body.map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`).join("\n")}
<p style="color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb;padding-top:12px;margin-top:24px">
SOCIS Computer Science Incubator &middot; <a href="${safeSite}" style="color:#9a2c37">${escapeHtml(SITE.replace(/^https?:\/\//, ""))}</a>
</p></div>`;

  if (!resend) {
    console.info("[email skipped: no RESEND_API_KEY]", { to, subject, text });
    return;
  }

  try {
    await resend.emails.send({ from: FROM, to, subject, text, html });
  } catch (error) {
    // Never fail a student's submission because email delivery hiccupped.
    console.error("Resend error", error);
  }
}

export function sendApplicationReceived(to: string, name: string) {
  return send({
    to,
    subject: "We received your incubator application",
    body: [
      `Hi ${name},`,
      "Thanks for applying to the SOCIS Computer Science Incubator. Your application is in, and we review them as they arrive.",
      "You'll hear back about team placement once applications close. If you applied with teammates or your own project idea, we'll follow up about scope before the kickoff.",
      `You can check your status any time at ${SITE}/dashboard.`,
    ],
  });
}

export function sendApplicationDecision(
  to: string,
  name: string,
  status: "accepted" | "waitlisted" | "declined",
) {
  const copy = {
    accepted: [
      `Hi ${name},`,
      "You're in. Welcome to the SOCIS Computer Science Incubator.",
      `Next step: sign in at ${SITE}/dashboard to see your team, your executive contact, and the proposal deadline. Join the Discord if you haven't already.`,
      "Your team submits a project proposal in Week 2, so read the guidelines before then.",
    ],
    waitlisted: [
      `Hi ${name},`,
      "Thanks for applying. We had more strong applications than we can place in this pilot semester, so you're on the waitlist.",
      "Spots do open up in the first two weeks. We'll email you right away if one does, and you're welcome at every workshop and event in the meantime.",
    ],
    declined: [
      `Hi ${name},`,
      "Thanks for applying to the incubator. We aren't able to offer you a spot this semester.",
      "We're running a small pilot with 6 to 10 teams, so this was mostly a numbers decision. Our workshops and events stay open to everyone, and we'd genuinely like to see you apply again next semester.",
    ],
  }[status];

  const subject = {
    accepted: "You're in | SOCIS Incubator",
    waitlisted: "Your incubator application: waitlist",
    declined: "Your incubator application",
  }[status];

  return send({ to, subject, body: copy });
}

export function sendCheckInReceipt(to: string[], teamName: string, cycle: number) {
  return send({
    to,
    subject: `Check-in ${cycle} received | ${teamName}`,
    body: [
      `Your check-in for cycle ${cycle} is recorded.`,
      "If you flagged that you're behind or blocked, your executive contact will reach out within a couple of days.",
      `You can review past check-ins at ${SITE}/dashboard/check-ins.`,
    ],
  });
}

export function sendNewApplicationAlert(applicantName: string, program: string) {
  const admin = process.env.EMAIL_ADMIN;
  if (!admin) return Promise.resolve();
  return send({
    to: admin,
    subject: `New incubator application | ${applicantName}`,
    body: [
      `${applicantName} (${program}) just applied.`,
      `Review it at ${SITE}/admin/applications.`,
    ],
  });
}

export function sendProposalFeedback(
  to: string[],
  teamName: string,
  status: "approved" | "changes_requested",
  feedback: string,
) {
  return send({
    to,
    subject:
      status === "approved"
        ? `Proposal approved | ${teamName}`
        : `Proposal feedback | ${teamName}`,
    body: [
      status === "approved"
        ? "Your project proposal is approved. Start building."
        : "We'd like some changes to your project proposal before it's approved.",
      feedback,
      `${SITE}/dashboard/proposal`,
    ],
  });
}
