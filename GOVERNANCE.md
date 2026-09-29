# Governance

Wildlife Detection Exchange (WDX) is the open exchange format for machine wildlife detections, mapped to Darwin Core. It is open source under the licences in the repository (CC BY 4.0 for the specification text, MIT for the schema and examples). This document explains how decisions are made and how that will change as the project grows.

## Roles

- **Maintainer:** Arun Rajiah (@arunrajiah) leads the project. The maintainer reviews and merges pull requests, cuts releases, handles security reports and sets the roadmap.
- **Contributors:** anyone who opens an issue, reviews changes, improves documentation or submits a pull request.
- **Committers:** contributors who have made sustained, high-quality contributions can be invited to get merge rights for one or more areas.

## How decisions are made

- Day-to-day changes are decided in pull requests. A change needs one approving review from a maintainer or committer, plus passing CI where CI exists.
- Larger changes, such as a new or changed field, a change to the Darwin Core mapping, or any change that would make existing valid records invalid, start as a GitHub issue labelled `proposal`. It stays open for at least 7 days so users can comment before work is merged.
- The maintainer makes the final call when consensus is not reached, and records the reasoning in the issue.

## Community review

WDX aims to become community guidance rather than a single-author document. Changes to fields or the Darwin Core mapping are discussed in public issues, and the project has been proposed as a TDWG Task Group so that review can move into the TDWG process.

## Security decisions

Security issues follow [SECURITY.md](SECURITY.md). Security fixes may be merged without the 7-day comment period.

## Releases

Specification versions follow semantic versioning. Each version is tagged on GitHub, archived on Zenodo with a DOI, and listed in the changelog with every change to fields or the mapping.

## Becoming a committer

A contributor can be nominated by the maintainer or by an existing committer after several merged contributions and constructive reviews. Committers who are inactive for 12 months may move to emeritus status, which can be reversed on request.

## Changing this document

Changes to this document follow the proposal process above.
