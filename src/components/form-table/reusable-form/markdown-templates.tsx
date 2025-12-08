// markdownTemplates.ts
import dayjs from "dayjs";

const today = dayjs().format("YYYY-MM-DD");

export const markdownTemplates = [
  {
    label: "Meeting Notes",
    value: `# Meeting Notes

**Date:** ${today}

## Attendees
- Person 1
- Person 2

## Agenda
1. Topic one
2. Topic two

## Notes
- Point A
- Point B

## Action Items
- [ ] Task 1
- [ ] Task 2
`,
  },
  {
    label: "Documentation",
    value: `# Documentation Title

## Overview
Provide a brief description.

## Installation
\`\`\`bash
npm install your-package
\`\`\`

## Usage
\`\`\`ts
import { something } from "your-package";
\`\`\`

## License
MIT
`,
  },
  {
    label: "Project Proposal",
    value: `# Project Proposal

**Date:** ${today}

## Summary
A brief summary of the project.

## Goals
- Goal 1
- Goal 2

## Timeline
1. Milestone 1
2. Milestone 2

## References
![Placeholder](https://picsum.photos/600/200?random=1)
`,
  },
  {
    label: "Blog Post",
    value: `# Blog Post Title

![Header Image](https://picsum.photos/800/300?random=2)

## Introduction
Write your engaging introduction here.

## Main Content
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

## Conclusion
Summarize the main points.
`,
  },
  {
    label: "Product Review",
    value: `# Product Review

**Date:** ${today}

## Product
Amazing Gadget 3000

![Product Image](https://picsum.photos/400/300?random=3)

## Pros
- Easy to use
- Affordable

## Cons
- Limited battery life

## Rating
⭐⭐⭐⭐☆
`,
  },
  {
    label: "Recipe",
    value: `# Delicious Recipe

![Dish Image](https://picsum.photos/500/300?random=4)

## Ingredients
- 1 cup flour
- 2 eggs
- 1/2 cup milk

## Instructions
1. Mix ingredients
2. Bake for 20 minutes
3. Serve warm
`,
  },
  {
    label: "Portfolio Project",
    value: `# Portfolio Project

## Project Name
Awesome App

![Screenshot](https://picsum.photos/600/400?random=5)

## Description
A short description of what this project does.

## Tech Stack
- React
- Node.js
- PostgreSQL
`,
  },
  {
    label: "Case Study",
    value: `# Case Study

**Date:** ${today}

## Client
Company XYZ

## Problem
They needed a modern web platform.

## Solution
We delivered a scalable cloud solution.

![Architecture](https://picsum.photos/700/400?random=6)

## Results
- 50% faster load times
- 30% cost reduction
`,
  },
  {
    label: "Travel Journal",
    value: `# Travel Journal

**Destination:** Paris

![Eiffel Tower](https://picsum.photos/800/500?random=7)

## Day 1
Visited the Eiffel Tower.

## Day 2
Walked through the Louvre.
`,
  },
  {
    label: "Tutorial",
    value: `# Tutorial: How to Build an App

![Cover Image](https://picsum.photos/600/250?random=8)

## Step 1
Set up your environment.

## Step 2
Write your first component.

## Step 3
Run the app.
`,
  },
];
