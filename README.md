# Multi-Product Funnel System

A complete sales funnel system with multiple product lines, featuring dynamic content switching and a full customer journey from opt-in to backend offers.

## Features

- **Multiple Product Lines**: 
  - AI Income Blueprint
  - Crypto Money Machine
  - AI App Empire

- **Complete Funnel Flow**:
  1. Landing Page with opt-in form
  2. Thank You page with tripwire preview
  3. Tripwire offer page with countdown timer
  4. Core upsell page
  5. Backend high-ticket offers

- **Dynamic Content**: All content updates based on selected product line
- **Responsive Design**: Works on all devices
- **Interactive Elements**: Product selector, funnel navigation, countdown timer

## Project Structure

```
multi-product-funnel/
├── index.html       # Main HTML file
├── styles.css       # All CSS styles
├── script.js        # JavaScript functionality
└── README.md        # Project documentation
```

## Usage

1. Open `index.html` in a web browser
2. Use the product selector in the top-left to switch between product lines
3. Navigate through the funnel using the navigation panel in the bottom-right
4. Test the opt-in flow by entering an email address

## Customization

### Adding New Products

1. Add product data to the `products` object in `script.js`
2. Include all required content fields
3. Add corresponding gradient classes in `styles.css`

### Modifying Styles

- All styles are in `styles.css`
- Gradient classes control product-specific colors
- Responsive breakpoints are defined at the bottom

### Updating Content

- Product content is stored in the `products` object in `script.js`
- Modify content arrays and strings to update copy
- Prices and features can be easily adjusted

## Technical Details

- **HTML5** semantic markup
- **CSS3** with gradients, animations, and flexbox/grid
- **Vanilla JavaScript** for maximum compatibility
- **No dependencies** - runs standalone

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

This project is open source and available for educational and commercial use.