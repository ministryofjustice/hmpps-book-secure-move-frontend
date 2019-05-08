
# App level components

This folder contains discrete pieces of self-contained UI. These components
can later be extracted out and submitted to the MOJ Design System or [GOV.UK
Design System](https://design-system.service.gov.uk/).

## Component structure

The structure of each component should follow a [the pattern](https://github.com/alphagov/govuk-frontend/tree/master/src#components) of components
with the MOJ and GOV.UK Design System so that they can be easily ported across
at a later stage if needed.

Each component should sit within a sub-folder and consist of:

- a Sass stylesheet
- a nunjucks template
- a nunjucks macro (which loads in the template file)
- a test file - testing the template output
- a yaml configuration file - explaining the possible options and some examples

## Loading components

### Sass

Components are loaded into the global [components loader file](./common/assets/scss/components/_all.scss) but can also be
loaded individually if needed. The `common/components` folder is added to the include
paths within Sass so the folder and sass file need to be specified.

### Nunjucks macros

The `common/components` folder is also added to the nunjucks include paths so that
components can be loaded in the shared layout as a macro.

Macros can be loaded in to the base layout like this:

```
{% from "pagination/macro.njk" import appPagination %}
```

And then used within a view like this:

```
{{ appPagination({
  paramOne: "Hello",
  paramTwo: "World"
}) }}
```
