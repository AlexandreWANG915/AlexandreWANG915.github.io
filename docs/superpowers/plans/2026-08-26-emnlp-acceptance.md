# EMNLP 2026 Acceptance Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the LLM4ICD paper as an EMNLP 2026 Findings acceptance and add a concise EMNLP acceptance announcement to the homepage.

**Architecture:** Publication metadata is stored in `_data/publications.yml` and rendered into separate Published and Preprints sections by `_includes/publications.md`. Homepage News is maintained directly in `index.md`, so the implementation moves one existing YAML record and inserts one Markdown/HTML list item without changing templates.

**Tech Stack:** Jekyll, YAML, Markdown, Liquid, Ruby/Bundler, GitHub Pages

---

### Task 1: Move LLM4ICD into Published

**Files:**
- Modify: `_data/publications.yml:1-158`

- [x] **Step 1: Verify the desired publication state is initially absent**

Run:

```bash
ruby -e 'require "yaml"; d=YAML.load_file("_data/publications.yml"); t="Can Post-Training Turn LLMs into Good Medical Coders? An Empirical Study of Generative ICD Coding"; pub=d.fetch("published").select { |p| p["title"] == t }; pre=d.fetch("preprints").select { |p| p["title"] == t }; abort "expected one published EMNLP entry and no preprint" unless pub.length == 1 && pre.empty? && pub.first["conference_short"] == "EMNLP" && pub.first["conference"].include?("Findings of the Conference on Empirical Methods in Natural Language Processing")'
```

Expected: exits nonzero with `expected one published EMNLP entry and no preprint`.

- [x] **Step 2: Move and update the publication record**

Remove the complete target record from `preprints` and insert it at the top of `published` with this exact content:

```yaml
  - title: "Can Post-Training Turn LLMs into Good Medical Coders? An Empirical Study of Generative ICD Coding"
    authors: <strong>Ziqing Wang</strong>, Weihao Li, Shijie Chen, Yuan Luo, Kaize Ding
    conference_short: EMNLP
    conference: Findings of the Conference on Empirical Methods in Natural Language Processing <strong>(EMNLP)</strong>, 2026.
    year: 2026
    pdf: https://arxiv.org/pdf/2606.13940.pdf
    code: https://github.com/AlexandreWANG915/LLM4ICD
    image: ./assets/img/LLM4ICD.png
```

- [x] **Step 3: Verify the updated YAML state**

Run the Ruby command from Step 1 again.

Expected: exits successfully with no output. A separate count check should print `[18, 6]`:

```bash
ruby -e 'require "yaml"; d=YAML.load_file("_data/publications.yml"); p [d.fetch("published").length, d.fetch("preprints").length]'
```

### Task 2: Add the EMNLP News Item

**Files:**
- Modify: `index.md:22-25`

- [x] **Step 1: Verify the desired News item is initially absent**

Run:

```bash
rg -nF -- '- [08/2026] &nbsp;One paper is accepted to EMNLP!!<br>' index.md
```

Expected: exits with status 1 and no output.

- [x] **Step 2: Insert the News item**

Add the following line immediately after the opening News `<div>` and before the July 2026 item:

```markdown
- [08/2026] &nbsp;One paper is accepted to EMNLP!!<br>
```

- [x] **Step 3: Verify wording and ordering**

Run:

```bash
sed -n '22,27p' index.md
```

Expected: the August 2026 EMNLP item appears once above the July 2026 item, and the News text does not contain `Findings`.

### Task 3: Build, Review, Commit, and Publish

**Files:**
- Verify: `_data/publications.yml`
- Verify: `index.md`
- Verify: `_site/index.html`

- [x] **Step 1: Build the Jekyll site**

Run:

```bash
bundle exec jekyll build
```

Expected: exits successfully and generates `_site/index.html` without YAML or Liquid errors.

- [x] **Step 2: Inspect the rendered homepage**

Run:

```bash
rg -n 'Can Post-Training|One paper is accepted to EMNLP|Findings of the Conference' _site/index.html
```

Expected: the rendered page contains the paper under Published with an EMNLP badge and Findings venue text, plus the News item without Findings wording.

- [x] **Step 3: Review the final diff**

Run:

```bash
git diff --check
git diff -- _data/publications.yml index.md
git status --short --branch
```

Expected: no whitespace errors; only the approved content changes and the implementation-plan file are uncommitted.

- [ ] **Step 4: Commit without a co-author trailer**

Run:

```bash
git add -- _data/publications.yml index.md docs/superpowers/plans/2026-08-26-emnlp-acceptance.md
git commit -m "Update LLM4ICD acceptance to EMNLP 2026 Findings"
git show -s --format=full HEAD
```

Expected: the commit contains a single subject and no `Co-authored-by` trailer.

- [ ] **Step 5: Fast-forward and push `main`**

Run:

```bash
git fetch origin
git switch main
git merge --ff-only codex/emnlp-acceptance
git push origin main
```

Expected: `main` fast-forwards and the push updates `origin/main` successfully.
