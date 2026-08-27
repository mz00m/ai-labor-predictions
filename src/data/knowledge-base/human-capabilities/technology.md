# Technology & Engineering — Human Capabilities

## System Design Thinking

> Designing systems that are elegant, maintainable, and resilient — balancing competing constraints that AI can't weigh.

- **Function**: technology
- **Also relevant to**: operations, finance
- **Why appreciating**: AI writes most of the code on many teams now, and writes it well. What it still can't do is make the architectural decisions that determine whether the code is maintainable in two years: which abstraction to choose, when to take on tech debt intentionally, how to design for failure modes you can't predict. Benchmarks built from real enterprise repositories bear this out — frontier agents resolve only around 40% of SWE-Bench Pro's long-horizon tasks, and the Breakpoint work finds system-level reasoning, not local code reasoning, is what separates agents from human baselines. The labour-market signal points the same direction: CSIRO's 2026 study of AI-adopting firms found they posted 36% more non-AI job ads than non-adopters and listed more skills per ad, and Mäkelä and Stephany find AI's complementary pull on human skills runs up to 1.7x its substitution effect. Meanwhile Stanford's Digital Economy Lab shows employment for software developers aged 22-25 down roughly 20% from its late-2022 peak, with the decline still deepening through April 2026. The implementation rung is thinning; the design rung is not.
- **How to develop**: Read the architecture docs of systems you admire (AWS Well-Architected, Google's SRE book, Stripe's API design). For your next project, write the design doc before writing any code — force yourself to articulate the tradeoffs. Study distributed systems failure modes (Byzantine faults, split brain, cascading failures). Review your past architectural decisions: which aged well, which didn't, and why?
- **Automation resistance**: judgment-under-ambiguity, creative-taste
- **Task categories**: technical-specialized, analysis-decision
- **Appreciation score**: 10
- **Verified**: 2026-08-27
- **Confidence**: high

## Debugging Intuition & Root Cause Analysis

> The ability to look at a symptom and intuit where the real problem lives — the pattern recognition that comes from years of seeing things break.

- **Function**: technology
- **Also relevant to**: operations, customer-service
- **Why appreciating**: Be honest about the shift: agents now close a large share of well-specified, reproducible bugs, and that part of the job is going away. What remains is the hard tail — the intermittent failure that only happens under load on Tuesdays, the race condition the test suite can't reproduce, the degradation caused by an interaction between three systems nobody mapped. That tail is exactly where the evidence says agents are weakest: SWE-Bench Pro's enterprise-derived tasks sit near 40% resolve rates, and the Breakpoint benchmark shows failure concentrates in system-level reasoning across unfamiliar code rather than in local logic. METR's 2026 update is the useful caution in both directions — measured productivity effects from late-2025 agents were small and imprecise (roughly -20% to +4% depending on cohort, with wide intervals), far below the 1.6x-4x developers self-report. The capability appreciates because the easy cases evaporate and the residual is all judgment.
- **How to develop**: Keep a bug journal: for every interesting bug, write the symptom, your hypotheses, and the actual root cause. Review quarterly for patterns in your own diagnostic blind spots. Practice the "binary search" debugging method on unfamiliar codebases — it forces systematic thinking. When you hand a bug to an agent, write the hypothesis yourself first, then compare; if you skip that step you stop building the intuition. Read "Debugging" by David Agans for a framework. Pair with the best debugger on your team and observe their process.
- **Automation resistance**: institutional-knowledge, judgment-under-ambiguity, embodied-knowledge
- **Task categories**: technical-specialized, analysis-decision
- **Appreciation score**: 9
- **Verified**: 2026-08-27
- **Confidence**: high

## Codebase Stewardship & Technical Judgment

> Making the daily judgment calls that keep a codebase healthy: when to refactor, what to leave alone, which shortcut creates acceptable debt and which creates a landmine.

- **Function**: technology
- **Also relevant to**: operations, people-management
- **Why appreciating**: This is where the last year produced the clearest evidence. Google's 2025 DORA report, covering ~5,000 practitioners at 90% AI adoption, found AI adoption positively associated with software delivery throughput and negatively associated with delivery stability: generation accelerated faster than review, testing, and deployment could absorb, and the bottleneck moved downstream. AI reviewers now take the mechanical pass — developer use of AI-assisted code review roughly doubled year over year — but they carry a 5-10% false-positive rate and degrade on large changesets, and they have no opinion on whether a change is the right thing to build. The engineer who reads AI-generated code and says "this works but it introduces a pattern we'll regret" is doing the judgment work that determines long-term velocity. Stewardship is the constraint on whether AI-driven throughput turns into shipped value or into instability.
- **How to develop**: Do one code archaeology session per month: read code that was written two years ago. What's aged well? What's a mess? What decisions led to each? Set an explicit standard for what you will merge from an agent — reviewing a 900-line generated diff at the same depth as a 90-line human one is not realistic, so make the size limit a rule rather than a hope. Practice writing code review comments that explain the "why" behind your feedback, not just the "what." Build a personal style guide of patterns you've seen succeed and fail. Read "A Philosophy of Software Design" by John Ousterhout.
- **Automation resistance**: judgment-under-ambiguity, institutional-knowledge, creative-taste
- **Task categories**: technical-specialized, analysis-decision
- **Appreciation score**: 9
- **Verified**: 2026-08-27
- **Confidence**: high

## Cross-Team Technical Communication

> Explaining technical concepts, constraints, and tradeoffs to non-technical stakeholders in a way that enables better business decisions.

- **Function**: technology
- **Also relevant to**: operations, communications
- **Why appreciating**: As AI handles more implementation, the engineer's role shifts toward technical advising: helping product managers understand what's feasible, helping executives understand technical risk, helping sales engineers explain the product honestly. Lightcast's 2025 posting analysis found eight of the ten most-demanded skills in AI-enabled roles are human capabilities rather than technical ones, and DORA's 2025 findings put change management and organizational context at the centre of whether AI investment pays off. There is a countercurrent worth naming: one 2025 study of GenAI-adopting firms found demand for social skills within those specific roles fell about 4.5% post-ChatGPT, so the shift is not uniform across job families. The engineer who can translate technical complexity into business language — without oversimplifying — is still the bridge every organization needs.
- **How to develop**: Practice the "explain it to a smart 12-year-old" test for every technical concept. When presenting to non-technical stakeholders, lead with the business impact, then explain the mechanism. Build analogies that make complex systems intuitive. Write one technical blog post per quarter that a non-engineer could understand and find useful.
- **Automation resistance**: cultural-context, relationship-trust
- **Task categories**: communication, interpersonal
- **Appreciation score**: 8
- **Verified**: 2026-08-27
- **Confidence**: medium

## Security Mindset & Adversarial Thinking

> Thinking like an attacker: identifying how a system can be abused, manipulated, or broken in ways the designer didn't intend.

- **Function**: technology
- **Also relevant to**: legal, operations
- **Why appreciating**: The most important number in this file. Veracode's 2026 GenAI Code Security Report, tracking more than 100 models across four snapshots, found the average security pass rate stalled at 56% — statistically unchanged from the prior year — meaning roughly 44% of code-generation tasks still ship a detectable OWASP Top 10 flaw. Syntax pass rates are near 100%: models got much better at writing code that works and no better at writing code that is safe. Failure is worst where it matters, with 86% of samples failing cross-site scripting defence and 88% vulnerable to log injection; the strongest reasoning models reach only 70-72%. Volume compounds it — the Cloud Security Alliance has documented a surge in AI-generated-code CVEs. AI can scan for known vulnerabilities but still misses novel attack vectors, social engineering, and creative misuse of legitimate features. Two years of capability gains with zero security gains, multiplied by far more generated code, is why this appreciates rather than holds steady.
- **How to develop**: For every feature you build or review, spend 10 minutes asking: "How would I abuse this?" Treat AI-generated code as untrusted input by default: assume roughly two in five generated functions carry a known flaw class, and check injection, authz, and output encoding explicitly rather than trusting that it compiles and passes tests. Join a CTF team or work through exercises on platforms like HackTheBox. Read post-mortems of major security breaches (the Cloudflare, Okta, and LastPass reports remain good teaching cases). Build a threat modeling habit: before launching any new feature that touches user data or external systems, map the attack surface.
- **Automation resistance**: judgment-under-ambiguity, creative-taste
- **Task categories**: technical-specialized, analysis-decision
- **Appreciation score**: 10
- **Verified**: 2026-08-27
- **Confidence**: high
