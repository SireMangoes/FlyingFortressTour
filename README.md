# B-17 Flying Fortress Interior Tour

A fully navigable web-based 360-degree tour of the B-17 Flying Fortress interior.

## Features

- **360-Degree Panoramic Views**: Navigate through immersive 360-degree images of each compartment
- **Accurate Layout**: Compartments are arranged to match the actual B-17 interior structure
- **Interactive Navigation**: Click hotspots or use the navigation panel to move between compartments
- **Keyboard Shortcuts**: Quick navigation using number keys (1-7)
- **Fullscreen Mode**: Immersive viewing experience
- **Responsive Design**: Works on desktop and mobile devices

## B-17 Interior Layout

The tour includes the following compartments in order from front to back:

1. **Nose / Bombardier** - Forward position with bombsight
2. **Cockpit** - Flight deck with pilot and co-pilot controls
3. **Radio Room** - Communication and navigation equipment
4. **Bomb Bay** - Central ordnance storage area
5. **Left Waist Gun** - Port side gunner position
6. **Right Waist Gun** - Starboard side gunner position
7. **Tail Gunner** - Rear defensive position

## Setup Instructions

### 1. Extract Images from .uasset Files

The workspace contains `.uasset` files (Unreal Engine assets). You'll need to extract the 360-degree panoramic images from these files. You can use:

- Unreal Engine Editor to export the textures
- UModel or similar tools to extract assets
- Or use any 360-degree panoramic images you have

### 2. Prepare Your Images

1. Create an `images` folder in the project directory:
   ```
   mkdir images
   ```

2. Place your 360-degree panoramic images in the `images` folder with these names:
   - `B17-Interior1.jpg` (or .png) - Nose / Bombardier
   - `B17-Interior2.jpg` (or .png) - Cockpit
   - `B17-Interior3.jpg` (or .png) - Radio Room
   - `B17-Interior4.jpg` (or .png) - Bomb Bay
   - `B17-Interior5.jpg` (or .png) - Left Waist Gun
   - `B17-Interior6.jpg` (or .png) - Right Waist Gun
   - `B17-Interior7.jpg` (or .png) - Tail Gunner

3. **Image Requirements**:
   - Format: Equirectangular (360-degree) projection
   - Recommended aspect ratio: 2:1 (e.g., 4096x2048, 8192x4096)
   - Formats supported: JPG, PNG
   - Ensure images are properly oriented (horizon should be level)

### 3. Update Image Paths (if needed)

If your images have different names or are in a different location, edit `app.js` and update the `image` property in the `compartments` object for each compartment.

### 4. Open the Application

Simply open `index.html` in a modern web browser. For best results, use:
- Chrome
- Firefox
- Edge
- Safari

**Note**: Some browsers may require a local web server for full functionality. If you encounter issues, you can use:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (with http-server)
npx http-server
```

Then navigate to `http://localhost:8000` in your browser.

## Usage

### Navigation Methods

1. **Navigation Panel**: Click on any compartment name in the left panel
2. **Hotspots**: Click on the golden circular hotspots in the 360-degree view
3. **Keyboard Shortcuts**:
   - `1` - Nose / Bombardier
   - `2` - Cockpit
   - `3` - Radio Room
   - `4` - Bomb Bay
   - `5` - Left Waist Gun
   - `6` - Right Waist Gun
   - `7` - Tail Gunner
   - `M` - Toggle navigation panel
   - `ESC` - Exit fullscreen or show navigation

### Controls

- **Mouse/Touch**: Click and drag to look around in the 360-degree view
- **Zoom**: Scroll wheel or pinch gesture
- **Fullscreen**: Click the fullscreen button (bottom right)
- **Toggle Map**: Click the map button to show/hide the navigation panel

## Customization

### Adjusting Compartment Connections

Edit the `compartments` object in `app.js` to modify:
- Compartment names and descriptions
- Image paths
- Navigation connections between compartments
- Hotspot positions (yaw and pitch angles)

### Styling

Modify `styles.css` to customize:
- Colors and themes
- Panel sizes and positions
- Button styles
- Overlay appearance

## Technical Details

- **360-Degree Viewer**: Uses [Pannellum](https://pannellum.org/) library
- **No Backend Required**: Pure HTML/CSS/JavaScript
- **Responsive**: Works on desktop and mobile devices

## Troubleshooting

### Images Not Loading

- Check that image files exist in the `images` folder
- Verify file names match exactly (case-sensitive)
- Ensure you're using a web server (not just opening the HTML file directly)
- Check browser console for error messages

### Hotspots Not Appearing

- Verify that `hotspotPositions` are defined for each compartment
- Check that yaw/pitch values are correct (yaw: -180 to 180, pitch: -90 to 90)

### Performance Issues

- Use optimized image sizes (recommended: 4096x2048 or 8192x4096)
- Consider using JPEG format for smaller file sizes
- Enable browser caching for better performance

## License

This project is provided as-is for educational and personal use.

