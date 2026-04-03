# Technology & Engineering — Human Capabilities

## System Design Thinking

> Designing systems that are elegant, maintainable, and resilient — balancing competing constraints that AI can't weigh.

- **Function**: technology
- **Also relevant to**: operations, finance
- **Why appreciating**: AI can write code, and it's getting better fast. What it can't do is make the architectural decisions that determine whether the code is maintainable in two years: which abstraction to choose, when to take on tech debt intentionally, how to design for the failure modes you can't predict. Research on 12 million job postings shows that as companies adopt more AI, they don't just need fewer coders — they need more people who can think about systems. As AI handles more implementation, the engineer who designs the system becomes exponentially more valuable than the one who writes the code.
- **How to develop**: Read the architecture docs of systems you admire (AWS Well-Architected, Google's SRE book, Stripe's API design). For your next project, write the design doc before writing any code — force yourself to articulate the tradeoffs. Study distributed systems failure modes (Byzantine faults, split brain, cascading failures). Review your past architectural decisions: which aged well, which didn't, and why?
- **Automation resistance**: judgment-under-ambiguity, creative-taste
- **Task categories**: technical-specialized, analysis-decision
- **Appreciation score**: 10
- **Verified**: 2026-04-03
- **Confidence**: high

## Debugging Intuition & Root Cause Analysis

> The ability to look at a symptom and intuit where the real problem lives — the pattern recognition that comes from years of seeing things break.

- **Function**: technology
- **Also relevant to**: operations, customer-service
- **Why appreciating**: AI can follow debugging playbooks and search stack traces. It struggles with the bugs that don't match patterns: the intermittent failure that only happens under load on Tuesdays, the race condition that the test suite can't reproduce, the performance degradation that stems from an interaction between three systems nobody mapped. The engineer with deep debugging intuition operates on a level that AI augments but can't replace.
- **How to develop**: Keep a bug journal: for every interesting bug, write the symptom, your hypotheses, and the actual root cause. Review quarterly for patterns in your own diagnostic blind spots. Practice the "binary search" debugging method on unfamiliar codebases — it forces systematic thinking. Read "Debugging" by David Agans for a framework. Pair with the best debugger on your team and observe their process.
- **Automation resistance**: institutional-knowledge, judgment-under-ambiguity, embodied-knowledge
- **Task categories**: technical-specialized, analysis-decision
- **Appreciation score**: 9
- **Verified**: 2026-04-03
- **Confidence**: high

## Codebase Stewardship & Technical Judgment

> Making the daily judgment calls that keep a codebase healthy: when to refactor, what to leave alone, which shortcut creates acceptable debt and which creates a landmine.

- **Function**: technology
- **Also relevant to**: operations, people-management
- **Why appreciating**: AI can generate code that passes tests. It has no opinion about whether that code makes the codebase better or worse over time. The engineer who reviews AI-generated code and says "this works but it introduces a pattern we'll regret" is doing the judgment work that determines long-term velocity. As AI generates more code faster, the human who curates, reviews, and stewards the codebase becomes the bottleneck — in the best sense.
- **How to develop**: Do one code archaeology session per month: read code that was written two years ago. What's aged well? What's a mess? What decisions led to each? Practice writing code review comments that explain the "why" behind your feedback, not just the "what." Build a personal style guide of patterns you've seen succeed and fail. Read "A Philosophy of Software Design" by John Ousterhout.
- **Automation resistance**: judgment-under-ambiguity, institutional-knowledge, creative-taste
- **Task categories**: technical-specialized, analysis-decision
- **Appreciation score**: 9
- **Verified**: 2026-04-03
- **Confidence**: high

## Cross-Team Technical Communication

> Explaining technical concepts, constraints, and tradeoffs to non-technical stakeholders in a way that enables better business decisions.

- **Function**: technology
- **Also relevant to**: operations, communications
- **Why appreciating**: As AI handles more implementation, the engineer's role shifts toward technical advising: helping product managers understand what's feasible, helping executives understand technical risk, helping sales engineers explain the product honestly. The engineer who can translate technical complexity into business language — without oversimplifying — is the bridge every organization needs.
- **How to develop**: Practice the "explain it to a smart 12-year-old" test for every technical concept. When presenting to non-technical stakeholders, lead with the business impact, then explain the mechanism. Build analogies that make complex systems intuitive. Write one technical blog post per quarter that a non-engineer could understand and find useful.
- **Automation resistance**: cultural-context, relationship-trust
- **Task categories**: communication, interpersonal
- **Appreciation score**: 8
- **Verified**: 2026-04-03
- **Confidence**: high

## Security Mindset & Adversarial Thinking

> Thinking like an attacker: identifying how a system can be abused, manipulated, or broken in ways the designer didn't intend.

- **Function**: technology
- **Also relevant to**: legal, operations
- **Why appreciating**: AI can scan for known vulnerabilities. It struggles with novel attack vectors, social engineering scenarios, and the creative misuse of legitimate features. As AI generates more code and more systems, the attack surface expands — and the human who thinks adversarially about every new feature, integration, and data flow becomes essential to organizational survival.
- **How to develop**: For every feature you build or review, spend 10 minutes asking: "How would I abuse this?" Join a CTF team or work through exercises on platforms like HackTheBox. Read post-mortems of major security breaches (the Cloudflare, Okta, and LastPass breach reports are excellent). Build a threat modeling habit: before launching any new feature that touches user data or external systems, map the attack surface.
- **Automation resistance**: judgment-under-ambiguity, creative-taste
- **Task categories**: technical-specialized, analysis-decision
- **Appreciation score**: 9
- **Verified**: 2026-04-03
- **Confidence**: high
