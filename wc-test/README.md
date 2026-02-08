# Resume Editor Web Component Examples

This folder contains example HTML/JavaScript applications that demonstrate how to use the `resume-editor` web component built from the Reactive Resume project.

## Files

- **index.html** - Full-featured demo with locale selection, theme switching, export functionality, and real-time data display
- **simple-example.html** - Minimal example showing basic usage of the web component
- **package.json** - Dependencies and scripts for running locally

## Usage

### Option 1: Direct File Opening
Simply open the HTML files directly in your browser:
```bash
open index.html
# or
open simple-example.html
```

### Option 2: Using a Local HTTP Server

Using Python:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Using Node.js (with http-server):
```bash
npx http-server -p 8000
```

Using the npm script:
```bash
npm run serve
# Navigate to http://localhost:8000
```

## Web Component API

### HTML Attributes

```html
<resume-editor
  locale="en-US"
  theme="light"
  show-page-numbers="true"
  assets-base-url="../dist/editor/"
></resume-editor>
```

- **locale** - Language locale (e.g., "en-US", "es-ES", "fr-FR", etc.)
- **theme** - "light" or "dark"
- **show-page-numbers** - "true" or "false" (default: "true")
- **css-href** - Optional URL to an external CSS file if you want to override the inlined styles
- **assets-base-url** - Base URL for assets like template previews (auto-detected if not provided)

### JavaScript API

```javascript
// Get reference to the component
const editor = document.getElementById('editor');

// Set resume data
editor.value = {
  id: "resume-1",
  version: "1.0",
  sections: { /* ... */ },
  heading: { /* ... */ },
  metadata: { /* ... */ }
};

// Get current resume data
const currentData = editor.value;

// Programmatically change locale
editor.setAttribute('locale', 'es-ES');

// Programmatically change theme
editor.setAttribute('theme', 'dark');

// Toggle page numbers
editor.setAttribute('show-page-numbers', 'false');

// Listen for changes
editor.addEventListener('resume-change', (event) => {
  const updatedData = event.detail;
  console.log('Resume updated:', updatedData);
});
```

## Building the Web Component

The web component is built from the main Reactive Resume project using:

```bash
cd /path/to/Reactive-Resume
pnpm build:editor
```

This generates:
- `dist/editor/resume-editor.js` - The web component bundle
- `dist/editor/templates/**` - Template previews (copied from `public/templates`)

Styles are inlined into `resume-editor.js` by default.

## Resume Data Structure

The resume data is a JSON object with the following structure:

```typescript
{
  id: string;
  version: string;
  sections: {
    summary: Section;
    profiles: Section;
    experience: Section;
    education: Section;
    skills: Section;
    projects: Section;
    certifications: Section;
    awards: Section;
    languages: Section;
    interests: Section;
    references: Section;
    custom: Section;
  };
  heading: {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    url: string;
    summary: string;
  };
  metadata: {
    template: string;
    language: string;
    date: string;
    color: string;
  };
}
```

Each section contains:
```typescript
{
  id: string;
  name: string;
  visibility: "visible" | "hidden";
  items: SectionItem[];
}
```

## Events

The component emits the following events:

- **resume-change** - Fired when the resume data is modified
  - `event.detail` contains the updated resume data

## Features

The web component includes:
- Full resume editing interface
- Real-time preview
- Drag-and-drop support for reordering items
- Multiple templates and themes
- Internationalization (i18n) support
- Print-friendly export
- Light and dark themes
- Responsive design

## Examples

### Creating a Resume Editor
```html
<resume-editor id="editor"></resume-editor>

<script type="module">
  import ResumeEditor from "./dist/editor/resume-editor.js";
  
  const editor = document.getElementById('editor');
  editor.value = { /* resume data */ };
  
  editor.addEventListener('resume-change', (e) => {
    console.log('Updated:', e.detail);
  });
</script>
```

### Multi-Language Support
```javascript
const editor = document.getElementById('editor');

// Switch language
function changeLanguage(locale) {
  editor.setAttribute('locale', locale);
}

changeLanguage('es-ES');  // Spanish
changeLanguage('fr-FR');  // French
changeLanguage('de-DE');  // German
```

### Theme Switching
```javascript
const editor = document.getElementById('editor');

function toggleTheme() {
  const currentTheme = editor.getAttribute('theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  editor.setAttribute('theme', newTheme);
}
```

## License

MIT
