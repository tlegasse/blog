Photos:

{{ .Inner | replaceRE "(?m)^[ \t]+" "" | replaceRE "\n{2,}" "\n" | strings.TrimSpace }}
