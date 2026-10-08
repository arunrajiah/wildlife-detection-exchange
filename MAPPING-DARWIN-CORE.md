# WDX to Darwin Core mapping

This document maps every WDX field with a Darwin Core (DwC) equivalent to its term, so that a WDX stream can be exported as a standard Darwin Core occurrence dataset and published to GBIF. Terms are from the Darwin Core standard maintained by TDWG (https://dwc.tdwg.org/terms/).

## Fixed values on export

| DwC term | Value | Note |
|---|---|---|
| `dwc:basisOfRecord` | `MachineObservation` | Every WDX event is a machine observation by definition. |
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
| `detection.taxonRank` | `dwc:taxonRank` | |
| `detection.taxonId` | `dwc:taxonID` | Keep the prefix (`gbif:`, `ebird:`, `inat:`). |
| `detection.classifier` | `dwc:identifiedBy` | Formatted `Name version`, e.g. `BirdNET 2.4`. Software as identifier is established practice for MachineObservation records. |
| `detection.classifiedAt` | `dwc:dateIdentified` | |
| `detection.confidence` | `dwc:identificationRemarks` | Formatted `machine classification confidence: 0.91`. DwC has no dedicated confidence term; the value also remains machine-readable in the source WDX. A Measurement or Fact extension row is an alternative for consumers that want it numeric. |
| `review.status` | `dwc:identificationVerificationStatus` | `unreviewed`, `confirmed`, `rejected`, `uncertain` map verbatim; `rejected` events SHOULD be excluded from GBIF occurrence export. |
| `review.reviewedBy` | appended to `dwc:identifiedBy` | Human confirmation supersedes: `BirdNET 2.4 | confirmed by A. Rajiah`. |
| `media.url` | `dwc:associatedMedia` | Audiovisual Core is the richer path for consumers that support it. |
| `detection.pipeline` (v0.2) | appended to `dwc:identificationRemarks` | Formatted `pipeline: MegaDetector 5a (detector) > SpeciesNet 4.0.1a (classifier)`. `dwc:identifiedBy` keeps the final `classifier`. |
| `media.region` (v0.2) | Audiovisual Core `ac:hasROI` / region of interest terms | DwC occurrence records have no region term; keep it in the source WDX or `dwc:dynamicProperties` when exporting plain occurrences. |
| `source.system` + `systemVersion` | `dwc:institutionCode` is NOT used; put in `dwc:dynamicProperties` | Producing software is provenance, not an institution. `dynamicProperties` example: `{"wdxSource":"birdnet-pi 0.13"}`. |
| `license` | `dcterms:license` | |

## Export to GBIF

A WDX stream becomes a GBIF-publishable dataset by: (1) filtering out `review.status=rejected` events, (2) applying the mapping above into a Darwin Core Archive occurrence core (or publishing through an IPT), (3) declaring the dataset license (CC0, CC BY or CC BY-NC, per GBIF policy). Nothing in WDX requires new DwC terms; the format is designed so this export is a pure projection.

## Relationship to Camtrap DP

For camera trap deployments, a WDX stream aggregates into Camtrap DP as follows: `deployment` fields populate the `deployments` table, `media` entries the `media` table, and each event an `observations` row with `observationType=animal` and `classificationMethod=machine`. WDX adds nothing Camtrap DP cannot hold; it is the per-event wire format upstream of Camtrap DP's per-study package. Acoustic deployments have no Camtrap DP equivalent, which is the gap WDX primarily serves.
