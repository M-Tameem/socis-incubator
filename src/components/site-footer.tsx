import Link from "next/link";
import { PROGRAM } from "@/lib/program";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 text-sm sm:grid-cols-[1.5fr_1fr_1fr] sm:px-7">
        <div>
          <p className="font-medium">SOCIS Computer Science Incubator</p>
          <p className="prose-page mt-2 max-w-sm leading-6 text-muted-foreground">
            A semester to build one useful software project with a team.
          </p>
        </div>

        <div>
          <p className="font-medium">Program</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground">How it works</Link></li>
            <li><Link href="/timeline" className="hover:text-foreground">Timeline</Link></li>
            <li><Link href="/ideas" className="hover:text-foreground">Idea portal</Link></li>
            <li><Link href="/apply" className="hover:text-foreground">Apply</Link></li>
            <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
            <li><Link href="/resources" className="hover:text-foreground">Resources</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-medium">Contact</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>
              <a href={PROGRAM.websiteUrl} className="hover:text-foreground">socis.ca</a>
            </li>
            <li>
              <a href={`mailto:${PROGRAM.contactEmail}`} className="hover:text-foreground">
                {PROGRAM.contactEmail}
              </a>
            </li>
            <li>
              <a href={PROGRAM.discordUrl} className="hover:text-foreground">Discord</a>
            </li>
            <li>
              <a href={PROGRAM.githubOrg} className="hover:text-foreground">GitHub</a>
            </li>
            <li><Link href="/contact" className="hover:text-foreground">Contact the team</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-10 text-xs text-muted-foreground sm:px-7">
        SOCIS · {PROGRAM.term}
      </div>
    </footer>
  );
}
