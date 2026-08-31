# Wildlife Detection Exchange (WDX) Specification, v0.1

Status: draft proposal. This version is published to anchor discussion and reference implementations; breaking changes are expected before v1.0.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted as described in RFC 2119.

## 1. Scope

WDX defines the structure of a **detection event**: a single machine-generated assertion that a taxon was detected by a sensor at a place and time, by an identified classifier, at a stated confidence. It also defines a batch convention for transporting many events.

WDX covers acoustic detections (e.g. BirdNET, Perch), image detections (e.g. SpeciesNet, MegaDetector plus a species classifier) and is open to other machine modalities. It does not cover human field observations, which are already served by existing Darwin Core practice.

## 2. Encoding and transport

A detection event is a JSON object encoded in UTF-8, conforming to `schema/detection-event.schema.json`.

**Single event:** media type `application/json`.

**Batch:** newline-delimited JSON (NDJSON), one event per line, media type `application/x-ndjson`. A batch MUST NOT wrap events in an enclosing array. File extension SHOULD be `.wdx.ndjson`.

Producers MUST include the `wdx` version field in every event. Consumers MUST ignore unknown fields.

## 3. Top-level structure

| Field | Type | Req | Description |
|---|---|---|---|
| `wdx` | string | MUST | Spec version this event conforms to. `"0.1"` for this document. |
| `eventId` | string | MUST | Globally unique, stable identifier for this detection event. UUIDv4 RECOMMENDED. Re-emitting the same detection MUST reuse the same `eventId`. |
| `eventStart` | string | MUST | Start of the detection window, ISO 8601 with numeric UTC offset (e.g. `2026-08-25T06:14:03+05:30`). Local offset SHOULD be preserved rather than normalised to Z. |
| `eventEnd` | string | MAY | End of the detection window, same format. Omit for instantaneous events. |
| `deployment` | object | MUST | Where and what the sensor is. See section 4. |
| `detection` | object | MUST | What was detected and by which model. See section 5. |
| `media` | object | MAY | The evidence clip or frame. See section 6. |
| `review` | object | MAY | Human verification state. See section 7. |
| `source` | object | MUST | Producing system and its local record id. See section 8. |
| `license` | string | MAY | SPDX identifier or URL for the data license of this event, e.g. `CC0-1.0`. If omitted, the license is whatever the stream's publisher declares out of band. |

## 4. `deployment`

| Field | Type | Req | Description |
|---|---|---|---|
| `deploymentId` | string | MUST | Stable identifier for this sensor at this placement. A re-sited sensor SHOULD get a new `deploymentId`. |
| `name` | string | MAY | Human label, e.g. `"Backyard station, Chitlapakkam"`. Producers SHOULD let operators redact this. |
| `latitude` | number | MUST | Decimal degrees, WGS84. |
| `longitude` | number | MUST | Decimal degrees, WGS84. |
| `coordinateUncertaintyMeters` | number | MAY | Uncertainty radius in meters. Operators wishing to obscure a home location SHOULD publish a generalised coordinate with an honest uncertainty (e.g. 5000) rather than a false precise one. |
| `sensorType` | string | MUST | One of `acoustic-recorder`, `camera-trap`, `other`. |
| `sensorModel` | string | MAY | Free text, e.g. `"Raspberry Pi 4 + Clippy EM272 mic"`. |

## 5. `detection`

| Field | Type | Req | Description |
|---|---|---|---|
| `scientificName` | string | SHOULD | Binomial (or higher-rank name) as output by the classifier's taxonomy, e.g. `"Orthotomus sutorius"`. MAY be omitted only when the classifier emits no taxon (e.g. MegaDetector's `animal` class), in which case `taxonRank` MUST be `"unranked"` and `vernacularName` SHOULD carry the class label. |
| `vernacularName` | string | MAY | Common name as output, e.g. `"Common Tailorbird"`. |
| `taxonRank` | string | MAY | `species`, `genus`, `family`, `class`, `unranked`. Default `species`. |
| `taxonId` | string | MAY | Identifier in a named checklist, prefixed: `gbif:2493091`, `ebird:comtai1`, `inat:13858`. |
| `confidence` | number | MUST | Classifier score in [0,1] as emitted by the model. Producers MUST NOT rescale. |
| `classifier` | object | MUST | `{ "name": string, "version": string }`, e.g. `{ "name": "BirdNET", "version": "2.4" }`. The pair MUST identify the model well enough that a consumer can reproduce or discount the identification. |
| `classifiedAt` | string | MAY | When inference ran, ISO 8601 with offset, if different from `eventStart`. |

## 6. `media`

| Field | Type | Req | Description |
|---|---|---|---|
| `mediaType` | string | MUST | `audio`, `image`, `video`. |
| `url` | string | MAY | Resolvable URL of the evidence file, if the operator publishes media. |
| `fileName` | string | MAY | Local filename when no URL exists. At least one of `url`, `fileName` MUST be present. |
| `startOffsetSeconds` | number | MAY | Offset of the detection within the file. |
| `durationSeconds` | number | MAY | Length of the detection window in the file. |
| `sha256` | string | MAY | Hash of the file, for integrity across moves. |

## 7. `review`

| Field | Type | Req | Description |
|---|---|---|---|
| `status` | string | MUST | `unreviewed`, `confirmed`, `rejected`, `uncertain`. |
| `reviewedBy` | string | MAY | Name or pseudonym of the reviewer. |
| `reviewedAt` | string | MAY | ISO 8601 with offset. |

Events with no `review` object are `unreviewed`. A `rejected` event SHOULD still be retained and transported; rejection is information.

## 8. `source`

| Field | Type | Req | Description |
|---|---|---|---|
| `system` | string | MUST | Producing software, lowercase, e.g. `birdnet-pi`, `birdnet-go`, `birdweather`, `wildecho-api`, `speciesnet-studio`, `other`. |
| `systemVersion` | string | MAY | Version of the producing software. |
| `sourceRecordId` | string | MAY | The event's primary key in the producing system, for round-tripping. |

## 9. Identity and deduplication

`eventId` is the identity. Consumers MUST treat two events with the same `eventId` as the same event, keeping the one with the later `review.reviewedAt` (or the later-received one when neither is reviewed). This makes review-state updates a re-emit, not a new protocol verb.

## 10. Privacy

Home-based operators are the majority of the intended producers. Implementations MUST make coordinate generalisation (section 4) available at the point of publishing, and SHOULD default `deployment.name` to omitted when publishing beyond the operator's own systems.

## 11. Versioning

The `wdx` field carries the spec version. Within 0.x, breaking changes MAY occur at each minor version. From 1.0, breaking changes require a major version. Consumers SHOULD accept any 0.x event on a best-effort basis.
