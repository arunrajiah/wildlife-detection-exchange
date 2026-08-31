# Publishing WDX v0.1 with a DOI: your steps

Everything in this folder is ready. Two routes; the GitHub route is better because it gives the repo a DOI badge and mints a new DOI per release automatically.

## Route A: GitHub + Zenodo integration (recommended, ~15 minutes)

1. Create a new public repo **wildlife-detection-exchange** under your GitHub account and push this folder's contents as the initial commit. Add two license files: LICENSE (MIT, for schema/ and examples/) and LICENSE-DOCS (CC BY 4.0, for the markdown documents), or a single LICENSE.md explaining the split as stated in README.md.
2. Log in at https://zenodo.org with your GitHub account (use arunrajiah@gmail.com as the contact email).
3. Go to https://zenodo.org/account/settings/github/ and flip the toggle ON for arunrajiah/wildlife-detection-exchange.
4. Back in GitHub, create a release tagged **v0.1.0** titled "WDX v0.1 draft". The release description can be the README's first two sections.
5. Zenodo picks up the release within minutes and mints a DOI. Find it under Uploads on your Zenodo account.
6. On the Zenodo record page, check the metadata it inferred (it reads CITATION.cff): title, author, license, keywords. Fix anything odd and save.
7. Copy the **Cite all versions** concept DOI. Add its badge to the repo README.

## Route B: direct Zenodo upload (no repo needed)

1. Zip this folder. At https://zenodo.org/uploads/new, upload the zip.
2. Type: Dataset (or "Other"). Title, author, abstract and keywords: copy from CITATION.cff. License: CC BY 4.0.
3. Publish. The DOI is minted immediately and cannot be deleted, so review before clicking.

## After the DOI exists

- Put the DOI in the NLnet proposal's first paragraph: the ask changes from "fund me to write a spec" to "the spec exists at doi:10.5281/zenodo.XXXXXXX, fund the implementation".
- Add the DOI to funding.json (a projects entry for wildlife-detection-exchange) and to your GitHub profile README.
- Post it to the WILDLABS forum and the BirdNET-Pi and BirdNET-Go communities asking for comments on v0.1. Comment threads from real operators are themselves evidence of community process, which NLnet and GBIF both weigh.

## Naming

WDX and "Wildlife Detection Exchange" are provisional. If you want a different name, rename before step 1; after the DOI exists the name is effectively frozen into the citation record.
