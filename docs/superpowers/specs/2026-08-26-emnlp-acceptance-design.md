# EMNLP 2026 Acceptance Update

## Goal

Update the personal homepage to show that “Can Post-Training Turn LLMs into Good Medical Coders? An Empirical Study of Generative ICD Coding” was accepted to the Findings of EMNLP 2026, and announce the acceptance without emphasizing the Findings track.

## Publication Data

- Move the existing paper entry from `preprints` to `published` in `_data/publications.yml`.
- Keep the title, authors, year, PDF, code, and image unchanged.
- Set `conference_short` to `EMNLP`.
- Set `conference` to `Findings of the Conference on Empirical Methods in Natural Language Processing <strong>(EMNLP)</strong>, 2026.` to match the existing AMANDA entry.

## News

Insert the following item at the top of the News list in `index.md`, preserving reverse chronological order:

```text
- [08/2026] &nbsp;One paper is accepted to EMNLP!!<br>
```

The News text intentionally does not mention the Findings track or the paper's co-authors.

## Scope

Do not change the Research Interests summary, publication author list, paper links, image, theme, or layout.

## Validation and Publishing

- Parse `_data/publications.yml` and verify that the paper appears once under `published` and not under `preprints`.
- Build the Jekyll site and inspect the rendered homepage for the updated publication and News item.
- Review the final diff and run whitespace checks.
- Commit without any `Co-authored-by` trailer, fast-forward `main`, and push `main` to `origin`.
