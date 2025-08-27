# Mobile Metrics Dashboard

A simple dashboard to track mobile app metrics including bundle sizes, performance data, and other development metrics.

## Features

- **Bundle Size Tracking**: Monitor Android and iOS bundle sizes over time
- **Historical Data**: View trends and changes across different versions/PRs
- **GitHub Integration**: Links to PRs and commits for context
- **Responsive Design**: Works on desktop and mobile devices

## Structure

```
mobile-metrics/
├── index.html          # Main dashboard page
├── css/
│   └── styles.css      # Styling for the dashboard
├── js/
│   └── dashboard.js    # JavaScript functionality
├── data/
│   └── bundle-sizes.json # Bundle size data storage
└── README.md           # This file
```

## Usage

### Local Development

1. Serve the files using a local web server:

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve .

   # Using PHP
   php -S localhost:8000
   ```

2. Open `http://localhost:8000` in your browser

### GitHub Pages

1. Push this repository to GitHub
2. Enable GitHub Pages in repository settings
3. Set source to deploy from main branch
4. Access at `https://your-username.github.io/mobile-metrics/`

## Data Format

The `data/bundle-sizes.json` file should contain an array of objects with this structure:

```json
[
  {
    "timestamp": "2025-08-27T10:30:00.000Z",
    "repo": "jisr-react-native",
    "pr_number": 123,
    "branch": "feature/new-component",
    "commit_sha": "abc1234",
    "android_size": 15728640,
    "ios_size": 18874368,
    "android_error": null,
    "ios_error": null,
    "pr_url": "https://github.com/jisr-hr/jisr-react-native/pull/123"
  }
]
```

### Fields Description

- `timestamp`: ISO 8601 timestamp of when the measurement was taken
- `repo`: Repository name
- `pr_number`: Pull request number (optional)
- `branch`: Git branch name
- `commit_sha`: Short commit SHA
- `android_size`: Android bundle size in bytes
- `ios_size`: iOS bundle size in bytes
- `android_error`: Error message if Android build failed (optional)
- `ios_error`: Error message if iOS build failed (optional)
- `pr_url`: URL to the pull request (optional)

## Integration with CI/CD

This dashboard is designed to work with GitHub Actions workflows that automatically update the bundle size data. See the main repository's workflow for implementation details.

## Customization

### Adding New Metrics

1. Create new data files in the `data/` directory
2. Update `dashboard.js` to load and display the new data
3. Add new sections to `index.html`
4. Style the new components in `styles.css`

### Styling

The dashboard uses a GitHub-inspired design system. Customize colors and layout by modifying `css/styles.css`.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- No external dependencies required
