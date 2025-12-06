#!/usr/bin/env python3
"""
Script to remove backgrounds from vehicle images and save them with transparency.
"""
from rembg import remove
from PIL import Image
import os

# Define input and output paths
input_output_map = {
    'escalade_original.png': '../client/public/vehicles/escalade-transparent.png',
    'mercedes_s_original.png': '../client/public/vehicles/mercedes-s-transparent.png',
    'sprinter_original.png': '../client/public/vehicles/sprinter-transparent.png'
}

print("Starting background removal process...\n")

for input_file, output_file in input_output_map.items():
    print(f"Processing: {input_file}")
    
    # Read the input image
    with open(input_file, 'rb') as input_img:
        input_data = input_img.read()
    
    # Remove background
    output_data = remove(input_data)
    
    # Save the output image
    output_path = os.path.join(os.path.dirname(__file__), output_file)
    with open(output_path, 'wb') as output_img:
        output_img.write(output_data)
    
    # Get file sizes for comparison
    input_size = os.path.getsize(input_file) / 1024
    output_size = os.path.getsize(output_path) / 1024
    
    print(f"  ✓ Saved to: {output_file}")
    print(f"  Original: {input_size:.1f} KB → Transparent: {output_size:.1f} KB\n")

print("Background removal complete! ✨")
print("\nProcessed images saved to: client/public/vehicles/")
