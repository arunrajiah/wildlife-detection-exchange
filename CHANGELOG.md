# Changelog

## 0.3 (draft, October 2026)

- `detection.observationMethod`: `machine` (default) or `human`. Human observations need no `confidence` or `classifier`, and producers must not invent them (SPEC section 5.1).
- `detection.individualCount`: number of individuals reported.
- `source.provider`: the contributing platform inside an aggregating source.
- `source.trusted`: the source's own verification flag, passed through.
- Scope widened to human observations shown beside machine detections.
- Backward compatible: every v0.1 and v0.2 event validates against the v0.3 schema.

## 0.2 (October 2026)

- `detection.pipeline` (ordered model steps), `media.region` (boxes, polygons, points), device status record.
- Every v0.1 event stays valid.

## 0.1 (2026)

- First published draft. DOI 10.5281/zenodo.22200865.
