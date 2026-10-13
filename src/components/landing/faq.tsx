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
import { creators, brands } from "@/lib/faq";
import { track } from "@/lib/analytics";
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
        track("faq_audience_changed", { audience: String(v) });
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
              {(showAll ? rows : rows.slice(0, 4)).map(([q, a], i) => (
                <AccordionItem className="faq-row" key={q} value={q}>
                  <AccordionTrigger
                    onClick={(e) =>
                      track("faq_question_toggled", {
                        audience,
                        question: i,
                        state:
                          e.currentTarget.getAttribute("aria-expanded") ===
                          "true"
                            ? "closed"
                            : "opened",
                      })
                    }
                  >
                    {q}
                  </AccordionTrigger>
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
              onClick={() => {
                track("faq_list_toggled", {
                  audience,
                  state: showAll ? "closed" : "opened",
                });
                setShowAll((current) => !current);
              }}
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
