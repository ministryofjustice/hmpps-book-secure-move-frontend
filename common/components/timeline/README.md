# Timeline

Use the timeline component to show a linear record of what’s happened.

Derived from the equivalent component in the [MoJ Design System](https://moj-design-system.herokuapp.com/components/timeline)


## Example
Below is a typical example of the timeline component in use.

```
{{ appTimeline({
  items: [
    {
      label: {
        text: "Application requires confirmation"
      },
      html: confirmationHtml,
      datetime: {
        timestamp: "2019-06-14T14:01:00.000Z",
        type: "datetime"
      }
    },
    {
      label: {
        text:  "Application review in progress"
      },
      text: "Your application is being reviewed by one of our case workers.",
      datetime: {
        timestamp: "2019-06-07T12:32:00.000Z",
        type: "datetime"
      },
      byline: {
        text: "Caseworker 1"
      }
    },
    {
      label: {
        text:  "Application received"
      },
      text: "Your application has been received – reference MOJ-1234-5678",
      datetime: {
        timestamp: "2019-06-06T09:12:00.000Z",
        type: "datetime"
      },
      byline: {
        html: "Caseworker 2"
      }
    }
  ]
}) }}
```

## Arguments

This component accepts the following arguments.

### Container

Optional

|Name|Type|Required|Description|
|---|---|---|---|
|classes|string|No|Classes to add to the timeline's container.|
|attributes|object|No|HTML attributes (for example data attributes) to add to the timeline's container.|
|headingLevel|number|No|Heading level to use for labels. Defaults to 2.|

### Items

Required

`html`/`text` param provides description / main content for item.

|Name|Type|Required|Description|
|---|---|---|---|
|label|object|Yes|See [item label](#itemlabel).|
|text|string|Yes|If `html` is set, this is not required. Text to use as description within the item. If `html` is provided, the `text` argument will be ignored.|
|html|string|Yes|If `text` is set, this is not required. HTML to use as description within the item. If `html` is provided, the `text` argument will be ignored.|
|datetime|object|No|See [item date and time](#itemdatetime).|
|byline|object|No|See [item byline](#itembyline).|
|classes|string|No|Classes to add to the timeline's items container.|
|attributes|object|No|HTML attributes (for example data attributes) to add to the timeline's items container.|

#### Item label

Required

Adds label/heading for item.

|Name|Type|Required|Description|
|---|---|---|---|
|text|string|Yes|If `html` is set, this is not required. Text to use within the item label. If `html` is provided, the `text` argument will be ignored.|
|html|string|Yes|If `text` is set, this is not required. HTML to use within the item label. If `html` is provided, the `text` argument will be ignored.|
|classes|string|No|Classes to add to the item label.|


#### Item datetime

Required

Adds formatted timestamp.

|Name|Type|Required|Description|
|---|---|---|---|
|timestamp|string|Yes|A valid datetime string to be formatted. For example: `1970-01-01T11:59:59.000Z`|
|type|string|Yes|If `format` is set, this is not required. The standard date format to use within the item. If `type` is provided, the `format` argument will be ignored. Values include: `datetime`, `shortdatetime`, `date`, `shortdate` and `time`|
|format|string|Yes|If `type` is set, this is not required. The user-defined date format to use within the item. If `type` is provided, the `format` argument will be ignored. See the [Moment.js document on display formats](https://momentjs.com/docs/).|
|classes|string|No|Classes to add to the datetime.|


#### Item byline

Optional

Adds byline content.

Not used by `appTimelineItem`.

|Name|Type|Required|Description|
|---|---|---|---|
|text|string|Yes|If `html` is set, this is not required. Text to use within the byline content for the item. If `html` is provided, the `text` argument will be ignored.|
|html|string|Yes|If `text` is set, this is not required. HTML to use within the byline content for the item. If `html` is provided, the `text` argument will be ignored.|
