{{- $p := . -}}
{{ $p.RawContent }}

| Artist | Album | Plays (recent) | MusicBrainz |
|---|---|---|---|
{{ with resources.Get "data/albums.json" -}}
{{ range transform.Unmarshal . -}}
| {{ .artist }} | {{ .title }} | {{ .count }} | https://musicbrainz.org/release/{{ .mbid }} |
{{ end -}}
{{ end -}}
