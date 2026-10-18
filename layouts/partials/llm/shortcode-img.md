{{- $image := .Page.Resources.Get (.Get "src") -}}
- ![{{ .Get "caption" }}]({{ $image.Permalink }}){{ with .Get "caption" }} {{ . }}{{ end }}
