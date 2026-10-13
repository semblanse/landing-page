import { brands, creators } from "@/lib/faq";
import { pages, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** A plain-text summary of the site for AI assistants (llmstxt.org). */
export function GET() {
  const link = (slug: string) =>
    `- [${pages[slug].title}](${siteUrl}/${slug}/): ${pages[slug].description}`;
  const answers = (list: string[][]) =>
    list.map(([question, answer]) => `**${question}** ${answer}`).join("\n\n");
  const text = `# Semblanse

> Semblanse is a licensing service for AI ads that star real creators. A brand licenses a creator’s face, voice and stories for one campaign at a time, and the creator approves every final ad before it runs.

Semblanse is pre-launch. It is running its first paid pilot campaigns by hand in Canada and the US. It sells the licence, the creator’s stories and limits, and the approval step. It does not sell an ad-making tool or made-up AI faces, and no licence allows AI training on a creator’s samples.

## For creators

- [Home](${siteUrl}/): How a creator is offered a campaign, shares stories, approves the ad and is paid.
${["creator-pilot", "trust"].map(link).join("\n")}

## For brands and agencies

${["brands", "pilot", "brand-pilot"].map(link).join("\n")}

## Company

${["about", "careers", "contact", "privacy", "terms"].map(link).join("\n")}

## Questions creators ask

${answers(creators)}

## Questions brands ask

${answers(brands)}
`;
  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
