{{- /* Markdown rendering of a section / taxonomy / term page. */ -}}
{{- $p := . -}}
# {{ $p.Title }}

- URL: {{ $p.Permalink }}
{{ with $p.RawContent }}
{{ . }}
{{ end }}
{{- if eq $p.Kind "taxonomy" }}
{{ range $p.Pages }}
- [{{ .Title }}]({{ .Permalink }}index.md) ({{ len .Pages }} pages)
{{- end }}
{{- else if and (eq $p.Kind "section") (eq $p.Section "toasters") }}
Structured data for this collection: {{ $p.Permalink }}index.json

| Toaster | Brand | Style | Decade | Year | Markdown |
|---|---|---|---|---|---|
{{ range $p.Pages.ByTitle -}}
| {{ .Title }} | {{ index .Params "toaster-brands" | default "" }} | {{ index .Params "toaster-styles" | default "" }} | {{ index .Params "toaster-decade" | default "" }} | {{ index .Params "toaster-years" | default "" }} | {{ .Permalink }}index.md |
{{ end -}}
{{- else }}
{{ range $p.Pages }}
- [{{ .Title }}]({{ .Permalink }}index.md){{ with .Date }}{{ if not .IsZero }} ({{ .Format "2006-01-02" }}){{ end }}{{ end }}: {{ partial "llm/summary.html" . }}
{{- end }}
{{- end }}
