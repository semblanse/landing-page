# Decisions before production

Review previews are available without these decisions. `npm run build:production` checks `src/lib/release-decisions.json` and refuses an unreviewed release. Fill that file with approved public information and set each review flag only after doing the check. It contains no secrets.

| Decision | Why it needs the owner | Proposed handling |
| --- | --- | --- |
| Legal operator and postal address: confirmed | The owner confirmed Orbit Strategies Ltd. is a corporation and approved its mailing address for publication on 13 October 2026 | Orbit operates this website and handles its data. Privacy, Terms and email receipts use 32 Mahogany Forest Dr, Vaughan, ON L6A 4S8, Canada. The shared website footer links to the policies without repeating these details. This does not assign ownership of Semblanse's name or product. |
| Governing law: confirmed | The owner chose Ontario | Terms use Ontario law and applicable federal Canadian law, preserving mandatory rights. No court-venue clause is required by this implementation; no Toronto-only or exclusive venue was selected. |
| Semblanse operating name | Orbit's incorporation does not by itself register the Semblanse business name | The owner should check the Ontario registration required for the way Orbit will operate under the Semblanse name. This work has not verified registration. |
| Website legal copy: approved | The owner approved the current copy on 13 October 2026 | The pages show their last-updated date. Operator details remain in small text at the bottom of both documents. |
| Retention practice: reviewed | Launch approval covers the approved purpose-based policy and its operating routine | `docs/site-operations.md` sets a monthly manual review and request handling process. The team monitoring the contact inbox owns it until reassigned. No existing records were purged and no automatic deletion service is claimed. Do not collect campaign samples until separate disclosures and permissions are ready. |
| Production email configuration: checked | A domain-restricted sending key is stored on the live Pages project | The verified domain has DKIM and SPF records. Both current contact templates were accepted with that key and reported delivered to Resend's official test sink. Existing provider logs also show delivery to the team address. This verifies sending configuration, not a new browser-to-inbox production submission or inbox placement. Check that full path after deployment before promoting applications. No secret belongs in this JSON file. |
| Analytics billing: confirmed by owner | The owner confirmed PostHog has no linked card or payment method and uses the Free plan on 13 October 2026 | PostHog stops usage at its free allowance. Website event limits remain in place. If a paid plan or payment method is added later, review every product/add-on and set $0 limits where needed. This check relied on the owner's confirmation, not access to the billing screen. |
| Automatic analytics: checked | Automatic injection is disabled on preview and live projects; served readiness pages contain no Cloudflare beacon | Recheck after settings changes. The release CSP also excludes this beacon. |

Before any paid campaign, confirm the permitted production tools, sample/model access and storage, retention/deletion limits, creator and brand licence terms, secured-funds mechanism, payment on approval, cancellation/rejection/refund rules, and remedies for misuse. These decisions do not prevent a website review preview. No campaign licence or biometric consent is created by the website terms.

The investor page uses founder information from the supplied deck and the service-first/platform-later model from the Master Doc. It publishes no raise amount, valuation, validated market-size claim or traction number. Confirm founder biographies before public launch.

Legal references: General Legal’s CC0 Terms of Use and GDPR-enhanced Privacy Policy informed the structure. Removed template assumptions include existing accounts, broad perpetual feedback rights, US arbitration/venue defaults, replay and unsupported compliance promises. Canadian guidance informed purpose-based retention, meaningful consent, accountable contact and clarity about processors abroad. The owner approved the current website copy on 13 October 2026.

Sources:
- https://github.com/General-Legal/legal-templates
- https://www.priv.gc.ca/en/privacy-topics/privacy-for-businesses/appropriate-handling-of-personal-information/collecting-personal-information-and-consent/consent/gl_omc_201805/
- https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/
- https://competition-bureau.canada.ca/en/deceptive-marketing-practices/advertising-dos-and-donts
