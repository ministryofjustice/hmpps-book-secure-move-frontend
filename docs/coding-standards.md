# Coding Standards & Code Linting

## Conventions to follow

### Style, spelling and grammar

In general, follow the standards set out in the [GOV.UK styleguide](https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style).

### Code indentation and whitespace

2-space, soft-tabs only. No trailing whitespace.

### CSS

See our [coding standards for CSS](/docs/contributing/coding-standards/css.md) and [testing](/docs/contributing/testing.md).

### JavaScript

Javascript is written using [StandardJS](https://standardjs.com/).

### Components and Nunjucks API

See our [coding standards for components](/docs/contributing/coding-standards/components.md), [coding standards for Nunjucks macros](/docs/contributing/coding-standards/nunjucks-api.md) and [testing](/docs/contributing/testing.md).

## Linting

### JavaScript

[ESLint](https://eslint.org/) is used to lint JavaScript code and keep a consistent standard in the way it is written within this project.

The config uses the [StandardJS](https://standardjs.com/) style as a base with [some custom tweaks](./.eslintrc.js).

[Prettier](https://prettier.io) is also used to extend eslint to add some extra rules around how files are formatted. It can be [integrated to many popular editors](https://prettier.io/docs/en/editors.html) to help with formatting on save.

To check linting results run:

```bash
npm run lint
```

[EditorConfig](https://editorconfig.org/) is also used help IDEs apply consistent formatting. There is no equivalent `npm` task for this, as these issues would normally be picked up by the existing linting tasks.

## Commit messages

[Commitlint](https://commitlint.js.org/) is used to lint commit messages to ensure they conform to [conventional convention](https://commitlint.js.org/#/concepts-commit-conventions).

This requires commit messages of the format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

This convention is required to automate the generation of changelogs and release notes on GitHub during the [release process](#releases-and-deployment).

This also means that smaller atomic commits are preferred wherever possible to one large commit with a lot of changes.
