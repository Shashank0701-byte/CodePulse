# Karpathy Guidelines (project-local copy)

Vendored from [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) so these guidelines are committed with CodePulse and apply regardless of whether the plugin is installed in a given environment.

## The Problems

From Andrej Karpathy's [observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding pitfalls:

> "The models make wrong assumptions on your behalf and just run along with them without checking. They don't manage their confusion, don't seek clarifications, don't surface inconsistencies, don't present tradeoffs, don't push back when they should."

> "They really like to overcomplicate code and APIs, bloat abstractions, don't clean up dead code... implement a bloated construction over 1000 lines when 100 would do."

> "They still sometimes change/remove comments and code they don't sufficiently understand as side effects, even if orthogonal to the task."

## The Four Principles

| Principle | Addresses |
|-----------|-----------|
| **Think Before Coding** | Wrong assumptions, hidden confusion, missing tradeoffs |
| **Simplicity First** | Overcomplication, bloated abstractions |
| **Surgical Changes** | Orthogonal edits, touching code you shouldn't |
| **Goal-Driven Execution** | Leverage through tests-first, verifiable success criteria |

Full text lives in [`SKILL.md`](SKILL.md); worked examples of each principle (wrong vs. right) are in [`EXAMPLES.md`](EXAMPLES.md).

## Keeping this in sync

This is a vendored copy, not a symlink. If the upstream repo revises the four principles, re-sync `SKILL.md` and `EXAMPLES.md` from https://github.com/forrestchang/andrej-karpathy-skills manually.

## License

MIT (upstream project, forrestchang/andrej-karpathy-skills)
