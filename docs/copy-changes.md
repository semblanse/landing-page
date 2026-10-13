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
