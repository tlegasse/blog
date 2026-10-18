{{- /* Markdown rendering of a single page, shared by index.md and llms-full.txt. */ -}}
{{- $p := . -}}
# {{ $p.Title }}

{{ with $p.Date }}{{ if not .IsZero }}- Published: {{ .Format "2006-01-02" }}
{{ end }}{{ end -}}
{{ with $p.Lastmod }}{{ if and (not .IsZero) (ne (.Format "2006-01-02") ($p.Date.Format "2006-01-02")) }}- Updated: {{ .Format "2006-01-02" }}
{{ end }}{{ end -}}
- Author: {{ delimit ($p.Params.authors | default (slice site.Params.author)) ", " }}
- URL: {{ $p.Permalink }}
{{ with $p.Section }}- Section: {{ . }}
{{ end -}}
{{ with $p.Params.categories }}- Categories: {{ delimit (cond (reflect.IsSlice .) . (slice .)) ", " }}
{{ end -}}
{{ with $p.Params.series }}- Series: {{ delimit (cond (reflect.IsSlice .) . (slice .)) ", " }}
{{ end -}}
{{ with $p.Params.tags }}- Tags: {{ delimit . ", " }}
{{ end -}}
{{ with index $p.Params "toaster-brands" }}- Brand: {{ . }}
{{ end -}}
{{ with index $p.Params "toaster-styles" }}- Style: {{ . }}
{{ end -}}
{{ with index $p.Params "toaster-decade" }}- Decade: {{ . }}
{{ end -}}
{{ with index $p.Params "toaster-years" }}- Year: {{ . }}
{{ end -}}
{{ with $p.Params.description }}
> {{ . }}
{{ end }}
{{ if eq $p.Layout "recent-albums" -}}
{{ partial "llm/albums.md" $p }}
{{- else -}}
{{ $p.RenderShortcodes }}
{{- end }}
