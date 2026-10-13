# Copy changes for production review

This log records public copy changes made after baseline `9fea0da`. Existing product promises stay where they describe the intended model. Each later branch adds its own entries, including legal text.

| Location | Change | Reason |
| --- | --- | --- |
| Form failure message | Added “Please wait before trying again, or email hello@semblanse.com if you need help now.” | Explain rate limiting and give an alternative for urgent reports or blocked applicants. It appears only after the API returns 429. |

Security changes otherwise leave visible copy and design intact.

| Location | Change | Reason |
| --- | --- | --- |
| Analytics choice bar | Added opt-in explanation, “Allow analytics” and “Essential only”; explains that form answers and session recordings are excluded | Obtain a clear choice before optional collection and describe the implemented setup |
| Footer | Added “Analytics choices” | Let visitors withdraw or change permission |
| Browser privacy signal | Added notice that optional analytics stay off | Explain why an opt-in control is unavailable when the browser requests no tracking |

| Location | Change | Reason |
| --- | --- | --- |
| Home eyebrow and notes | “PRE-LAUNCH” and “We’re building this workflow” replace recruiting-only framing and the application-time estimate | Keep the product story while making current availability clear beside the pitch |
| Home approval sentence | “Brands may run only ads you approve” replaces “Only the ad you approve can run” | Describe permission accurately without implying technical prevention of misuse |
| Home sample handling | Disclosed production team and tools replace “only to the licensed brand” | Match the intended processing model and the future sample-consent step |
| Home record banner | “Your agreement, on record” and duties/remedies in the agreement replace “Every use is on record” and costly-breach claims | Do not imply universal tracking or predetermined enforceable penalties |
| Creator FAQ: samples | Explains planned recording, disclosed processors, purpose and retention; application grants no rights | Keep future workflow and current application permission separate |
| Creator FAQ: eligibility | Adds 18+, pilot DM account-control check, and planned future Instagram sign-in | Reconcile current application with the intended product without treating account control as full identity proof |
| Brand FAQ: materials | Approved context, scoped generation access and no automatic transfer of raw samples/models replace blanket sample access | Reflect the Master Doc’s restricted access model |
| About stage paragraph | Recruiting pilots and planned manual delivery replace running pilots in Canada and the US | Avoid unverified current activity and launch-market claims |
| Trust lead and account row | Labels the planned workflow and describes pilot DM plus separate campaign rights checks | Preserve the safeguards without implying an existing self-service product |
| Trust sample section | Disclosed team/tools and scoped access replace “Nobody else gets them”; adds a clear before-collection step | Remove conflicting recipient claims and make consent timing useful |
| Brand/contact checkboxes | States the enquiry or reply purpose rather than general agreement to a privacy policy | Explain the immediate use of submitted details without bundling unrelated marketing |
| Privacy: scope and summary | Covers website applications/messages today; future samples require separate notice and permission | A privacy policy must describe actual collection rather than imply campaign systems already operate |
| Privacy: collected data and purposes | Lists form data, DM checks, security processing, filtered analytics and response/matching purposes | Match code, distinguish hashed rate-limit identifiers from identifiable enquiry records, and avoid claiming anonymity for forms |
| Privacy: recipients and overseas processing | Names the team, Cloudflare, Resend and PostHog US, plus narrow legal disclosure purposes | Identify actual providers and clarify cross-border processing without inventing storage locations |
| Privacy: analytics/storage | Explains opt-in, GPC/DNT, 180-day preference, 90-day visitor ID, 30-minute session, withdrawal and earlier-event limits | Replace the obsolete cookieless/no-storage description with the implemented setup |
| Privacy: safeguards, retention and rights | Describes implemented website controls, purpose-based retention and access/correction/deletion/withdrawal routes | Avoid unverified campaign safeguards and unlimited deletion promises; internal retention approval remains a release decision |
| Privacy: adults and changes | Clarifies 18+ pilot applications and consent before a material new use | Do not treat a policy update as permission for unrelated new processing |
| Terms: scope and stage | Website/applications only; example screens/fees/results and planned features explicitly distinguished from campaign offers | Keep attractive future copy while explaining what applying does today |
| Terms: campaign agreements and permission | Sets matters a later signed licence must cover, including rejection/refunds, and limits training/use rights | Website terms cannot supply missing campaign agreements or guarantee perfect enforcement |
| Terms: material, providers and liability | Narrow enquiry-processing permission; no likeness/training/ownership grant; qualified website liability limits | Avoid broad template rights and preserve mandatory legal rights |
| Legal identity and governing law | Uses approved public configuration; review-draft label and build gate while missing | Do not invent a company name, address or applicable law |
| Footer and receipts | Adds direct privacy/accessibility routes; displays approved operator/address once supplied | Make requests easy and carry business identification into future receipts |

| Location | Change | Reason |
| --- | --- | --- |
| Investor page | New hero, model, team biographies and service-first/platform-later plan, following Figma frames 684:2134 and 684:2243 | Explain the planned business and provide founder credibility from the deck and Master Doc, without unverified traction or funding claims |
| Navigation/footer | Added “Investors” and its short description | Make the new page findable in the existing company group |
| About link | “Meet the team and see our plan” links to Investors instead of the generic investor/press contact link | Provide the requested founder information before the contact step |
