#!/bin/bash

for dir in */; do
    if [ -d "$dir" ]; then
        folder_name=$(basename "$dir")
        cd "$dir"
        
        # Rename images
        index=1
        for img in *.jpg *.jpeg *.png *.gif *.webp *.JPG *.JPEG *.PNG *.GIF *.WEBP; do
            if [ -f "$img" ]; then
                ext="${img##*.}"
                mv "$img" "${folder_name}-${index}.${ext}"
                ((index++))
            fi
        done
        
        # Create index.md
        cat > index.md << EOF
---
date: 2025-09-04
authors:
  - Tanner Legasse
title: 
draft: false
tags: ["toasters"]
toaster-decade: ""
toaster-years: ""
toaster-brands: ""
toaster-styles: ""
---
{{< gallery id="content-gallery" >}}
EOF
        
        # Add img shortcodes for each renamed image
        for img in ${folder_name}-*.*; do
            if [ -f "$img" ]; then
                echo "  {{< img src=\"./$img\" caption=\"placeholder\" >}}" >> index.md
            fi
        done
        
        echo "{{< /gallery >}}" >> index.md
        
        cd ..
    fi
done
