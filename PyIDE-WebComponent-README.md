# PyIDE Web Component

A standalone Python IDE that can be embedded in any web page as a custom HTML element. Built with vanilla JavaScript and Web Components API, featuring Pyodide for client-side Python execution.

## Features

- **Complete Python IDE**: Code editor with syntax highlighting, run button, and output panel
- **Multi-file Support**: Create, edit, and manage multiple Python files
- **Auto Package Installation**: Automatically installs missing Python packages
- **Matplotlib Support**: Displays plots inline with automatic image rendering
- **Event System**: Listen to user interactions (input, change, submit events)
- **Responsive Design**: Works on desktop and mobile devices
- **No Dependencies**: Pure JavaScript, no external frameworks required

## Quick Start

### 1. Include the Web Component

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My App with PyIDE</title>
  </head>
  <body>
    <!-- Include the web component script -->
    <script src="path/to/PyIDEWebComponent.js"></script>

    <!-- Use the component -->
    <py-ide></py-ide>
  </body>
</html>
```

### 2. Basic API Usage

```javascript
const pyIDE = document.querySelector("py-ide");

// Get all code files
const allFiles = pyIDE.code;
console.log(allFiles); // Array of {name: string, content: string}

// Get latest execution output
const output = pyIDE.output;
console.log(output); // String containing output/errors

// Access first file (main file)
const mainFile = pyIDE.code[0];
console.log("Filename:", mainFile.name);
console.log("Content:", mainFile.content);

// Set code programmatically
pyIDE.setCode([
  { name: "main.py", content: "print('Hello, World!')" },
  { name: "utils.py", content: "def helper(): pass" },
]);
```

### 3. Event Listeners

```javascript
const pyIDE = document.querySelector("py-ide");

// Fires while user is typing (debounced)
pyIDE.addEventListener("input", (e) => {
  console.log("User typing in:", e.detail.fileName);
  console.log("Current content length:", e.detail.content.length);
});

// Fires when user stops editing a file
pyIDE.addEventListener("change", (e) => {
  console.log("File changed:", e.detail.fileName);
  console.log("File ID:", e.detail.fileId);
  console.log("New content:", e.detail.content);
});

// Fires when user clicks Run button
pyIDE.addEventListener("submit", (e) => {
  console.log("Executing:", e.detail.fileName);

  // Wait for execution to complete
  setTimeout(() => {
    console.log("Execution result:", pyIDE.output);
  }, 1000);
});

// Fires when user clicks Save button in the component
pyIDE.addEventListener("save", (e) => {
  console.log("Save triggered:", e.detail.files.length, "files");
  console.log("Timestamp:", e.detail.timestamp);
  console.log("Output:", e.detail.output);
});
```

## Complete Example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>PyIDE Integration Example</title>
  </head>
  <body>
    <h1>My Python Playground</h1>

    <!-- The PyIDE component -->
    <py-ide id="myIDE"></py-ide>

    <!-- External controls -->
    <button id="saveBtn">Save Current Work</button>
    <button id="loadExample">Load Example</button>

    <div id="status"></div>

    <script src="src/components/PyIDEWebComponent.js"></script>
    <script>
      const pyIDE = document.getElementById("myIDE");
      const saveBtn = document.getElementById("saveBtn");
      const loadBtn = document.getElementById("loadExample");
      const status = document.getElementById("status");

      // Save functionality
      saveBtn.onclick = () => {
        const files = pyIDE.code;
        const output = pyIDE.output;

        // Save to localStorage or send to server
        const saveData = {
          timestamp: new Date().toISOString(),
          files: files,
          lastOutput: output,
        };

        localStorage.setItem("my-python-project", JSON.stringify(saveData));
        status.textContent = `Saved ${files.length} files`;
      };

      // Load example
      loadBtn.onclick = () => {
        status.textContent = "Example loaded! Check the IDE above.";
      };

      // Event listeners
      pyIDE.addEventListener("input", (e) => {
        status.textContent = `Editing ${e.detail.fileName}...`;
      });

      pyIDE.addEventListener("change", (e) => {
        status.textContent = `Saved changes to ${e.detail.fileName}`;
      });

      pyIDE.addEventListener("submit", (e) => {
        status.textContent = `Running ${e.detail.fileName}...`;

        setTimeout(() => {
          status.textContent = "Execution completed!";
        }, 1000);
      });
    </script>
  </body>
</html>
```

## API Reference

### Properties

#### `pyIDE.code`

- **Type**: `Array<{name: string, content: string}>`
- **Description**: Array of all files in the IDE
- **Example**:
  ```javascript
  const files = pyIDE.code;
  files.forEach((file) => {
    console.log(`${file.name}: ${file.content.length} characters`);
  });
  ```

#### `pyIDE.output`

- **Type**: `string`
- **Description**: Latest execution output (including errors)
- **Example**:
  ```javascript
  const result = pyIDE.output;
  if (result.includes("Error:")) {
    console.log("Execution failed");
  }
  ```

### Methods

#### `pyIDE.setCode(filesArray)`

- **Type**: `(filesArray: Array<{name: string, content: string}>) => void`
- **Description**: Set the IDE files programmatically. Replaces all existing files.
- **Example**:
  ```javascript
  pyIDE.setCode([
    { name: "main.py", content: "print('Hello!')" },
    { name: "utils.py", content: "def helper(): return 42" },
  ]);
  ```

### Events

#### `input`

Fired while the user is typing (debounced to avoid excessive calls).

**Event Detail**:

```javascript
{
    content: string,     // Current content of the file
    fileName: string     // Name of the file being edited
}
```

#### `change`

Fired when the user finishes editing a file (on blur/tab away).

**Event Detail**:

```javascript
{
    content: string,     // Final content of the file
    fileName: string,    // Name of the file
    fileId: string       // Internal ID of the file
}
```

#### `submit`

Fired when the user clicks the Run button.

**Event Detail**:

```javascript
{
    content: string,     // Code that will be executed
    fileName: string     // Name of the file being executed
}
```

#### `save`

Fired when the user clicks the Save button in the component.

**Event Detail**:

```javascript
{
    files: Array<{name: string, content: string}>,  // All current files
    output: string,                                   // Current output
    timestamp: string                                 // ISO timestamp
}
```

## Styling

The component uses shadow DOM and includes its own styles. You can customize the container:

```css
py-ide {
  width: 100%;
  height: 600px;
  border: 2px solid #ccc;
  border-radius: 10px;
}

/* Responsive sizing */
@media (max-width: 768px) {
  py-ide {
    height: 400px;
  }
}
```

## Advanced Usage

### Multiple IDE Instances

```html
<py-ide id="ide1"></py-ide>
<py-ide id="ide2"></py-ide>

<script>
  const ide1 = document.getElementById("ide1");
  const ide2 = document.getElementById("ide2");

  // Each instance is independent
  ide1.addEventListener("submit", () => {
    console.log("IDE 1 executed:", ide1.output);
  });

  ide2.addEventListener("submit", () => {
    console.log("IDE 2 executed:", ide2.output);
  });
</script>
```

### Programmatic File Management

```javascript
// Note: Direct file manipulation requires accessing shadow DOM
// This is an advanced technique and may change in future versions

const pyIDE = document.querySelector("py-ide");

// Wait for component to be ready
setTimeout(() => {
  // Add a new file (triggers the built-in add file dialog)
  pyIDE.shadowRoot.getElementById("addFileBtn").click();

  // Access internal file list (read-only)
  console.log("Internal files:", pyIDE.files);
}, 1000);
```

## Browser Compatibility

- **Modern Browsers**: Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+
- **Required Features**:
  - Web Components (Custom Elements v1)
  - Shadow DOM v1
  - ES6+ support
  - WebAssembly (for Pyodide)

## Dependencies

- **Pyodide**: Loaded automatically from CDN (v0.25.1)
- **Python Packages**: Automatically installs `requests`, `numpy`, `matplotlib`
- **No build step required**: Pure JavaScript, works directly in browsers

## Troubleshooting

### Common Issues

1. **Component not loading**: Ensure script is loaded before creating elements
2. **Python not ready**: Wait for the status indicator to show "Ready"
3. **Package installation fails**: Check browser console for network errors
4. **Plots not showing**: Matplotlib is configured automatically for inline display

### Debug Mode

```javascript
// Enable debug logging
const pyIDE = document.querySelector("py-ide");
pyIDE.addEventListener("input", (e) => console.log("DEBUG input:", e.detail));
pyIDE.addEventListener("change", (e) => console.log("DEBUG change:", e.detail));
pyIDE.addEventListener("submit", (e) => console.log("DEBUG submit:", e.detail));
```

## Examples

See the included example files:

- `simple-example.html` - Basic usage matching your exact requirements
- `py-ide-test.html` - Comprehensive demo with all features

## License

This web component is part of the new-ide project. Use according to your project's license terms.
