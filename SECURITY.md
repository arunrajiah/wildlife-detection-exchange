# Security Policy

WDX is a data format, so most security issues are about data safety rather than code.

## Reporting a vulnerability

**Please do not open a public issue for a security problem.**

Report it privately through GitHub's **Report a vulnerability** button under this repository's Security tab, or email arunrajiah@gmail.com with "WDX security" in the subject.

Please include what is affected, steps to reproduce, the possible impact, and any suggested fix.

## What to expect

- We will acknowledge your report within 3 working days.
- We aim to confirm the issue and share a plan within 10 working days.
- We will credit you in the advisory and changelog unless you ask us not to.
- We ask you to give us up to 90 days to release a fix before you disclose publicly.

## Areas we especially care about

- fields or defaults that could expose precise locations of sensitive or threatened species
- schema or example files that would let unsafe or misleading records validate
- problems in the validation tooling or its dependencies
