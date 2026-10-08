# Wildlife Detection Exchange (WDX)

*An open interchange format for AI wildlife detections from community-run sensors.*

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22200864.svg)](https://doi.org/10.5281/zenodo.22200864)

**Status: v0.2 draft** (adds optional model pipeline, image regions and a device health record; every v0.1 event stays valid). v0.1 is published: cite all versions via DOI 10.5281/zenodo.22200864; the v0.1 release is 10.5281/zenodo.22200865.

> Part of an open wildlife toolkit. Not sure this is the project you need? See [which project to use](#part-of-an-open-wildlife-toolkit).

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

## Implementations

- **Producer:** [wdx-agent](https://github.com/arunrajiah/wdx-agent) reads detections from BirdNET-Pi, BirdNET-Go, SpeciesNet camera trap output and BatDetect2 bat detector output, and sends them as WDX events.
- **Consumer:** [WildNetwork](https://wildnetwork.arunrajiah.com) ([source](https://github.com/arunrajiah/wildnetwork)) accepts WDX over HTTP as a single object, a JSON array or NDJSON, validates each event against the schema in this repository, and removes duplicates by `eventId`.
- **Planned:** emitting WDX from BirdEcho, wildecho-api and SpeciesNet Studio, and connectors into EarthRanger via Gundi.

## Part of an open wildlife toolkit

Eight open source projects for listening to, identifying and mapping wildlife. They work together, but you rarely need more than one or two. Start from what you want to do:

| I want to | Use | What it is |
|---|---|---|
| See where birds and wildlife are moving, or download the data | [WildNetwork](https://github.com/arunrajiah/wildnetwork) | The live map and open data: [wildnetwork.arunrajiah.com](https://wildnetwork.arunrajiah.com) |
| Build a monitoring station from open hardware | [WildNetwork Base](https://github.com/arunrajiah/wildnetwork-base) | Software and a ready-to-flash SD card image (beta) for the open WildNetwork station (Raspberry Pi, microphone, solar) |
| Share detections from a BirdNET-Pi, BirdNET-Go, camera trap or bat detector you already have | [wdx-agent](https://github.com/arunrajiah/wdx-agent) | One small program that sends your station's detections. BirdWeather stations are already included and need nothing |
| Follow your own station on your phone | [BirdEcho](https://github.com/arunrajiah/birdecho) | Android app for BirdNET-Pi, BirdNET-Go and BirdWeather stations |
| Identify a sound you just heard | [WildEcho](https://github.com/arunrajiah/wildecho) | Phone app: record a clip, get ranked species |
| Run your own sound identification server | [wildecho-api](https://github.com/arunrajiah/wildecho-api) | Self-hosted species identification from audio, on CPU, no API keys |
| Check camera trap predictions before you use them | [SpeciesNet Studio](https://github.com/arunrajiah/speciesnet-studio) | Self-hosted review of SpeciesNet results |
| Make your own software or device produce or read detections in a common format | [WDX](https://github.com/arunrajiah/wildlife-detection-exchange) (this project) | The open format for one AI wildlife detection; maps to Darwin Core |

**How this one fits.** WDX is the shared language: the WildNetwork Base and wdx-agent produce it, and WildNetwork reads it. It belongs to no single tool, so any other platform can use it too.

**How they connect:** stations (a WildNetwork Base, BirdNET-Pi, BirdNET-Go, camera traps) produce detections; wdx-agent sends them in the WDX format; WildNetwork maps them. Connected today: wdx-agent and the WildNetwork Base send to WildNetwork, and WildEcho uses wildecho-api. Planned: Base setup in BirdEcho, and WDX export from wildecho-api and SpeciesNet Studio.

## License

Specification text and documentation: CC BY 4.0. JSON Schema and example files: MIT.

## Author

Arun Rajiah, Chennai, India. https://github.com/arunrajiah
