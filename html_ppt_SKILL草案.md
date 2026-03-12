---
name: html-roadshow-ppt
description: Create or refine a single-file HTML roadshow PPT from a user-provided outline or speech draft. Use when the user wants a 16:9 centered slide deck, premium presentation aesthetics, complete source-content coverage, card-based but non-template layout, and realistic animation/demo components such as AI chat streaming, search/scan/match visualizations, desktop-operation simulations, or business-scenario demos.
---

# HTML Roadshow PPT

Use this skill when the user wants a high-end single-file HTML PPT built from an outline, speech script, roadshow notes, or presentation brief, especially when the user cares about:

- strict `16:9` slide framing
- centered PPT-like rendering rather than ordinary webpage layout
- complete coverage of the source material without omission
- premium roadshow aesthetics
- presentation logic rather than document-style dumping
- animated or quasi-video demo components that make abstract workflows feel real

## Core Objective

Turn the user's presentation content into a single-file HTML deck that feels like a live premium roadshow, not a webpage with cards.

The deck should not merely "contain the content". It should translate viewpoints, stories, examples, and business workflows into an intentional visual experience with clear speaking rhythm.

## Non-Negotiables

- Output must be a single-file HTML.
- Slides must render in strict `16:9`.
- The slide area must stay visually centered.
- All non-section slides should have a clean top title area.
- Page numbers belong in the bottom-right corner inside the slide frame.
- Source content must be preserved completely; do not silently drop points.
- Layout must serve speaking rhythm, not just information density.

## Default Visual Direction

- Premium, restrained, professional, roadshow-grade
- Unified palette and motion language across the entire deck
- Rich but controlled use of cards, glow, gradients, borders, particles, and animated accents
- Avoid generic dashboard, admin panel, or bland template aesthetics

## Layout Doctrine

### 1. Every slide needs a role

Before designing a slide, identify what it is doing in the talk:

- thesis / key message
- story progression
- process demonstration
- comparison / judgment
- method / toolkit
- risk / governance
- strategy / roadmap
- closing / call to action

Do not use one generic card template for all slide types.

### 2. Every slide needs hierarchy

Most slides should read as:

- main stage
- supporting explanation
- closing takeaway

Avoid equal-weight grids where everything competes for attention.

### 3. "Full" does not mean "crammed"

The user wants the frame to feel full, but not by:

- mechanically stretching cards
- shrinking line-height
- stuffing more text
- adding meaningless decoration

Correct ways to increase fullness:

- enlarge important type
- strengthen internal card structure
- add useful visual subcomponents
- convert abstract explanation into demonstrative components
- use the lower half of the slide intentionally

### 4. Card-based design has a purpose

Cards exist to increase structure and carrying capacity, not to slice content mechanically.

Inside a card, prefer layered composition:

- title
- indicator / state / mini widget
- body copy
- trace / evidence / conclusion if needed

Text should not all stick to the top edge. Internal alignment matters.

## Animation Doctrine

Animation is not decoration. It must help the audience understand what is happening.

Prioritize action-oriented components over explanatory text.

Good examples:

- AI prompt input, thinking, and streaming answer
- search, scan, match, hit, trace-back
- desktop cursor and multi-app operation
- step-by-step pipeline lighting up
- charts growing from zero
- roadmap nodes appearing in sequence

Avoid pseudo-data visuals. If bars, signals, or lengths look quantitative, they must mean something. If they are decorative, make that visually obvious.

## Preferred Demo Components

When a slide still has empty-but-valuable space, first consider replacing that space with code-driven demonstrative widgets such as:

- search lens / scan line / radar sweep
- source hit chips
- traceability cards
- live answer assembly
- file/source matching
- risk scan widgets
- decision pre-analysis widgets
- flowing task chains

Do not default to adding more explanatory text.

## What the User Explicitly Likes

- slides that feel full and substantial
- strong visual center of gravity
- layouts that match speech rhythm
- premium exhibition-like presentation quality
- realistic animated demos
- pages that look like a system is actually working
- dynamic components that make the idea more concrete

## What the User Explicitly Dislikes

- small type
- weak or undersized cards
- large meaningless blank areas
- content floating in the upper half of the frame
- simply making cards taller while content still sticks to the top
- text piled into cards without structure
- misalignment between text blocks, labels, and indicators
- using more text as filler
- pages that feel like documentation instead of a presentation
- decorative bars that appear meaningful but are not

## Recommended Workflow

### 1. Read and map the source

- Extract every point from the source material.
- Preserve completeness.
- Group points by speaking rhythm, not just by topic.

### 2. Decide the slide plan

- Split the deck according to the user's speaking goals.
- Keep the emotional arc coherent:
  - hook
  - capability understanding
  - persuasive examples
  - methods/tools
  - risk boundaries
  - organizational value
  - closing call to action

### 3. Assign a layout role to each slide

For each slide, decide whether it is primarily:

- hero statement
- story-evidence
- demo canvas
- process stage
- comparison decision
- matrix atlas
- strategy board
- governance board

### 4. Build the page around the main stage

- Put the most important visual module in control of the slide.
- Make supporting cards visually subordinate.
- Ensure the body fills the frame naturally.

### 5. Replace weak blank areas with meaningful components

When a slide feels empty, do not first add prose.

Try:

- a working demo panel
- scan/search animations
- evidence or source widgets
- mini charts or hit states
- traceability lanes
- workflow progress displays

### 6. Verify alignment and density

Check:

- vertical balance
- internal card spacing
- text alignment
- same-group card height consistency
- whether the slide still feels top-heavy

## Slide-Level Quality Bar

Each slide should pass these questions:

- Is the main message immediately obvious?
- Is the main visual clearly dominant?
- Does the bottom half of the slide have a purpose?
- Are there any large blank areas that say nothing?
- Is the content arranged for speaking, not for reading a document?
- If animation exists, does it explain an action?

## Implementation Guidance

- Prefer building robust reusable CSS/JS components inside the HTML file.
- Keep a consistent animation grammar across the deck.
- Reset demos cleanly when re-entering a slide.
- Treat repeated interaction motifs as reusable modules:
  - AI chat window
  - search/scan panel
  - desktop operation panel
  - comparison cards
  - roadmap / timeline
  - traceability tiles

## Common Failure Modes

- deck becomes a webpage instead of a PPT
- all slides use the same card arrangement
- cards are taller but still visually empty
- content floats near the top
- excessive explanatory text fills space
- widgets are decorative but pretend to encode data
- too many equal-weight cards remove visual focus
- late-stage edits break style consistency

## Verification Checklist

### Structure

- single-file HTML
- strict `16:9`
- centered slide frame
- proper title area
- proper page-number placement

### Content

- no source-content omission
- slide splitting fits speaking rhythm
- each slide has a clear role

### Visual

- premium and unified
- full without feeling cramped
- clear focal point
- no obvious top-floating content

### Components

- enough action-oriented demo widgets
- blank areas converted into meaningful visual behavior where appropriate
- internal card hierarchy is clear
- alignment issues resolved

## If Detailed Local Guidance Exists

If working in this project or a similar one, consult these local references first:

- [html_ppt_设计要求汇总.md](/Users/xpan/Desktop/ai%20分享/html_ppt_设计要求汇总.md)
- [html_ppt_全量需求与复用指南.md](/Users/xpan/Desktop/ai%20分享/html_ppt_全量需求与复用指南.md)

Use those documents as project-specific refinements. This SKILL draft should remain the lean reusable core.
