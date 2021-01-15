{{/* vim: set filetype=mustache: */}}
{{/*
Environment variables for web and worker containers
*/}}
{{- define "deployment.envs" }}
env:
  - name: API_CLIENT_ID_KEY
    valueFrom:
      secretKeyRef:
        name: {{ .Release.Namespace }}
        key: api_client_id_key

  - name: API_SECRET_KEY
    valueFrom:
      secretKeyRef:
        name: {{ .Release.Namespace }}
        key: api_secret_key

  - name: AUTH_PROVIDER_KEY_KEY
    valueFrom:
      secretKeyRef:
        name: {{ .Release.Namespace }}
        key: auth_provider_key_key

  - name: AUTH_PROVIDER_SECRET_KEY
    valueFrom:
      secretKeyRef:
        name: {{ .Release.Namespace }}
        key: auth_provider_secret_key

  - name: SENTRY_DSN
    valueFrom:
      secretKeyRef:
        name: {{ .Release.Namespace }}
        key: sentry_dsn

  - name: SESSION_SECRET_KEY
    valueFrom:
      secretKeyRef:
        name: {{ .Release.Namespace }}
        key: session_secret_key

  - name: REDIS_AUTH_TOKEN
    valueFrom:
      secretKeyRef:
        name: elasticache-hmpps-book-secure-move-frontend-staging
        key: auth_token
  - name: REDIS_HOST
    valueFrom:
      secretKeyRef:
        name: elasticache-hmpps-book-secure-move-frontend-staging
        key: primary_endpoint_address

  - name: API_AUTH_PATH
    value: {{ .Values.env.API_AUTH_PATH | quote }}

  - name: API_BASE_URL
    value: {{ .Values.env.API_BASE_URL | quote }}

  - name: API_HEALTHCHECK_PATH
    value: {{ .Values.env.API_HEALTHCHECK_PATH | quote }}

  - name: API_PATH
    value: {{ .Values.env.API_PATH | quote }}

  - name: API_VERSION
    value: {{ .Values.env.API_VERSION | quote }}

  - name: API_TIMEOUT
    value: {{ .Values.env.API_TIMEOUT | quote }}

  - name: AUTH_PROVIDER_URL
    value: {{ .Values.env.AUTH_PROVIDER_URL | quote }}

  - name: FEEDBACK_URL
    value: {{ .Values.env.FEEDBACK_URL | quote }}

  - name: PERSON_ESCORT_RECORD_FEEDBACK_URL
    value: {{ .Values.env.PERSON_ESCORT_RECORD_FEEDBACK_URL | quote }}

  - name: GOOGLE_ANALYTICS_ID
    value: {{ .Values.env.GOOGLE_ANALYTICS_ID | quote }}

  - name: LOG_LEVEL
    value: {{ .Values.env.LOG_LEVEL | quote }}

  - name: NODE_ENV
    value: {{ .Values.env.NODE_ENV | quote }}

  - name: NOMIS_ELITE2_API_URL
    value: {{ .Values.env.NOMIS_ELITE2_API_URL | quote }}

  - name: PROMETHEUS_MOUNTPATH
    value: {{ .Values.env.PROMETHEUS_MOUNTPATH | quote }}

  - name: SENTRY_ENVIRONMENT
    value: {{ .Values.env.SENTRY_ENVIRONMENT | quote }}

  - name: SERVER_HOST
    value: {{ .Values.env.SERVER_HOST | quote }}

  - name: SUPPORT_EMAIL
    value: {{ .Values.env.SUPPORT_EMAIL | quote }}

  - name: ENABLE_COMPONENTS_LIBRARY
    value: {{ .Values.env.ENABLE_COMPONENTS_LIBRARY | quote }}

  - name: FEATURE_FLAG_POPULATION_DASHBOARD
    value: {{ .Values.env.FEATURE_FLAG_POPULATION_DASHBOARD | quote }}

  - name: FEATURE_FLAG_YOUTH_RISK_ASSESSMENT
    value: {{ .Values.env.FEATURE_FLAG_YOUTH_RISK_ASSESSMENT | quote }}

  - name: FEATURE_FLAG_YOUTH_RISK_ASSESSMENT_YOI
    value: {{ .Values.env.FEATURE_FLAG_YOUTH_RISK_ASSESSMENT_YOI | quote }}
{{- end -}}
