#!/bin/bash

# Install ImageMagick if not already installed
if ! command -v convert &> /dev/null; then
    echo "Installing ImageMagick..."
    brew install imagemagick
fi

# Create 192x192 icon
convert -background none -resize 192x192 icon.svg icon-192.png

# Create 512x512 icon
convert -background none -resize 512x512 icon.svg icon-512.png

echo "Icons created successfully!" 