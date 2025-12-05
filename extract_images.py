#!/usr/bin/env python3
"""
Script to extract 360-degree images from Unreal Engine .uasset files.
This script attempts to extract image data from the binary .uasset files.
"""

import os
import sys
import struct
from pathlib import Path

def extract_from_uasset(uasset_path, output_dir):
    """
    Attempt to extract image data from a .uasset file.
    Note: .uasset files are complex binary formats. This is a basic attempt.
    """
    print(f"Attempting to extract from: {uasset_path}")
    
    if not os.path.exists(uasset_path):
        print(f"Error: File not found: {uasset_path}")
        return False
    
    try:
        with open(uasset_path, 'rb') as f:
            data = f.read()
        
        # Check for common image file signatures within the binary data
        # Look for JPEG markers
        jpeg_markers = [
            b'\xff\xd8\xff\xe0',  # JPEG
            b'\xff\xd8\xff\xe1',  # JPEG with EXIF
            b'\xff\xd8\xff\xdb',  # JPEG
        ]
        
        # Look for PNG markers
        png_marker = b'\x89PNG\r\n\x1a\n'
        
        # Try to find embedded images
        found_images = []
        
        # Search for JPEG
        for marker in jpeg_markers:
            pos = 0
            while True:
                pos = data.find(marker, pos)
                if pos == -1:
                    break
                # Try to find the end of the JPEG (FF D9)
                end_pos = data.find(b'\xff\xd9', pos)
                if end_pos != -1:
                    jpeg_data = data[pos:end_pos + 2]
                    found_images.append(('jpg', jpeg_data, pos))
                    pos = end_pos + 2
                else:
                    pos += 1
        
        # Search for PNG
        pos = 0
        while True:
            pos = data.find(png_marker, pos)
            if pos == -1:
                break
            # PNG files have IEND marker at the end
            end_pos = data.find(b'IEND\xaeB`\x82', pos)
            if end_pos != -1:
                png_data = data[pos:end_pos + 8]
                found_images.append(('png', png_data, pos))
                pos = end_pos + 8
            else:
                pos += 1
        
        if found_images:
            # Get the largest image (likely the main texture)
            found_images.sort(key=lambda x: len(x[1]), reverse=True)
            img_type, img_data, offset = found_images[0]
            
            # Generate output filename
            base_name = Path(uasset_path).stem
            output_path = os.path.join(output_dir, f"{base_name}.{img_type}")
            
            with open(output_path, 'wb') as out:
                out.write(img_data)
            
            print(f"  ✓ Extracted {len(img_data)} bytes to {output_path}")
            return True
        else:
            print(f"  ✗ No image data found in {uasset_path}")
            print(f"    File size: {len(data)} bytes")
            return False
            
    except Exception as e:
        print(f"  ✗ Error processing {uasset_path}: {e}")
        return False

def main():
    # Source directory with .uasset files
    source_dir = "/Users/alexmacbook/Downloads/testing_this_version/Content/Air-and-Space/Stereoscopic"
    
    # Output directory
    output_dir = "/Users/alexmacbook/B17 Tour/images"
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Map of .uasset files to expected output names
    file_mapping = {
        'B17-Interior1.uasset': 'B17-Interior1',
        'B17-Interior2.uasset': 'B17-Interior2',
        'B17-Interior3.uasset': 'B17-Interior3',
        'B17-Interior4.uasset': 'B17-Interior4',
        'B17-Interior5.uasset': 'B17-Interior5',
        'B17-Interior6.uasset': 'B17-Interior6',
        'B17-Interior7.uasset': 'B17-Interior7',
    }
    
    print("Extracting images from .uasset files...")
    print("=" * 60)
    
    extracted_count = 0
    
    # Process mapped files first
    for uasset_file, base_name in file_mapping.items():
        uasset_path = os.path.join(source_dir, uasset_file)
        if os.path.exists(uasset_path):
            # Try to extract
            if extract_from_uasset(uasset_path, output_dir):
                # Rename to expected name if extraction succeeded
                extracted_file = os.path.join(output_dir, f"{uasset_file.replace('.uasset', '')}.jpg")
                expected_file = os.path.join(output_dir, f"{base_name}.jpg")
                if os.path.exists(extracted_file) and extracted_file != expected_file:
                    if os.path.exists(expected_file):
                        os.remove(expected_file)
                    os.rename(extracted_file, expected_file)
                    print(f"  → Renamed to {base_name}.jpg")
                extracted_count += 1
        else:
            print(f"  ✗ File not found: {uasset_path}")
    
    # Also try to extract from PIC files (might be additional views)
    pic_files = [f for f in os.listdir(source_dir) if f.startswith('PIC_') and f.endswith('.uasset')]
    for pic_file in pic_files:
        uasset_path = os.path.join(source_dir, pic_file)
        extract_from_uasset(uasset_path, output_dir)
    
    print("=" * 60)
    print(f"Extraction complete. Extracted {extracted_count} images.")
    print(f"Images saved to: {output_dir}")
    
    if extracted_count == 0:
        print("\n⚠️  No images were extracted. This might mean:")
        print("   1. The .uasset files use a different format")
        print("   2. Images are stored in a different way")
        print("   3. You may need to use Unreal Engine Editor to export them")
        print("\nAlternative: Use Unreal Engine Editor to export textures:")
        print("  1. Open the .uasset files in Unreal Engine")
        print("  2. Right-click on the texture asset")
        print("  3. Select 'Asset Actions' > 'Export'")
        print("  4. Save as JPG or PNG format")

if __name__ == "__main__":
    main()

