# Mock API proxy server

## Overview

An express app that mocks/proxies the API.

Requests can be intercepted, transformed or passed through untouched.

## Server phases

- [construct request object](#Construct-request-object)
- [interceptors](#Interceptors) (can send response)
- [request](#Request) (skipped if [req.response](#req.response) set)
- [transformations](#Transformations) (can send response)
- [response](#Response) (if no response already sent)

## Construct request object

Sets initial values of [req.request](#req.request) to enable the [request phase](#Request) to make the necessary request using `axios`.

## Interceptors

Interceptors are created as [subapps](#Subapps) in `mocks/interceptors`.

An interceptor can

- send a response immediately
- set [req.response](#req.response) (causes [the request phase](#Request) to be skipped)
- set [req.request](#req.request) (alters request options to be used for [the request](#Request))

## Request

If [req.response](#req.response) has not been set, then the request will be made with `axios` using the options set in [req.request](#req.request).

The axios response (whether successful or an error) is set to [req.response](#req.response).

## Transformations

Transformations are created as [subapps](#Subapps) in `mocks/transformation`.

A transformation can

- send a response immediately
- set [req.response](#req.response)

## Response

If no subapp has sent the response already, this phase sends the response using [req.response](#req.response)

## Subapps

Subapps are standard express middleware loaded in the same manner as the regular app's subapps are using `common/lib/mount.js`

eg.

```js
const router = require('express').Router()

router.use('/foo', (req, res, next) => {
  ...
  // see examples below
})

module.exports = {
  router,
  [mountpath],
  [skip]
}
```

Any subapp can choose to

- allow the request to pass through unchanged
  ```js
  ...
  next()
  ```
- send a response and end the request
  ```js
  ...
  res.json({
    foo: 'bar'
  })
  ```
- set [req.response](#req.response)
  ```js
  ...
  req.response = {
    data: foo: 'bar',
    status: 422
  }
  next()
  ```

[Interceptors](#Interceptors) can also

- set [req.request](#req.request)
  ```js
  ...
  req.request.data = {
    foo: 'bar'
  }
  next()
  ```

## req.request

Used by the [request phase](#Request) as options to pass to `axios`.

It has the following shape:

```
{
  method,
  baseURL
  url,
  [headers],
  [params],
  [data]
}
```

These values can be adjusted during the interceptors phase and leave the actual `req` object untouched.

Initial values set by [construct request object phase](#Construct-request-object):

- `method`

  the original request method (`req.method`)

- `baseURL`

  the url for the real API server (`MOCKS_API_BASE_URL`)

- `url`

  the original url without any query params (`req.path`)

- `headers`

  Original request headers without the original host info (`req.headers`)

- `params`

  Original query string params if any (`req.query`)

- `data`

  Original request body if any (`req.body`)

  method,
  baseURL,
  url,
  headers,
  params,
  data,

## req.response

If a subapp does not want/need to send the response, it can set the `req.response` property which the [response phase](#Response) uses to send the response. (Its presence also causes the [request phase](#Request) to be skipped)

That value should be an object with the following shape.

```
{
  data,
  [headers],
  [status]
}
```

NB. only the `data` property is required.

- `req.response.data`
  Used as the response’s content
- `req.response.headers`
  Used as the response’s headers if set
- `req.response.status`
  Used as response’s status code. Defaults to `200` if not set.

## Environment Variables

| Name               | Description                                                                                    | Default |
| :----------------- | :--------------------------------------------------------------------------------------------- | :------ |
| PROXY_API_ENABLED  | Whether to run a API proxy server on startup                                                   | false   |
| PROXY_API_PORT     | Port to run API proxy server on                                                                | 3998    |
| PROXY_API_BASE_URL | Base url to pass requests through to if not intercepted (required if MOCKS_API_ENABLED is set) |         |
