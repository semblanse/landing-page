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

> Semblanse is building a licensing service for AI ads that star real creators. The intended model lets a brand license a creator’s face, voice and stories for one campaign at a time, with creator approval of every final ad before launch.

Semblanse is pre-launch and recruiting for its first paid pilots, which the team will run by hand. The planned service combines campaign rights, the creator’s stories and limits, approval and payment. It is a licensing service; ad production by Semblanse is limited to the pilot. A campaign licence grants no AI-training rights to a brand. Applying grants no likeness rights.

## For creators

- [Home](${siteUrl}/): How a creator is offered a campaign, shares stories, approves the ad and is paid.
${["creator-pilot", "trust"].map(link).join("\n")}

## For brands and agencies

${["brands", "pilot", "brand-pilot"].map(link).join("\n")}

## Company

${["about", "investors", "careers", "contact", "privacy", "terms"].map(link).join("\n")}

## Questions creators ask

${answers(creators)}

## Questions brands ask

${answers(brands)}
`;
  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
