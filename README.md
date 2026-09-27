# Colorful Semantics Studio

Local foundation for the year-long Colorful Semantics professional-learning and classroom-tool project.

## Current feature

The Student Language Analysis Lab gives a teacher three connected moves:

1. Read a learner response and identify the meaning that is present or missing.
2. Choose the smallest useful prompt for the learner's next move.
3. Reveal the reasoning, then open the example in a simplified Classroom Mode.

The prototype is intentionally dependency-free so the interaction can be tested quickly while the project direction is still developing. It is a static page composed of `index.html`, `styles.css`, and `app.js`.

## Run locally

From this folder, use any static file server. For example:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Next build seams

- Persist teacher practice history and notes.
- Move examples into structured data or a small content API.
- Add more response types and classroom-facing prompt variants.
- Add a project-level authentication and sharing layer when the hosted app source is connected.
