#!/usr/bin/env bash

VERSION=$(sentry-cli releases propose-version)

# Create and finalise a release
sentry-cli releases new -p book-a-secure-move-frontend "$VERSION"

# Associate commits with the release
sentry-cli releases set-commits --auto "$VERSION"

# Finalise release
sentry-cli releases finalize "$VERSION"

# Deploy release
sentry-cli releases deploys "$VERSION" new -e "$SENTRY_ENVIRONMENT"
