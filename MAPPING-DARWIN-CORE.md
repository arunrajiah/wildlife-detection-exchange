# WDX to Darwin Core mapping

This document maps every WDX field with a Darwin Core (DwC) equivalent to its term, so that a WDX stream can be exported as a standard Darwin Core occurrence dataset and published to GBIF. Terms are from the Darwin Core standard maintained by TDWG (https://dwc.tdwg.org/terms/).

## Fixed values on export

| DwC term | Value | Note |
|---|---|---|
| `dwc:basisOfRecord` | `MachineObservation`, or `HumanObservation` when `detection.observationMethod` is `human` (v0.3) | Events without `observationMethod` are machine detections. |
| `dwc:occurrenceStatus` | `present` | WDX carries detections, not absences. |

## Field mapping

| WDX field | DwC term | Note |
|---|---|---|
| `eventId` | `dwc:occurrenceID` | Stable, globally unique in both. |
| `eventStart` / `eventEnd` | `dwc:eventDate` | Single instant or ISO 8601 interval (`start/end`). |
| `deployment.deploymentId` | `dwc:eventID` | Groups occurrences from one placement. |
| `deployment.name` | `dwc:locality` | Only when the operator chose to publish it. |
| `deployment.latitude` | `dwc:decimalLatitude` | WGS84 in both; also set `dwc:geodeticDatum=EPSG:4326`. |
| `deployment.longitude` | `dwc:decimalLongitude` | |
| `deployment.coordinateUncertaintyMeters` | `dwc:coordinateUncertaintyInMeters` | |
| `deployment.sensorType` + `sensorModel` | `dwc:samplingProtocol` | e.g. `acoustic-recorder: Raspberry Pi 4 + Clippy EM272`. |
| `detection.scientificName` | `dwc:scientificName` | As emitted by the classifier's taxonomy; consumers may re-match to the GBIF backbone. |
| `detection.vernacularName` | `dwc:vernacularName` | |
| `detection.taxonRank` | `dwc:taxonRank` | Verbatim, including `order` (v0.3) and `unranked`. |
| `detection.taxonId` | `dwc:taxonID` | Keep the prefix (`gbif:`, `ebird:`, `inat:`). |
| `detection.classifier` | `dwc:identifiedBy` | Formatted `Name version`, e.g. `BirdNET 2.4`. Software as identifier is established practice for MachineObservation records. Human observations (v0.3) usually have no `classifier`: leave `dwc:identifiedBy` empty unless `review.reviewedBy` names someone; never fill it with a made-up model. |
| `detection.classifiedAt` | `dwc:dateIdentified` | |
| `detection.confidence` | `dwc:identificationRemarks` | Formatted `machine classification confidence: 0.91`. Since v0.3 it can be missing (human observations, or a relaying system that hides the score): then write nothing, never 0 or 1. DwC has no dedicated confidence term; the value also remains machine-readable in the source WDX. A Measurement or Fact extension row is an alternative for consumers that want it numeric. |
| `review.status` | `dwc:identificationVerificationStatus` | `unreviewed`, `confirmed`, `rejected`, `uncertain` map verbatim; `rejected` events SHOULD be excluded from GBIF occurrence export. |
| `review.reviewedBy` | appended to `dwc:identifiedBy` | Human confirmation supersedes: `BirdNET 2.4 | confirmed by A. Rajiah`. |
| `media.url` | `dwc:associatedMedia` | Audiovisual Core is the richer path for consumers that support it. |
| `detection.pipeline` (v0.2) | appended to `dwc:identificationRemarks` | Formatted `pipeline: MegaDetector 5a (detector) > SpeciesNet 4.0.1a (classifier)`. `dwc:identifiedBy` keeps the final `classifier`. |
| `media.region` (v0.2) | Audiovisual Core `ac:hasROI` / region of interest terms | DwC occurrence records have no region term; keep it in the source WDX or `dwc:dynamicProperties` when exporting plain occurrences. |
| `source.system` + `systemVersion` | `dwc:dynamicProperties`, not `dwc:institutionCode` | Producing software is provenance, not an institution (use `source.institutionCode` for that, v0.3). `dynamicProperties` example: `{"wdxSource":"birdnet-pi 0.13"}`. |
| `detection.observationMethod` (v0.3) | `dwc:basisOfRecord` | `machine` (or missing) gives `MachineObservation`, `human` gives `HumanObservation`. |
| `detection.individualCount` (v0.3) | `dwc:individualCount` | As reported by the source. |
| `source.occurrenceId` (v0.3) | `dwc:occurrenceID` (instead of `eventId`) | The event is already a published occurrence. Keep its original id, and do not publish it to GBIF again: it is there already (OBIS and GBIF share many records). |
| `source.institutionCode` (v0.3) | `dwc:institutionCode` | Together with `occurrenceID` it identifies the original record. |
| `source.provider` / `providerUrl` (v0.3) | `dwc:dynamicProperties` | e.g. `{"wdxProvider":"Conserve.io","wdxProviderUrl":"https://..."}`. DwC has no term for a platform inside an aggregator; credit it in the dataset's EML as well. |
| `source.trusted` (v0.3) | `dwc:dynamicProperties` | e.g. `{"wdxSourceTrusted":true}`. Not mapped to `dwc:identificationVerificationStatus`: each source means something different by it, and `review.status` keeps that term. |
| `license` | `dcterms:license` | |
| `dataset.datasetId` / `title` (v0.4) | `dwc:datasetID` / `dwc:datasetName` | |
| `dataset.rightsHolder` (v0.4) | `dcterms:rightsHolder` | |
| `dataset.recordedBy` (v0.4) | `dwc:recordedBy` (and `dwc:recordedByID` for ORCID iDs) | Joined with ` | `. |
| `dataset.citation` / `doi` (v0.4) | `dcterms:bibliographicCitation` | Also the dataset's EML citation when publishing through an IPT. |
| `group.groupId` (v0.5, proposed) | `dwc:eventID`, with the deployment as `dwc:parentEventID` | `eventID` = `<deploymentId>/<groupId>` so it stays unique across deployments. Events without a group keep `deploymentId` as `dwc:eventID`. |
| `group.type` (v0.5, proposed) | `dwc:eventType` | `sequence`, `visit`, `track`, `bout` verbatim. |

## Export to GBIF

A WDX stream becomes a GBIF-publishable dataset by: (1) filtering out `review.status=rejected` events, events that carry `source.occurrenceId` (already published, see above) and events without `scientificName` (v0.3 allows a vernacular name only, with `taxonRank` `unranked`; GBIF needs a scientific name), (2) applying the mapping above into a Darwin Core Archive occurrence core (or publishing through an IPT), (3) declaring the dataset license (CC0, CC BY or CC BY-NC, per GBIF policy). Nothing in WDX requires new DwC terms; the format is designed so this export is a pure projection.

## Relationship to Camtrap DP

For camera trap deployments, a WDX stream aggregates into Camtrap DP as follows: `deployment` fields populate the `deployments` table, `media` entries the `media` table, and each event an `observations` row with `observationType=animal` and `classificationMethod=machine`. Since v0.5 (proposed), `group.groupId` fills `observations.eventID`, and the group's extent (section 3.1 of the spec) fills `eventStart` and `eventEnd`; each WDX event stays a media-level observation, and a consumer MAY add one event-level observation per group and taxon. WDX adds nothing Camtrap DP cannot hold; it is the per-event wire format upstream of Camtrap DP's per-study package. Acoustic deployments have no Camtrap DP equivalent, which is the gap WDX primarily serves.
