#!/usr/bin/env python3
"""Build the website from content/*.json.

Usage:  python3 tools/build.py
Writes every page into the repository root (and projects/), plus sitemap.xml.
Edit the JSON in content/, then run this again. Standard library only.
"""
import json, math, html, os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://www.swapnilsingh.co.in/"
YEAR = "2026"

profile = json.loads((ROOT / "content/profile.json").read_text("utf8"))
pubs = json.loads((ROOT / "content/publications.json").read_text("utf8"))
proj = json.loads((ROOT / "content/projects.json").read_text("utf8"))
FIELDS = {f["id"]: f for f in proj["fields"]}
PROJECTS = proj["projects"]
BY_SLUG = {p["slug"]: p for p in PROJECTS}
ALL_PUBS = {p["id"]: p for p in pubs["articles"] + pubs["preprints"]}

e = lambda s: html.escape(str(s), quote=True)
NAME = profile["name"]
EMAIL = profile["email"]


def project_href(slug, prefix=""):
    p = BY_SLUG[slug]
    return prefix + (p["href"] if p.get("href") else f"projects/{slug}.html")


# ---------------------------------------------------------------- shell
NAV = [("research", "Research", "research.html"), ("publications", "Publications", "publications.html"),
       ("lab", "Lab", "lab.html"), ("about", "About", "cv.html"), ("contact", "Contact", "#contact")]


def head(*, title, description, path, prefix="", og_image="assets/portrait-public-v27.jpg", noindex=False, extra=""):
    canonical = SITE + ("" if path == "index.html" else path)
    robots = '<meta name="robots" content="noindex, follow">' if noindex else '<meta name="robots" content="index, follow, max-image-preview:large">'
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(title)}</title>
  <meta name="description" content="{e(description)}">
  <meta name="author" content="{e(NAME)}">
  {robots}
  <meta name="theme-color" content="#000000">
  <meta name="color-scheme" content="dark">
  <link rel="canonical" href="{canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="{e(NAME)}">
  <meta property="og:title" content="{e(title)}">
  <meta property="og:description" content="{e(description)}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="{SITE}{og_image}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="{prefix}assets/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="{prefix}assets/fonts/lm-roman-10.woff" as="font" type="font/woff" crossorigin>
  <link rel="preload" href="{prefix}assets/fonts/crimson-pro.woff" as="font" type="font/woff" crossorigin>
  <link rel="stylesheet" href="{prefix}assets/v3/site.css">
  <script defer src="{prefix}assets/v3/site.js"></script>{extra}
</head>"""


def header(active, prefix="", transparent=False):
    items = []
    for key, label, href in NAV:
        link = href if href.startswith("#") else prefix + href
        cur = ' aria-current="page"' if key == active else ""
        items.append(f'<li><a href="{link}"{cur}>{label}</a></li>')
    t = " data-transparent" if transparent else ""
    return f"""
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"{t}>
    <div class="wrap">
      <a class="site-name" href="{prefix}index.html">{e(NAME)}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><i aria-hidden="true"></i><span>Menu</span></button>
      <nav class="site-nav" id="site-nav" aria-label="Main">
        <ul>{''.join(items)}</ul>
      </nav>
    </div>
  </header>"""


def footer(prefix=""):
    links = "".join(f'<li><a href="{e(l["href"])}">{e(l["label"])}</a></li>' for l in profile["links"])
    pages = "".join(f'<li><a href="{prefix}{h}">{t}</a></li>' for t, h in
                    [("Research", "research.html"), ("Publications", "publications.html"), ("Lab", "lab.html"),
                     ("About and CV", "cv.html"), ("Privacy", "privacy.html")])
    return f"""
  <footer class="site-footer" id="contact">
    <div class="wrap top">
      <div>
        <h2>Contact</h2>
        <p>For collaboration, questions about a paper or an invitation to speak, write to me.</p>
        <a class="email" href="mailto:{EMAIL}">{EMAIL}</a>
      </div>
      <div><h3>Elsewhere</h3><ul>{links}</ul></div>
      <div><h3>This site</h3><ul>{pages}</ul></div>
    </div>
    <div class="wrap bottom">
      <span>© {YEAR} {e(NAME)}</span>
      <p class="visitor-count" data-visitor-count hidden><span class="live-dot" aria-hidden="true"></span><span><span data-visitor-number></span> unique visitors</span></p>
      <span class="colophon">Set in Latin Modern, Crimson Pro and Fira Sans.</span>
    </div>
  </footer>
</body>
</html>
"""


def page(path, body, *, title, description, active=None, transparent=False, noindex=False, og_image=None, extra=""):
    prefix = "../" if "/" in path else ""
    kw = {"og_image": og_image} if og_image else {}
    out = head(title=title, description=description, path=path, prefix=prefix, noindex=noindex, extra=extra, **kw)
    out += header(active, prefix, transparent) + "\n  <main id=\"main\">" + body + "\n  </main>" + footer(prefix)
    (ROOT / path).parent.mkdir(parents=True, exist_ok=True)
    (ROOT / path).write_text(out, "utf8")
    BUILT.append((path, noindex))


BUILT = []


# ---------------------------------------------------------------- references
def authors(lst):
    if not lst:
        return ""
    return ", ".join("<b>S. K. Singh</b>" if a == "me" else e(a) for a in lst)


def ref_links(p):
    out = []
    if p.get("arxiv"):
        out.append(f'<a href="https://arxiv.org/abs/{p["arxiv"]}">arXiv:{p["arxiv"]}</a>')
    if p.get("doi"):
        out.append(f'<a href="https://doi.org/{p["doi"]}">DOI</a>')
    if p.get("url"):
        out.append(f'<a href="{e(p["url"])}">Journal page</a>')
    if p.get("inspire") and not (p.get("doi") or p.get("arxiv")):
        out.append('<a href="https://inspirehep.net/authors/2052015">INSPIRE-HEP</a>')
    return out


def ref(p, prefix=""):
    a = authors(p.get("authors"))
    title = e(p["title"])
    if p.get("lab"):
        title = f'<a href="{prefix}lab.html">{title}</a>'
    venue = []
    if p.get("venue"):
        v = f'<i>{e(p["venue"])}</i>'
        if p.get("volume"):
            v += f' {e(p["volume"])}'
        if p.get("pages"):
            v += f', {e(p["pages"])}'
        v += f' ({e(p["year"])})'
        venue.append(v)
    elif p.get("year"):
        venue.append(f'Preprint, {e(p["year"])}')
    if p.get("status"):
        venue.append(f'<span class="status">{e(p["status"])}</span>')
    venue += ref_links(p)
    if p.get("lab"):
        venue.append(f'<a href="{prefix}lab.html">Interactive model</a>')
    a_html = f'<span class="a">{a}</span>' if a else ""
    return f'<li class="ref"><div><span class="t">{title}</span>{a_html}<span class="v">{"".join(f"<span>{x}</span>" for x in venue)}</span></div></li>'


# ---------------------------------------------------------------- figures
def path_from(fn, x0, x1, X, Y, n=160):
    pts = []
    for i in range(n + 1):
        x = x0 + (x1 - x0) * i / n
        pts.append(f"{'M' if i == 0 else 'L'}{X(x):.1f} {Y(fn(x)):.1f}")
    return "".join(pts)


def fig_inflation():
    W, H, L, R, T, B = 360, 230, 34, 344, 16, 196
    X = lambda x: L + (x - 0) / 8 * (R - L)
    Y = lambda y: B - y / 1.25 * (B - T)
    V = lambda f: math.tanh(f / math.sqrt(6)) ** 2
    d = path_from(V, 0, 8, X, Y)
    bx = 6.2
    return f"""<svg viewBox="0 0 {W} {H}" role="img" aria-labelledby="f2a">
  <title id="f2a">Plateau-shaped inflaton potential with the field rolling slowly toward the minimum</title>
  <path class="plot-axis" d="M{L} {T} V{B} H{R}"/>
  <path class="plot-curve" d="{d}"/>
  <path class="plot-curve hot" d="M{X(bx)-6:.1f} {Y(V(bx))-14:.1f} H{X(4.6):.1f} m7 -4 l-7 4 l7 4"/>
  <circle class="plot-dot" cx="{X(bx):.1f}" cy="{Y(V(bx))-5:.1f}" r="5"/>
  <text class="plot-label" x="{L+8}" y="{T+12}">V(φ)</text>
  <text class="plot-label" x="{R-14}" y="{B+20}">φ</text>
  <text class="plot-note" x="{X(4.3):.1f}" y="{Y(V(bx))-26:.1f}">slow roll</text>
</svg>"""


def fig_fold():
    W, H, L, R, T, B = 360, 230, 34, 344, 16, 196
    X = lambda x: L + (x + 2) / 4.2 * (R - L)
    Y = lambda y: B - (y + 1.6) / 3.2 * (B - T)
    curves = []
    for a, cls in [(1.0, "plot-curve soft"), (0.42, "plot-curve"), (0.0, "plot-curve hot dash")]:
        d = path_from(lambda x, a=a: max(-1.6, min(1.6, x ** 3 / 3 - a * x)), -2, 2.2, X, Y)
        curves.append(f'<path class="{cls}" d="{d}"/>')
    r = math.sqrt(0.42)
    return f"""<svg viewBox="0 0 {W} {H}" role="img" aria-labelledby="f2b">
  <title id="f2b">A potential with a minimum and a barrier that merge as the uplift increases</title>
  <path class="plot-axis" d="M{L} {T} V{B} H{R}"/>
  {''.join(curves)}
  <circle class="plot-ring" cx="{X(-r):.1f}" cy="{Y(-r**3/3 + .42*r):.1f}" r="4"/>
  <circle class="plot-dot" cx="{X(r):.1f}" cy="{Y(r**3/3 - .42*r):.1f}" r="4.5"/>
  <text class="plot-label" x="{L+8}" y="{T+12}">V(σ)</text>
  <text class="plot-label" x="{R-14}" y="{B+20}">σ</text>
  <text class="plot-note" x="{X(.35):.1f}" y="{Y(.62):.1f}">wall</text>
</svg>"""


def fig_hubble():
    W, H, L, R, T, B = 360, 230, 34, 344, 16, 196
    X = lambda z: L + z / 2.0 * (R - L)
    Y = lambda h: B - (h - 64) / 12 * (B - T)
    pts = [(.06, 73.2, .9), (.22, 72.4, 1.0), (.42, 71.5, 1.2), (.7, 70.8, 1.5), (1.05, 70.1, 1.9), (1.5, 69.4, 2.4)]
    marks = []
    for z, h, s in pts:
        marks.append(f'<path class="plot-curve soft" d="M{X(z):.1f} {Y(h-s):.1f} V{Y(h+s):.1f}"/><circle class="plot-dot" cx="{X(z):.1f}" cy="{Y(h):.1f}" r="3.6"/>')
    trend = path_from(lambda z: 73.6 - 2.9 * math.log(1 + z) * 1.45, 0, 1.9, X, Y, 60)
    return f"""<svg viewBox="0 0 {W} {H}" role="img" aria-labelledby="f2c">
  <title id="f2c">Schematic: the Hubble constant fitted in redshift bins, drifting downward with redshift</title>
  <path class="plot-axis" d="M{L} {T} V{B} H{R}"/>
  <path class="plot-curve soft dash" d="M{L} {Y(70.6):.1f} H{R}"/>
  <path class="plot-curve" d="{trend}"/>
  {''.join(marks)}
  <text class="plot-label" x="{L+8}" y="{T+12}">H₀(z)</text>
  <text class="plot-label" x="{R-14}" y="{B+20}">z</text>
  <text class="plot-note" x="{R-60}" y="{Y(70.6)-8:.1f}">constant</text>
</svg>"""


def fig_fold_interactive():
    return """<div class="fold" data-fold>
  <svg viewBox="0 0 560 320" role="img" aria-labelledby="f3t">
    <title id="f3t">Interactive plot of V(x; a) = x³/3 − a x. Moving the slider changes a.</title>
    <path class="plot-grid" d="M48 154 H540"/>
    <path class="plot-axis" d="M48 18 V290 H540"/>
    <line class="plot-curve soft dash" data-gap x1="0" y1="0" x2="0" y2="0"/>
    <path class="plot-curve hot" data-curve d=""/>
    <circle class="plot-ring" data-max r="5.5" cx="0" cy="0"/>
    <circle class="plot-dot" data-min r="6" cx="0" cy="0"/>
    <text class="plot-label" x="58" y="36">V(x; a)</text>
    <text class="plot-label" x="524" y="312">x</text>
  </svg>
  <div class="fold-controls">
    <label for="fold-a">a</label>
    <input id="fold-a" type="range" min="-0.3" max="1" step="0.01" value="0.6" aria-describedby="fold-help">
    <output for="fold-a">0.60</output>
  </div>
  <dl class="fold-read">
    <div><dt>Barrier height ΔV = (4/3) a<sup>3/2</sup></dt><dd data-dv></dd></div>
    <div><dt>Curvature at minimum V″ = 2a<sup>1/2</sup></dt><dd data-m2></dd></div>
    <p class="fold-state" data-state aria-live="polite"></p>
  </dl>
</div>"""


# ---------------------------------------------------------------- pages
def build_home():
    selected = [p for p in pubs["articles"] if p.get("selected")]
    total = len(pubs["articles"]) + len(pubs["preprints"])
    bio = "".join(f"<p>{e(p)}</p>" for p in profile["bio"])
    themes = [
        ("Inflation and the early universe", fig_inflation(), "2a",
         "A plateau potential of the α-attractor type. Inflation lasts while the field rolls slowly along the plateau.",
         "Which inflationary models survive ACT DR6 and DESI DR2, how α-attractors arise in supergravity, and how primordial black holes and induced gravitational waves are produced through a cosmological bounce.",
         [("inflation-act-desi", "Inflation under ACT and DESI"), ("pbh-sigw-bounce", "Black holes in a bounce")]),
        ("String compactification and quantum gravity", fig_fold(), "2b",
         "Raising the uplift lifts the volume minimum toward its barrier until both disappear at the stability wall (dashed).",
         "When a string vacuum can support inflation at all: moduli stabilisation and its limits in brane–antibrane inflation, deformed phase-space geometry, and higher-loop structure in supersymmetric gauge theory.",
         [("kahler-stability-wall", "The Kähler stability wall"), ("quantum-phase-space", "Deformed phase space")]),
        ("Late-time cosmology and probes", fig_hubble(), "2c",
         "Schematic of the test, with illustrative points: H₀ fitted in redshift bins. A constant lies flat; a drift points to new physics or a mis-specified background.",
         "Whether the Hubble constant runs with redshift in supernova data, emergent cosmologies in dissipative f(T) gravity, and lensed fast radio bursts as distance probes.",
         [("running-hubble", "A running Hubble constant"), ("emergent-ft-gravity", "Emergent f(T) cosmology"), ("frb-lensing", "FRB lensing")]),
    ]
    theme_html = ""
    for title, svg, num, cap, text, rel in themes:
        links = ", ".join(f'<a href="{project_href(s)}">{e(t)}</a>' for s, t in rel)
        theme_html += f"""
          <article class="theme">
            <figure class="figure">{svg}<figcaption><b>Figure {num}.</b> {e(cap)}</figcaption></figure>
            <h3>{e(title)}</h3>
            <p>{e(text)}</p>
            <p class="related">Projects: {links}</p>
          </article>"""
    kw = ALL_PUBS["kahler-wall"]
    refs = "".join(ref(p) for p in selected)
    body = f"""
    <section class="hero" aria-labelledby="name">
      <div class="bh-stage" id="blackhole-entry" data-gateway-mode="portal"><canvas id="blackhole-gateway-canvas" aria-hidden="true"></canvas></div>
      <div class="wrap">
        <div class="hero-copy">
          <h1 id="name">{e(NAME)}</h1>
          <p class="affil">Theoretical cosmology, University of Florence</p>
          <p class="lede">{e(profile["lede"])}</p>
          <div class="actions">
            <a class="btn btn-primary" href="#latest">Latest result</a>
            <a class="btn" href="publications.html">Publications</a>
          </div>
        </div>
      </div>
      <p class="fig1"><b>Figure 1.</b> Light bending around a Schwarzschild black hole with a Doppler-brightened accretion disk, rendered live in your browser.</p>
    </section>

    <section class="section" aria-labelledby="abstract-h">
      <div class="wrap abstract">
        <figure class="portrait"><img src="assets/portrait-about.webp" width="1122" height="1402" alt="Portrait of {e(NAME)}" loading="lazy"></figure>
        <div class="text">
          <h2 id="abstract-h">Abstract</h2>
          {bio}
          <div class="actions"><a class="btn" href="cv.html">About and CV</a></div>
        </div>
      </div>
    </section>

    <section class="section" id="research-themes" aria-labelledby="research-h">
      <div class="wrap">
        <h2 class="section-title" id="research-h"><span class="n">1</span> Research</h2>
        <p class="section-intro">Three connected questions about where the universe came from and how we can test it. Each links to the projects behind it.</p>
        <div class="themes">{theme_html}
        </div>
        <p class="engineering-note">Before physics I trained as a mechanical engineer. That work, in combustion, heat transfer, structures and space systems, is in the <a href="research.html#engineering">research index</a>.</p>
      </div>
    </section>

    <section class="section" id="latest" aria-labelledby="latest-h">
      <div class="wrap">
        <h2 class="section-title" id="latest-h"><span class="n">2</span> Latest result</h2>
        <div class="latest">
          <div>
            <h3><a href="https://arxiv.org/abs/{kw["arxiv"]}">The Kähler stability wall in perturbative brane–antibrane inflation</a></h3>
            <p class="byline">S. K. Singh, arXiv:{kw["arxiv"]} [hep-th], November 2026</p>
            <div class="summary">
              <p>Brane–antibrane inflation needs the Kähler volume to stay stabilised while the anti-D3 tension drives inflation. That sets an exact upper bound on the tension: beyond it, the volume minimum and its barrier merge and disappear.</p>
              <p>The paper finds this boundary in closed form, derives how the modulus mass and barrier height vanish as it is approached, and turns the result into necessary conditions on the flux data of candidate compactifications.</p>
            </div>
            <div class="actions">
              <a class="btn btn-primary" href="https://arxiv.org/abs/{kw["arxiv"]}">Read on arXiv</a>
              <a class="btn" href="lab.html">Open the full model</a>
            </div>
          </div>
          <figure class="figure">
            {fig_fold_interactive()}
            <figcaption id="fold-help"><b>Figure 3.</b> Drag <span class="math">a</span> toward zero. Near the wall the potential takes the local form <span class="math">V = x<sup>3</sup>/3 − a x</span>: the minimum (amber) and barrier (ring) approach each other, the barrier height falls as <span class="math">a<sup>3/2</sup></span> and the curvature as <span class="math">a<sup>1/2</sup></span>.</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="section" id="papers" aria-labelledby="papers-h">
      <div class="wrap">
        <h2 class="section-title" id="papers-h"><span class="n">3</span> Selected papers</h2>
        <div class="article">
          <div class="main"><ol class="refs">{refs}</ol>
            <div class="actions more-link"><a class="btn" href="publications.html">All {total} papers and preprints</a><a class="btn" href="https://inspirehep.net/authors/2052015">INSPIRE-HEP</a></div>
          </div>
          <aside class="margin"><p class="margin-note">Journal articles, newest first. Author lists are complete; my name is in bold.</p></aside>
        </div>
      </div>
    </section>"""
    extra = '\n  <script defer src="assets/blackhole-gateway-v3.js?v=16"></script>\n  <script defer src="assets/v3/fold.js"></script>\n  <script type="application/ld+json">' + json.dumps({
        "@context": "https://schema.org", "@type": "Person", "name": NAME, "url": SITE, "email": "mailto:" + EMAIL,
        "jobTitle": "Physicist", "affiliation": {"@type": "CollegeOrUniversity", "name": "University of Florence"},
        "knowsAbout": ["Cosmology", "Inflation", "String compactification", "Early universe"],
        "image": SITE + "assets/portrait-about.webp", "sameAs": [l["href"] for l in profile["links"]]}, ensure_ascii=False) + "</script>"
    page("index.html", body, title=f"{NAME}: theoretical cosmology",
         description=profile["lede"] + " University of Florence.", transparent=True, extra=extra)


def project_row(p):
    meta = " · ".join(x for x in [p.get("period"), p.get("institution")] if x)
    return f"""<li class="project-row"><a href="{project_href(p['slug'])}"><div><h3>{e(p['title'])}</h3><p>{e(p['question'])}</p></div><div class="meta">{e(meta)}</div></a></li>"""


def build_research():
    sections = ""
    for i, f in enumerate(proj["fields"], 1):
        rows = "".join(project_row(p) for p in PROJECTS if p["field"] == f["id"])
        sections += f"""
      <section class="field" id="{f['id'] if f['id'] != 'engineering' else 'engineering'}" aria-labelledby="h-{f['id']}">
        <div class="wrap">
          <h2 class="section-title" id="h-{f['id']}"><span class="n">{i}</span> {e(f['title'])}</h2>
          <p class="section-intro">{e(f['intro'])}</p>
          <ul class="project-list">{rows}</ul>
        </div>
      </section>"""
    body = f"""
    <header class="page-head"><div class="wrap">
      <h1>Research</h1>
      <p class="lede">{len(PROJECTS)} projects, from string compactifications to flame chemistry. Each record states the question, the methods and where the work was done.</p>
    </div></header>{sections}"""
    page("research.html", body, title=f"Research | {NAME}", description="Research projects of Swapnil Kumar Singh in cosmology, astrophysics and engineering.", active="research")


def build_projects():
    for f in proj["fields"]:
        group = [p for p in PROJECTS if p["field"] == f["id"]]
        for i, p in enumerate(group):
            if p.get("href"):
                continue
            prev_p, next_p = group[i - 1] if i > 0 else None, group[i + 1] if i + 1 < len(group) else None
            facts = ""
            for label, key in [("Period", "period"), ("Institution", "institution"), ("Location", "location")]:
                if p.get(key):
                    facts += f"<div><dt>{label}</dt><dd>{e(p[key])}</dd></div>"
            facts += f'<div><dt>Field</dt><dd><a href="../research.html#{f["id"]}">{e(f["title"])}</a></dd></div>'
            tags = "".join(f"<li>{e(m)}</li>" for m in p.get("methods", []))
            papers = [ALL_PUBS[x] for x in p.get("papers", []) if x in ALL_PUBS]
            talks = [t for t in pubs["talks"] if t.get("project") == p["slug"]]
            out = ""
            if papers:
                out += f'<h2 class="subhead">Publications</h2><ol class="refs">{"".join(ref(x, "../") for x in papers)}</ol>'
            if talks:
                items = "".join(
                    f'<li class="ref"><div><span class="t">{e(t["title"])}</span><span class="v"><span>{e(t["kind"])}, {e(t["event"])}, {e(t["year"])}</span>' +
                    (f'<span><a href="{e(t["url"])}">Record</a></span>' if t.get("url") else "") + "</span></div></li>" for t in talks)
                out += f'<h2 class="subhead">Talks and posters</h2><ol class="refs">{items}</ol>'
            nav = '<nav class="project-nav" aria-label="More projects in this field">'
            nav += (f'<a href="{prev_p["slug"]}.html"><span>Previous</span><strong>{e(prev_p["title"])}</strong></a>' if prev_p and not prev_p.get("href") else
                    (f'<a href="../{prev_p["href"]}"><span>Previous</span><strong>{e(prev_p["title"])}</strong></a>' if prev_p else "<span></span>"))
            nav += (f'<a class="next" href="{next_p["slug"]}.html"><span>Next</span><strong>{e(next_p["title"])}</strong></a>' if next_p else "<span></span>")
            nav += "</nav>"
            body = f"""
    <header class="page-head"><div class="wrap">
      <p class="crumb"><a href="../research.html">Research</a> / <a href="../research.html#{f['id']}">{e(f['title'])}</a></p>
      <h1>{e(p['title'])}</h1>
      <p class="lede"><em>{e(p['question'])}</em></p>
    </div></header>
    <div class="wrap project-body">
      <div class="article">
        <div class="main prose">
          <p class="big">{e(p['summary'])}</p>
          <h2 class="subhead">Methods</h2>
          <ul class="tags">{tags}</ul>
          {out}
          {nav}
        </div>
        <aside class="margin"><dl class="facts">{facts}</dl></aside>
      </div>
    </div>"""
            page(f"projects/{p['slug']}.html", body, title=f"{p['title']} | {NAME}", description=p["question"], active="research")


def build_publications():
    arts, pre, rev, talks = pubs["articles"], pubs["preprints"], pubs["in_review"], pubs["talks"]
    n1 = len(arts)
    pre_html = "".join(ref(p) for p in pre)
    rev_html = "".join(f'<li class="ref"><div><span class="t">{e(p["title"])}</span><span class="a"><b>S. K. Singh</b></span><span class="v"><span class="status">{e(p["status"])}</span></span></div></li>' for p in rev)
    talk_html = "".join(
        f'<li class="ref"><div><span class="t">{e(t["title"])}</span><span class="v"><span>{e(t["kind"])}, {e(t["event"])}' + (f', {e(t["place"])}' if t.get("place") else "") + f' ({e(t["year"])})</span>' +
        (f'<span><a href="{e(t["url"])}">Record</a></span>' if t.get("url") else "") + "</span></div></li>" for t in talks)
    body = f"""
    <header class="page-head"><div class="wrap">
      <h1>Publications</h1>
      <p class="lede">{len(arts)} journal articles and {len(pre)} preprints. The live record, with citations, is on <a href="https://inspirehep.net/authors/2052015">INSPIRE-HEP</a>.</p>
    </div></header>
    <div class="wrap">
      <section class="section" id="articles" aria-labelledby="h-articles">
        <h2 class="section-title" id="h-articles"><span class="n">1</span> Journal articles</h2>
        <div class="article"><div class="main"><ol class="refs">{''.join(ref(p) for p in arts)}</ol></div>
        <aside class="margin"><p class="margin-note">Newest first. Complete author lists; my name is in bold. Two Annals of Physics articles are in press and listed with their volume.</p></aside></div>
      </section>
      <section class="section" id="preprints" aria-labelledby="h-preprints">
        <h2 class="section-title" id="h-preprints"><span class="n">2</span> Preprints</h2>
        <div class="article"><div class="main"><ol class="refs" style="--start:{n1}">{pre_html}</ol></div>
        <aside class="margin"><p class="margin-note">On arXiv. Where a manuscript is with a journal, the journal is named.</p></aside></div>
      </section>
      <section class="section" id="in-review" aria-labelledby="h-review">
        <h2 class="section-title" id="h-review"><span class="n">3</span> Under review</h2>
        <div class="article"><div class="main"><ol class="refs" style="--start:{n1 + len(pre)}">{rev_html}</ol></div>
        <aside class="margin"><p class="margin-note">Not yet public.</p></aside></div>
      </section>
      <section class="section" id="talks" aria-labelledby="h-talks">
        <h2 class="section-title" id="h-talks"><span class="n">4</span> Talks and posters</h2>
        <div class="article"><div class="main"><ol class="refs">{talk_html}</ol></div><aside class="margin"></aside></div>
      </section>
    </div>"""
    page("publications.html", body, title=f"Publications | {NAME}", description="Journal articles, preprints and talks by Swapnil Kumar Singh in cosmology, gravitation and high-energy theory.", active="publications")


def timeline(items):
    out = ""
    for a in items:
        more = f' <a class="more" href="{project_href(a["project"])}">Project record</a>' if a.get("project") else ""
        out += f"""<li><span class="when">{e(a['dates'])}</span><div><h3>{e(a['role'])}</h3><p class="org">{e(a['org'])}<span class="place">{e(a['place'])}</span></p><p>{e(a['text'])}{more}</p></div></li>"""
    return f'<ol class="timeline">{out}</ol>'


def build_cv():
    edu = "".join(f"""<li><span class="when">{e(x['dates'])}</span><div><h3>{e(x['degree'])}</h3><p class="org">{e(x['place'])}</p><p>{e(x['detail'])}</p></div></li>""" for x in profile["education"])
    acts = "".join(f"<li><b>{e(a['title'])}.</b> {e(a['text'])}</li>" for a in profile["activities"])
    train = "".join(f"<li>{e(t)}</li>" for t in profile["training"])
    skills = "".join(f"<div><dt>{e(s['area'])}</dt><dd>{e(s['items'])}</dd></div>" for s in profile["skills"])
    bio = "".join(f"<p>{e(p)}</p>" for p in profile["bio"])
    secs = [("education", "Education", f'<ol class="timeline">{edu}</ol>'),
            ("appointments", "Research appointments", timeline(profile["appointments"])),
            ("engineering", "Engineering", timeline(profile["engineering"])),
            ("activities", "Scientific activities", f'<ul class="plain-list">{acts}</ul>'),
            ("training", "Schools and courses", f'<ul class="plain-list">{train}</ul>'),
            ("skills", "Methods and tools", f'<dl class="skills">{skills}</dl>')]
    sec_html = "".join(f"""
      <section class="section" id="{sid}" aria-labelledby="h-{sid}">
        <h2 class="section-title" id="h-{sid}"><span class="n">{i}</span> {t}</h2>
        <div class="article"><div class="main">{c}</div><aside class="margin"></aside></div>
      </section>""" for i, (sid, t, c) in enumerate(secs, 1))
    body = f"""
    <header class="page-head"><div class="wrap">
      <h1>About</h1>
      <p class="lede">Theoretical physicist working on the early universe. MSc student at the University of Florence.</p>
    </div></header>
    <div class="wrap">
      <section class="section" aria-label="Biography">
        <div class="abstract">
          <figure class="portrait"><img src="assets/portrait-about.webp" width="1122" height="1402" alt="Portrait of {e(NAME)}"></figure>
          <div class="text">{bio}
            <div class="actions"><a class="btn btn-primary" href="mailto:{EMAIL}">Email me</a><a class="btn" href="publications.html">Publications</a><a class="btn" href="https://inspirehep.net/authors/2052015">INSPIRE-HEP</a></div>
          </div>
        </div>
      </section>{sec_html}
    </div>"""
    page("cv.html", body, title=f"About | {NAME}", description="Biography, education, research appointments and skills of Swapnil Kumar Singh.", active="about")


def build_lab():
    body = """
    <header class="page-head"><div class="wrap">
      <p class="crumb"><a href="research.html">Research</a> / <a href="research.html#theory">Cosmology and theory</a></p>
      <h1>The Kähler stability wall</h1>
      <p class="lede">An interactive companion to arXiv:2611.08491. Vary the uplift and watch the volume minimum and its barrier converge at the critical point.</p>
      <div class="actions"><a class="btn btn-primary" href="https://arxiv.org/abs/2611.08491">Read the paper</a><a class="btn" href="https://arxiv.org/pdf/2611.08491">PDF</a><a class="btn" href="research/kahler-stability-wall/">Open full screen</a></div>
    </div></header>
    <div class="wrap">
      <div class="lab-frame">
        <iframe title="The Kähler stability wall: interactive model" src="research/kahler-stability-wall/" loading="lazy" allow="fullscreen" allowfullscreen></iframe>
        <div class="lab-frame-bar"><span>An explanatory model of the potential, not a simulation of the universe evolving in time.</span><a href="research/kahler-stability-wall/">Open in its own tab</a></div>
      </div>
      <section class="section" aria-labelledby="h-moves">
        <h2 class="section-title" id="h-moves"><span class="n">1</span> The paper in three steps</h2>
        <div class="movements">
          <article><h3>The boundary</h3><p>The positive-tension stability wall is found analytically, at the saddle-node point where the Kähler minimum merges with its decompactification barrier.</p></article>
          <article><h3>Where the effective theory breaks</h3><p>Near the wall the modulus mass and barrier height scale critically. A Schur-complement test shows when integrating out the volume stops being justified.</p></article>
          <article><h3>Flux filters</h3><p>Throat, tadpole, conifold, normalisation and mass-matrix conditions restrict candidate compact realisations. They are necessary, not sufficient: no compact vacuum is claimed.</p></article>
        </div>
      </section>
      <section class="section" aria-labelledby="h-cite">
        <h2 class="section-title" id="h-cite"><span class="n">2</span> Cite</h2>
        <div class="article"><div class="main"><ol class="refs"><li class="ref"><div><span class="t">The Kähler stability wall in perturbative brane–antibrane inflation</span><span class="a"><b>S. K. Singh</b></span><span class="v"><span>arXiv:2611.08491 [hep-th] (2026)</span><span><a href="https://arxiv.org/abs/2611.08491">arXiv</a></span></span></div></li></ol></div><aside class="margin"></aside></div>
      </section>
    </div>"""
    page("lab.html", body, title=f"The Kähler stability wall: interactive model | {NAME}",
         description="Interactive companion to arXiv:2611.08491: explore where the Kähler minimum and its barrier merge in brane–antibrane inflation.",
         active="lab", og_image="research/kahler-stability-wall/og-cover.png")


def build_privacy():
    body = """
    <header class="page-head"><div class="wrap"><h1>Privacy</h1>
      <p class="lede">This site has no accounts, forms, advertising or live chat, and sets no cookies.</p></div></header>
    <div class="wrap"><div class="article" style="padding-top:3.5rem"><div class="main prose">
      <h2>Who is responsible</h2>
      <p>This is the personal research website of Swapnil Kumar Singh, Florence, Italy. Write to <a href="mailto:swapnilsingh.ph@gmail.com">swapnilsingh.ph@gmail.com</a> with any privacy question.</p>
      <h2>Visitor statistics</h2>
      <p>Visits are counted with <a href="https://www.goatcounter.com/help/privacy">GoatCounter</a>, which uses no cookies and does not store IP addresses. It records the page visited, the referring site, browser type, screen size and approximate country, and uses a short-lived hash to count each visitor once. The total number of unique visitors is shown at the foot of each page. The legal basis is a legitimate interest in knowing, in aggregate, how the site is used (Art. 6(1)(f) GDPR).</p>
      <h2>Hosting and other services</h2>
      <p>The site is hosted on GitHub Pages, which processes connection data such as IP addresses to deliver pages (<a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub privacy statement</a>). All typefaces are served from this site; no fonts or scripts are loaded from Google. Links to arXiv, INSPIRE-HEP, journals, GitHub and LinkedIn lead to sites with their own policies.</p>
      <h2>Email</h2>
      <p>If you write to me, I use your message and address only to reply, and keep them no longer than the conversation needs.</p>
      <h2>Your rights</h2>
      <p>You can ask for access to, correction or deletion of personal data I hold about you, and you can complain to the Garante per la protezione dei dati personali.</p>
      <p class="margin-note">Last updated 25 November 2026.</p>
    </div><aside class="margin"></aside></div></div>"""
    page("privacy.html", body, title=f"Privacy | {NAME}", description="Privacy information for the personal research website of Swapnil Kumar Singh.", noindex=True)


def build_404():
    body = """
    <div class="wrap lost">
      <p class="code" aria-hidden="true">404</p>
      <h1>There is nothing at this address.</h1>
      <p>The page may have moved when the site was reorganised. These are the main sections:</p>
      <div class="actions"><a class="btn btn-primary" href="/">Home</a><a class="btn" href="/research.html">Research</a><a class="btn" href="/publications.html">Publications</a><a class="btn" href="/cv.html">About</a></div>
    </div>"""
    # 404 is served at arbitrary depths, so it uses root-absolute asset paths.
    out = head(title=f"Page not found | {NAME}", description="This page does not exist.", path="404.html", prefix="/", noindex=True)
    out += header(None, "/") + '\n  <main id="main">' + body + "\n  </main>" + footer("/")
    (ROOT / "404.html").write_text(out, "utf8")


REDIRECTS = {
    "world.html": "index.html", "news.html": "index.html", "quiet-hours.html": "index.html",
    "private.html": "index.html", "ideas.html": "research.html", "projects.html": "research.html",
    "cosmology.html": "research.html#theory", "computation.html": "research.html",
    "engineering.html": "research.html#engineering",
}


def build_redirects():
    for src, dst in REDIRECTS.items():
        (ROOT / src).write_text(f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Moved | {e(NAME)}</title>
<meta name="robots" content="noindex, follow"><meta name="description" content="This page has moved.">
<meta http-equiv="refresh" content="0; url={dst}"><link rel="canonical" href="{SITE}{'' if dst == 'index.html' else dst}">
<script>location.replace({json.dumps(dst)} + location.hash);</script>
<style>body{{background:#000;color:#ece7dd;font:18px Georgia,serif;padding:3rem}}a{{color:#e3a764}}</style></head>
<body><p>This page has moved to <a href="{dst}">{dst.split('#')[0]}</a>.</p></body></html>
""", "utf8")


def build_sitemap():
    urls = ["index.html", "research.html", "publications.html", "lab.html", "cv.html"]
    urls += [f"projects/{p['slug']}.html" for p in PROJECTS if not p.get("href")]
    urls.append("research/kahler-stability-wall/")
    body = "".join(f"  <url><loc>{SITE}{'' if u == 'index.html' else u}</loc></url>\n" for u in urls)
    (ROOT / "sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{body}</urlset>\n', "utf8")


if __name__ == "__main__":
    build_home(); build_research(); build_projects(); build_publications(); build_cv()
    build_lab(); build_privacy(); build_404(); build_redirects(); build_sitemap()
    print(f"Built {len(BUILT) + 1} pages, {len(REDIRECTS)} redirects and sitemap.xml")
