import { Mail } from "lucide-react";
import type { Dictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/Button";

/** Renders only the links that are actually configured in src/content/site.ts. */
export function configuredLinks(dict: Dictionary) {
  const { email, linkedin, github } = site.links;
  return [
    email && { key: "email", href: `mailto:${email}`, label: dict.contact.email, text: email, Icon: Mail, external: false },
    linkedin && { key: "linkedin", href: linkedin, label: dict.contact.linkedin, text: "LinkedIn", Icon: LinkedInIcon, external: true },
    github && { key: "github", href: github, label: dict.contact.github, text: "GitHub", Icon: GitHubIcon, external: true },
  ].filter(Boolean) as {
    key: string;
    href: string;
    label: string;
    text: string;
    Icon: React.ComponentType<{ className?: string }>;
    external: boolean;
  }[];
}

export default function ContactLinks({ dict, compact = false }: { dict: Dictionary; compact?: boolean }) {
  const links = configuredLinks(dict);
  if (!links.length) return null;
  return (
    <ul className="flex flex-wrap items-center gap-3">
      {links.map(({ key, href, label, text, Icon, external }) => (
        <li key={key}>
          <a
            href={href}
            aria-label={label}
            data-cursor="link"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={
              compact
                ? "inline-flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/15 text-charcoal transition-colors hover:border-wine hover:bg-wine hover:text-cream"
                : "group inline-flex items-center gap-3 rounded-full border border-cream/20 px-5 py-3 text-cream transition-colors hover:border-wine hover:bg-wine"
            }
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {!compact && <span className="text-sm">{text}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
