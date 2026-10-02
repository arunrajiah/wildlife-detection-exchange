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

## Implementations

- **Producer:** [wdx-agent](https://github.com/arunrajiah/wdx-agent) reads detections from BirdNET-Pi, BirdNET-Go, SpeciesNet camera trap output and BatDetect2 bat detector output, and sends them as WDX events.
- **Consumer:** [WildNetwork](https://wildnetwork.arunrajiah.com) ([source](https://github.com/arunrajiah/wildnetwork)) accepts WDX over HTTP as a single object, a JSON array or NDJSON, validates each event against the schema in this repository, and removes duplicates by `eventId`.
- **Planned:** emitting WDX from BirdEcho, wildecho-api and SpeciesNet Studio, and connectors into EarthRanger via Gundi.

## Part of an open wildlife toolkit

This project is one of seven open source tools by [Arun Rajiah](https://www.arunrajiah.com) for listening to, identifying and mapping wildlife. They are independent, and each is useful alone, but they are built to work together.

| Project | Role | What it does |
|---|---|---|
| **WDX** (this project) | The shared format | An open JSON format for one wildlife detection: what was detected, where, when, by which classifier and with what confidence. Maps field by field to Darwin Core. |
| [wdx-agent](https://github.com/arunrajiah/wdx-agent) | Share what your device detects | One dependency free Python file for a Raspberry Pi or any computer. Sends detections from BirdNET-Pi, BirdNET-Go, camera traps and bat detectors as WDX. |
| [WildNetwork](https://github.com/arunrajiah/wildnetwork) | See the whole picture | A live, open map of bird, bat and other animal movement, built from WDX events and public networks. [wildnetwork.arunrajiah.com](https://wildnetwork.arunrajiah.com) |
| [BirdEcho](https://github.com/arunrajiah/birdecho) | Follow your own station | Android companion app for BirdNET-Pi, BirdNET-Go and BirdWeather stations: today's detections, alerts for species you care about, history. |
| [WildEcho](https://github.com/arunrajiah/wildecho) | Identify a sound on your phone | Record a short clip and get ranked species candidates. |
| [wildecho-api](https://github.com/arunrajiah/wildecho-api) | The identification service | Self-hosted species identification from audio, using Google's open Perch 2.0 model. Runs on CPU, no API keys. Powers WildEcho. |
| [SpeciesNet Studio](https://github.com/arunrajiah/speciesnet-studio) | Review camera trap results | Self-hosted interface for checking and correcting SpeciesNet classifier predictions before they are used. |

**How this one fits.** WDX is the format the others speak. [wdx-agent](https://github.com/arunrajiah/wdx-agent) produces it and [WildNetwork](https://wildnetwork.arunrajiah.com) consumes it, validating every event against the schema in this repository.

**Connected today:** wdx-agent sends to WildNetwork in the WDX format, and WildEcho uses wildecho-api. **Planned:** WDX export from BirdEcho, wildecho-api and SpeciesNet Studio.

## License

Specification text and documentation: CC BY 4.0. JSON Schema and example files: MIT.

## Author

Arun Rajiah, Chennai, India. https://github.com/arunrajiah
