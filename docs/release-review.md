# Decisions before production

Review previews are available without these decisions. `npm run build:production` checks `src/lib/release-decisions.json` and refuses an unreviewed release. Fill that file with approved public information and set each review flag only after doing the check. It contains no secrets.

| Decision | Why it needs the owner | Proposed handling |
| --- | --- | --- |
| Legal operator and postal address | Source files, deck and Master Doc do not establish the legal person operating the site or an approved business mailing address | Supply the exact legal name and business mailing address. They appear in policies, footer and email receipts. Do not publish a founder’s home address by inference. |
| Governing law and dispute venue | Toronto context is not a choice of contractual law; the supplied template defaults to US provisions | Have the owner and counsel choose these. Do not copy California law, arbitration or class-action waivers by default. |
| Website legal copy and retention | The policy now covers actual website data; the team must adopt a retention practice it can follow | Approve the policy and an internal review/deletion schedule. Do not collect campaign samples until separate processing disclosures and permissions are ready. |
| Production email delivery | The audit found no production Resend secret; stored enquiries do not prove inbox delivery | Set the sending key through the provider’s secret interface, verify the sending domain and inbox, and check a controlled production form receipt and team notice before enabling live campaigns. No secret belongs in this JSON file. |
| Analytics billing | Website event limits bound this code, not other ingestion using the public project key | Check PostHog project 661655’s billing limit and set a $0 limit. The connected API does not expose billing changes. |
| Automatic analytics: checked | Automatic injection is disabled on preview and live projects; served readiness pages contain no Cloudflare beacon | Recheck after settings changes. The release CSP also excludes this beacon. |

Before any paid campaign, confirm the permitted production tools, sample/model access and storage, retention/deletion limits, creator and brand licence terms, secured-funds mechanism, payment on approval, cancellation/rejection/refund rules, and remedies for misuse. These decisions do not prevent a website review preview. No campaign licence or biometric consent is created by the website terms.

The investor page uses founder information from the supplied deck and the service-first/platform-later model from the Master Doc. It publishes no raise amount, valuation, validated market-size claim or traction number. Confirm founder biographies before public launch.

Legal references: General Legal’s CC0 Terms of Use and GDPR-enhanced Privacy Policy informed the structure. Removed template assumptions include existing accounts, broad perpetual feedback rights, US arbitration/venue defaults, replay and unsupported compliance promises. Canadian guidance informed purpose-based retention, meaningful consent, accountable contact and clarity about processors abroad. This is a review draft, not a legal opinion or a claim of compliance in every market.

Sources:
- https://github.com/General-Legal/legal-templates
- https://www.priv.gc.ca/en/privacy-topics/privacy-for-businesses/appropriate-handling-of-personal-information/collecting-personal-information-and-consent/consent/gl_omc_201805/
- https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/
- https://competition-bureau.canada.ca/en/deceptive-marketing-practices/advertising-dos-and-donts
