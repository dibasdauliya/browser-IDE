export const DEFAULT_HTML_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML/CSS/JS Playground</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Welcome to the Web Playground!</h1>
            <p>Edit HTML, CSS, and JavaScript files to see live changes</p>
        </header>
        
        <main>
            <section class="card">
                <h2>Interactive Demo</h2>
                <p>Click the button below to see JavaScript in action:</p>
                <button id="demoButton" class="btn">Click me!</button>
                <div id="output" class="output"></div>
            </section>
            
            <section class="card">
                <h2>Features</h2>
                <ul>
                    <li>Live preview updates</li>
                    <li>Multiple file support</li>
                    <li>CSS styling</li>
                    <li>JavaScript interactions</li>
                    <li>Responsive design</li>
                </ul>
            </section>
        </main>
        
        <footer>
            <p>Start coding and see your changes instantly!</p>
        </footer>
    </div>
    
    <script src="script.js"></script>
</body>
</html>`;

export const DEFAULT_CSS_CODE = `/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* Header styles */
header {
    text-align: center;
    margin-bottom: 40px;
    color: white;
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

header p {
    font-size: 1.2rem;
    opacity: 0.9;
}

/* Main content */
main {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-bottom: 40px;
}

/* Card styles */
.card {
    background: white;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
}

.card h2 {
    color: #4a5568;
    margin-bottom: 15px;
    font-size: 1.5rem;
}

.card p, .card li {
    color: #666;
    margin-bottom: 10px;
}

.card ul {
    list-style: none;
    padding-left: 0;
}

.card li {
    padding: 5px 0;
}

/* Button styles */
.btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn:active {
    transform: translateY(0);
}

/* Output area */
.output {
    margin-top: 20px;
    padding: 15px;
    background: #f7fafc;
    border-radius: 8px;
    border-left: 4px solid #667eea;
    min-height: 50px;
    font-family: 'Monaco', 'Menlo', monospace;
}

/* Footer styles */
footer {
    text-align: center;
    color: white;
    opacity: 0.8;
    margin-top: 40px;
}

/* Responsive design */
@media (max-width: 768px) {
    .container {
        padding: 15px;
    }
    
    header h1 {
        font-size: 2rem;
    }
    
    .card {
        padding: 20px;
    }
}

/* Animation for demo */
@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-10px);
    }
    60% {
        transform: translateY(-5px);
    }
}

.bounce {
    animation: bounce 1s;
}`;

export const DEFAULT_JS_CODE = `console.log('Web Playground JavaScript loaded!');

document.addEventListener('DOMContentLoaded', function() {
    const demoButton = document.getElementById('demoButton');
    const output = document.getElementById('output');
    
    let clickCount = 0;
    
    if (demoButton && output) {
        demoButton.addEventListener('click', function() {
            clickCount++;
            
            demoButton.classList.add('bounce');
            setTimeout(() => {
                demoButton.classList.remove('bounce');
            }, 1000);
            
            output.innerHTML = \`
                <h3>🎉 Button clicked!</h3>
                <p><strong>Click count:</strong> \${clickCount}</p>
                <p><strong>Time:</strong> \${new Date().toLocaleTimeString()}</p>
                <p><strong>Random number:</strong> \${Math.floor(Math.random() * 100) + 1}</p>
            \`;
            
            if (clickCount === 1) {
                demoButton.textContent = 'Click me again!';
            } else if (clickCount === 5) {
                demoButton.textContent = 'You\\'re persistent!';
            } else if (clickCount === 10) {
                demoButton.textContent = 'Wow, 10 clicks! 🎊';
            } else if (clickCount > 10) {
                demoButton.textContent = \`\${clickCount} clicks and counting!\`;
            }
        });
    }
    
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            console.log(\`Hovering over card \${index + 1}\`);
        });
    });
    
    console.log(\`Welcome to the Web Playground! 
    
    This playground includes:
    - HTML structure in index.html
    - CSS styling in style.css  
    - JavaScript interactivity in script.js
    
    Try editing any of the files to see live changes!
    \`);
});

function showAlert(message) {
    alert(message);
}

function logToConsole(message) {
    console.log('📝 ' + message);
}

const playground = {
    name: 'HTML/CSS/JS Playground',
    version: '1.0.0',
    features: ['Live Preview', 'Multi-file Support', 'Syntax Highlighting'],
    
    getInfo: () => {
        return \`Welcome to \${playground.name} v\${playground.version}\`;
    },
    
    listFeatures() {
        return this.features.map(feature => \`✨ \${feature}\`).join('\\n');
    }
};

window.playground = playground;`;
