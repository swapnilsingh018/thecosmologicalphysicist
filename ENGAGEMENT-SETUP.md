# Visitor analytics, availability and live chat

The public interface is intentionally truthful. It **does not** invent visit
counts or show a green online dot until a real service is connected.

## Live chat — a practical free starting point

1. The owner's website property in [tawk.to](https://www.tawk.to/) is linked
   through the public IDs in `assets/engagement-config.js`. Add
   `www.swapnilsingh.co.in` to the allowed sites if the dashboard requests it.
   No account password or private API key belongs in the repository.
3. In the operator dashboard, set yourself to **Online** when accepting chats.
   The small dot will turn green only after tawk.to's official status callback
   reports `online`. It turns amber for `away`, grey for `offline`, and stays
   grey for `offline`. Before the service loads, the button says `Connecting…`;
   if the script cannot load it says `Chat unavailable`. Clicking the entrance
   button or a Public Research contact action opens tawk.to's actual chat
   widget, even if the visitor clicks during loading. There is no email form.
4. Set conversation notification and transcript emails to
   `swapnilsingh.ph@gmail.com` in the operator dashboard.
5. Before enabling the third-party widget publicly, update the site's privacy
   notice and check the applicable consent requirements.

The website loads the widget exactly once through `assets/engagement.js`.
Do not paste the vendor embed snippet as a second script into the HTML: that
would load duplicate chat widgets. The chat provider handles transcripts and
offline messages. Verify that messages actually reach the owner's dashboard
after GitHub Pages is updated.

**Important distinction:** an operator being **Online** is not identical to a
Mac being powered on. If the owner needs the latter literally, it requires an
opt-in Mac heartbeat service with a private token and backend endpoint. Do not
display a green light merely because a visitor opened the page.

## Real visitor counts and emailed reports

For a GitHub Pages site, JavaScript alone cannot securely count unique visitors
across devices, maintain authoritative totals, or send scheduled reports.
There must be an analytics service and, for a public counter/report, a trusted
backend that holds credentials outside the static repository.

A recommended privacy-conscious route is:

1. Enable Cloudflare Web Analytics for the domain. It can work without moving
   DNS to Cloudflare. Confirm what the dashboard calls a *visitor* and which
   reporting API or export mechanism is available for the selected account.
2. Agree on the metric: **unique browsers per day or per 30 days**, not
   guaranteed unique human beings. Suppress self-visits and bots where
   supported. Keep the count in the analytics provider/backend.
3. Create a small read-only endpoint with CORS limited to this domain:
   `GET https://YOUR-ENDPOINT/visitor-stats` returning, for example,
   `{ "uniqueVisitors": 127 }`. Only configure this URL when real data is
   returned. The footer counter will remain hidden before that.
4. Schedule a backend report with daily/weekly total, unique visitors, top
   pages and referrers to `swapnilsingh.ph@gmail.com`. The mail API token and
   any analytics API credential must be deployed as **server secrets** and
   never copied into frontend JavaScript, Git, or public chat.
5. Publish a privacy notice in English and Italian explaining the analytics
   and chat providers, data retention, and visitors' choices. For Italian
   visitors, check the Garante's cookie/analytics guidance before enabling
   identifiers or third-party scripts.

The current `assets/engagement-config.js` values are intentionally empty.
When the owner supplies the service IDs and chooses the reporting backend,
the integration can be activated without changing the homepage layout.

Sources: Cloudflare Web Analytics documentation; tawk.to JavaScript API and
online-status documentation; Italian Garante Privacy FAQ on analytics cookies.
