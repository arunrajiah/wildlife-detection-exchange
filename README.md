# Wildlife Detection Exchange (WDX)

*An open interchange format for AI wildlife detections from community-run sensors.*

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22200864.svg)](https://doi.org/10.5281/zenodo.22200864)

**Status: v0.1 draft, published.** Cite all versions via DOI 10.5281/zenodo.22200864; this release is 10.5281/zenodo.22200865.

## The problem

Tens of thousands of continuous wildlife sensors are already deployed by hobbyists, farmers, campuses, small reserves and individual researchers: BirdNET-Pi and BirdNET-Go stations, BirdWeather PUCs, camera traps run through AI classifiers such as SpeciesNet and MegaDetector, and self-hosted bioacoustic pipelines built on models like Google's Perch. Every one of them produces species-level detection events, continuously.

Almost none of that becomes usable ecological evidence. Detections sit in local SQLite files and closed platforms, in incompatible formats, with no shared vocabulary for the things that matter: what was detected, where, when, by which model, at what confidence, and whether a human ever checked it.

The consequences are concrete. EarthRanger's Gundi integration catalog, the closest thing conservation technology has to a common bus, has no bioacoustic source and no AI camera trap source at all. GBIF's standards cover museum specimens, human observations and, since Camtrap DP, institutional camera trap studies, but there is no lightweight event format for the stream of machine detections that community sensors emit.

## What WDX is

WDX is a small JSON format for a single machine detection event, plus an NDJSON convention for batches. It is designed to be:

- **Emittable by a Raspberry Pi.** One JSON object per detection. No packaging, no manifest, no database export required to say "a Common Tailorbird was heard here at 06:14 with confidence 0.91".
- **Mapped to Darwin Core from day one.** Every WDX field that has a Darwin Core equivalent maps to it explicitly (see MAPPING-DARWIN-CORE.md), so any WDX stream can be batch-exported as a standard Darwin Core occurrence dataset and published to GBIF with `basisOfRecord=MachineObservation`.
- **Model-agnostic and modality-agnostic.** The same envelope carries a BirdNET acoustic detection, a Perch embedding classification and a SpeciesNet camera trap identification.
- **Honest about uncertainty.** Classifier identity, version and confidence are first-class fields, and human review status is carried separately from the machine identification, so downstream consumers can filter on either.

## What WDX is not

- **Not a replacement for Camtrap DP.** Camtrap DP is the TDWG-managed standard for packaging complete camera trap studies (deployments, media, observations) and is the right format for institutional archiving and GBIF publication of such studies. WDX is the event-level wire format upstream of it; a WDX stream from a camera trap can be aggregated into a Camtrap DP package.
- **Not a media archive format.** WDX references media by URL or filename and hash; it does not carry audio or images.
- **Not a claim of authority.** This is a v0.1 proposal by a maintainer of several of the tools involved, published to have something concrete to align on. Field names and structures are expected to change with community input.

## Files

| File | What it is |
|---|---|
| SPEC.md | The v0.1 specification |
| schema/detection-event.schema.json | JSON Schema (draft 2020-12) for a single detection event |
| MAPPING-DARWIN-CORE.md | Field-by-field mapping to Darwin Core, plus export notes for GBIF and Camtrap DP |
| examples/ | Real-shaped example events from BirdNET-Pi, a Perch pipeline (wildecho-api) and SpeciesNet Studio |
| CITATION.cff | Citation metadata |

## Reference implementations (planned)

The author maintains BirdEcho (companion app for BirdNET-Pi, BirdNET-Go and BirdWeather), wildecho-api (self-hosted Perch inference) and SpeciesNet Studio (camera trap review UI). Emitting and consuming WDX in those tools, plus connectors into EarthRanger via Gundi, is the implementation programme this spec exists to anchor.

## License

Specification text and documentation: CC BY 4.0. JSON Schema and example files: MIT.

## Author

Arun Rajiah, Chennai, India. https://github.com/arunrajiah
