# Releases and deployment

Releases and changelogs are automatically generated using [standard-version](https://www.npmjs.com/package/standard-version). To generate a new release run:

```bash
npm run release
```

This will:

- update contributors in `package.json`
- increase the version in `package.json` based on commits since last tag
- create a new changelog entry
- create a version commit
- create a new git tag
- push commit and tags to remote

**Note:** This will require your github user to be in a team with write access to the repo. Contact a maintainer if you require this permission.

It will also start a new deployment specific [job on CircleCI](https://app.circleci.com/github/ministryofjustice/hmpps-book-secure-move-frontend/pipelines) which will run the full suite of automated tests and create a [release on GitHub](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/releases).

**Note:** The deployment job has a [manual approval](https://circleci.com/blog/supporting-digital-transformation-while-avoiding-common-stalls/) step before it will release that version to production.
