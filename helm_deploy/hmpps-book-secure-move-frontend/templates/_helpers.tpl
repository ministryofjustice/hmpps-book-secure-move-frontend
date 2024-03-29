

{{/* Short name for root chart */}}
{{- define "basm-frontend.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/* Labels set on all resources: none are used as selectors */}}
{{- define "basm-frontend.labels" -}}
helm.sh/chart: {{ include "basm-frontend.chart" . }}
{{- $appVersion := index .Values "generic-service" "image" "tag" }}
{{- if $appVersion }}
app.kubernetes.io/version: {{ $appVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: {{ include "generic-service.name" . }}
{{- end }}