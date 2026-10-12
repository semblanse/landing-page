"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ease } from "./motion";
const creators = [
  [
    "Do I have to film or post the ads?",
    "The advertiser’s team handles production. An AI version of you appears in the ad. You share context and review the finished work. Posting to your own audience is optional and agreed separately.",
  ],
  [
    "What will I need to share?",
    "Face, body and voice samples once, plus the stories and limits for each campaign. Your samples go only to the brand that licenses you, for that campaign.",
  ],
  [
    "How much will I earn?",
    "Fees are set per campaign. The $1,200 on this page is an example for one 30-day video. You see the exact fee before you agree, and you can turn down any offer.",
  ],
  [
    "Can a brand use my likeness however it wants?",
    "Use stays within the agreed campaign. New rights or material changes need a new agreement.",
  ],
  [
    "Will people know it’s AI?",
    "Ads are labelled as AI-made wherever the law requires it.",
  ],
  [
    "What happens when the licence ends?",
    "The brand must stop running the ads. Using them again needs a new licence, which you can accept or decline.",
  ],
  [
    "What happens after I apply?",
    "You join our waitlist. We’ll reach out as soon as we have a campaign that fits you.",
  ],
  [
    "Who can apply?",
    "Any creator. You’ll sign in with Instagram so we can confirm the account is yours.",
  ],
  [
    "What if I decline the final ad?",
    "We’re setting this with our first pilot creators. You’ll see the terms before you accept any offer.",
  ],
];
const brands = [
  [
    "What does a licence cost?",
    "We quote each pilot by its creator, scope and rights. Your quote sets out the creator fee and any other charges before you commit. We’re testing pricing through paid pilots.",
  ],
  [
    "How fast do creators approve?",
    "We agree review windows and an escalation plan before production. We don’t promise a fixed turnaround yet. Silence is never approval: no ad runs without explicit sign-off.",
  ],
  [
    "How do you handle AI disclosure?",
    "Ads are labelled as AI-made wherever the law requires it. We agree the disclosure for each channel and market before production.",
  ],
  [
    "How many versions does one licence cover?",
    "The licence sets the number of versions, channels, territory and term. Every finished version needs creator approval. Work beyond that scope needs a new agreement.",
  ],
  [
    "Can the creator post the ad too?",
    "Yes, if they agree. Posting to the creator’s own audience is optional and priced separately.",
  ],
  [
    "What do we get to work with?",
    "The creator’s verified samples, their stories and phrasing, and a clear list of what’s allowed and what’s off limits.",
  ],
  [
    "When do we pay?",
    "The creator fee is secured before production and released when the creator approves the final ad.",
  ],
  [
    "What if no version is approved?",
    "We’re setting this with our first pilot brands. You’ll see the terms before you commit.",
  ],
];
export function FAQ() {
  const [audience, setAudience] = useState("creators");
  const [showAll, setShowAll] = useState(false);
  // Answers crossfade on a switch only, so the first paint is never hidden.
  const [switched, setSwitched] = useState(false);
  const reduce = useReducedMotion();
  return (
    <Tabs
      value={audience}
      onValueChange={(v) => {
        setAudience(String(v));
        setShowAll(false);
        setSwitched(true);
      }}
      className="faq-tabs"
    >
      <TabsList className="faq-tab-list" aria-label="Questions by audience">
        {[
          ["creators", "Creators"],
          ["brands", "Brands & agencies"],
        ].map(([value, label]) => (
          <TabsTrigger key={value} value={value}>
            {audience === value && (
              <motion.span
                className="faq-tab-active"
                layoutId="faq-tab-active"
                transition={{ duration: reduce ? 0 : 0.35, ease }}
              />
            )}
            <span>{label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {[
        { id: "creators", rows: creators },
        { id: "brands", rows: brands },
      ].map(({ id, rows }) => (
        <TabsContent key={id} value={id}>
          <motion.div
            key={audience}
            initial={switched ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
          >
            <Accordion defaultValue={[rows[0][0]]} className="faq-accordion">
              {(showAll ? rows : rows.slice(0, 4)).map(([q, a]) => (
                <AccordionItem className="faq-row" key={q} value={q}>
                  <AccordionTrigger>{q}</AccordionTrigger>
                  <AccordionContent>
                    <p>{a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Button
              variant="outline"
              className="faq-more"
              aria-expanded={showAll}
              onClick={() => setShowAll((current) => !current)}
            >
              {showAll
                ? "Show fewer questions"
                : `Show all ${rows.length} questions`}
            </Button>
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
