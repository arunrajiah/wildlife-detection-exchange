# Changelog

## Upgrading from v0.1

Nothing breaks. Every v0.1 event is valid under the v0.4 schema unchanged, and consumers SHOULD accept any 0.x event.

To use the newer fields, set `"wdx"` to the version that introduced the newest field you send (for example `"0.4"` when you send `dataset`), then add what you need:

- **Camera traps and other image pipelines (v0.2):** list every model step in `detection.pipeline` (keep `classifier` as the step that gave the label) and give the animal's position in `media.region`.
- **Device health (v0.2):** send battery, storage and backlog as a separate `device-status` record (`schema/device-status.schema.json`). It is never a detection.
- **Human sightings and relayed data (v0.3):** set `detection.observationMethod` to `"human"` and leave out `confidence` and `classifier` rather than inventing them. When relaying from a system that hides the model score, leave out `confidence`. Use `source.occurrenceId` with `source.institutionCode` so receivers can merge the same occurrence from two aggregators.
- **Credit (v0.4):** add a `dataset` block (`datasetId` at least) so the dataset's title, rights holder, people and citation travel with every event.

Consumers that only read v0.1 fields keep working: no v0.1 field was removed, renamed or given a new meaning. The one relaxation is that `confidence` (any event, v0.3) and `classifier` (human observations only, v0.3) may be missing, so code that reads them must handle their absence.

## 0.5 (proposed, not released)

- `group`: ties events from the same camera-trap sequence, visit, track or bout together (`groupId`, optional `type`), scoped to one deployment of one producing system, with counting, ordering and review rules (SPEC section 3.1). Issue 1, asked for from baited underwater video and drone work.
- Darwin Core: a grouped event maps to `dwc:eventID` `<deploymentId>/<groupId>` with the deployment as `dwc:parentEventID`; Camtrap DP takes the group as `observations.eventID`.
- `examples/camera-trap-sequence.json`: one burst with two chital images and a dhole, as three events in one sequence.
- Backward compatible: every v0.1 to v0.4 event validates against the v0.5 schema.

## 0.4 (26 November 2026)

- DOI 10.5281/zenodo.24548567.
- `dataset`: the dataset an event belongs to (`datasetId`, `title`, `rightsHolder`, `recordedBy`, `citation`, `doi`, `url`), so credit travels with every event (SPEC section 8.1). Asked for by researchers uploading past field seasons to Wildlife Network.
- Backward compatible: every v0.1, v0.2 and v0.3 event validates against the v0.4 schema.
- Schema `$id`s point at the v0.4.0 tag, the detection event schema's title names v0.4, and `examples/dataset-upload.json` shows a v0.4 event. `npm test` validates every example. MAPPING-DARWIN-CORE.md now covers the v0.3 fields (`HumanObservation`, `individualCount`, `occurrenceID`, `institutionCode`, provider and trust flags).

## 0.3 (draft, October 2026)

- `detection.observationMethod`: `machine` (default) or `human`. Human observations need no `confidence` or `classifier`, and producers must not invent them (SPEC section 5.1).
- `detection.individualCount`: number of individuals reported.
- `source.provider`: the contributing platform inside an aggregating source.
- `source.trusted`: the source's own verification flag, passed through.
- `source.providerUrl`, `source.occurrenceId`, `source.institutionCode`: credit links and cross-aggregator deduplication (OBIS and GBIF publish many of the same occurrences).
- `taxonRank` adds `order` (e.g. a hydrophone detection identified only as Cetacea).
- `confidence` is omitted, not invented, when a relaying system does not expose the model score (e.g. OrcaHello detections relayed by Orcasound).
- Scope widened to human observations shown beside machine detections.
- Backward compatible: every v0.1 and v0.2 event validates against the v0.3 schema.

## 0.2 (October 2026)

- `detection.pipeline`: ordered model steps that produced a detection (`role`, `name`, `version`, optional `weights`), for example a detector followed by a classifier. `classifier` stays required and names the step that gave the label (SPEC section 5).
- `media.region`: where the animal is in the image or video frame, as a `box`, `polygon` or `point`, normalized or in pixels, with an optional video `frame` (SPEC section 6.1). One region per event.
- Device status record: a separate record type (`kind: "device-status"`, `schema/device-status.schema.json`) for battery, storage, temperature, uptime, network, backlog and software versions. Never shown as an observation (SPEC section 10a).
- Backward compatible: every v0.1 event validates against the v0.2 schema.

## 0.1 (August 2026)

- First published draft: detection event, batch convention, Darwin Core mapping. DOI 10.5281/zenodo.22200865.
