# Tooling For Innovation Research

Use this reference only when the user asks to investigate APIs, libraries, datasets, trend sources, patents, papers, competitors, or evidence for idea generation.

## Current Research Sources Checked

Checked 2026-07-03.

| Tool/API | Best use | Notes |
|---|---|---|
| OpenAlex API | Broad scholarly landscape, topics, institutions, citation graph | Fully open catalog of scholarly works and connected entities. Good first choice for open bibliographic search. |
| Semantic Scholar Academic Graph API | Papers, citations, authors, recommendations, embeddings | Strong for research discovery and related-paper expansion. Some endpoints are public; API key is recommended for reliability and higher limits. |
| Crossref REST API | DOI metadata, publisher records, funding/license/retraction-related metadata | No sign-up required for most metadata. Useful for metadata verification more than semantic discovery. |
| arXiv API | Fresh preprints in AI, CS, physics, math, statistics, quantitative fields | No key needed. Returns Atom; use for emerging technical ideas. |
| USPTO PatentsView / USPTO Open Data Portal | Patent landscape, inventors, assignees, technology fields | PatentsView is in transition to USPTO ODP. Prefer official USPTO pages and confirm current API/download availability before relying on automation. |
| Google Trends API | Search demand, timing, geography, emerging interest | Official API was announced as alpha in 2025 and access is limited. Treat as gated; fallback to Trends web, Search Console data, or licensed data providers. |
| pytrends | Unofficial Google Trends access from Python | Use only for quick personal exploration. It is unofficial and can break or be blocked. Do not design production workflows around it. |
| IdeaMiner / similar GitHub topic projects | Research-agent inspiration | Treat as immature inspiration unless repository activity, license, tests, and fit are verified. Do not assume production readiness from topic labels. |

## Selection Guidance

- For science- or technology-led ideas: start with OpenAlex or Semantic Scholar, then use arXiv for recency.
- For patentability, white-space, or prior-art exploration: start with USPTO/PatentsView data and complement with Google Patents manually when needed.
- For consumer demand and timing: use Google Trends API if available; otherwise use Trends web, search ads tools, social listening, or customer interviews.
- For bibliographic metadata cleanup: use Crossref after finding candidate works elsewhere.
- For automated pipelines: prefer official APIs over scraping or unofficial wrappers.

## Research Pattern

1. Convert the challenge into 3-8 search phrases:
   - problem phrase;
   - user/job phrase;
   - technology phrase;
   - opposite-domain analogy phrase;
   - patent/classification phrase when relevant.
2. Pull 10-30 evidence items, then cluster by mechanism rather than topic label.
3. Extract signals:
   - repeated bottleneck;
   - emerging capability;
   - ignored user group;
   - contradiction or tradeoff;
   - adjacent-domain mechanism;
   - regulatory or cost shift.
4. Generate ideas from gaps between signals:
   - high demand + low tooling;
   - new capability + old workflow;
   - mature patent area + weak consumer experience;
   - academic method + non-academic job;
   - expensive expert process + repeatable heuristic.
5. Cite sources in the final answer when external facts affected the recommendation.

## Library/API Due Diligence

Before recommending a dependency, verify:

- official docs or repository;
- latest release/activity date;
- license;
- authentication and rate limits;
- data terms and allowed uses;
- support for the user's language/runtime;
- production risks: quota, scraping fragility, stale data, missing fields, vendor lock-in.

If facts may have changed, browse current primary sources before naming a tool as available.
