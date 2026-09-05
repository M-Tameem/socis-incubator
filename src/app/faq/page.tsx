import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { FAQS, PROGRAM } from "@/lib/program";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about applying to and taking part in the SOCIS Incubator.",
};

export default function FaqPage() {
  return (
    <div className="space-y-12">
      <PageHeader
        title="Frequently asked questions"
        lede="Email us or ask in Discord if something is missing."
      />

      <dl className="divide-y divide-border border-b border-border">
        {FAQS.map((faq) => (
          <div key={faq.question} className="py-6">
            <dt className="font-medium">{faq.question}</dt>
            <dd className="prose-page mt-2 text-muted-foreground">{faq.answer}</dd>
          </div>
        ))}
      </dl>

      <p className="text-sm text-muted-foreground">
        Need another answer?{" "}
        <Link href="/contact" className="text-link underline underline-offset-4 hover:no-underline">
          Contact the team
        </Link>{" "}
        or email{" "}
        <a href={`mailto:${PROGRAM.contactEmail}`} className="text-link underline underline-offset-4 hover:no-underline">
          {PROGRAM.contactEmail}
        </a>
        .
      </p>
    </div>
  );
}
