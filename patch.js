const fs = require('fs');
let html = fs.readFileSync('/Users/jiwanjeon/Downloads/성적표 만들기/generator.html', 'utf8');

// 1. CSS
const newCss = `
        .main-wrapper {
            width: 100%;
            max-width: 1300px;
            padding: 40px 20px;
            display: flex;
            gap: 30px;
            flex-direction: row;
        }

        .history-panel {
            flex: 0.8;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: rgba(28, 28, 30, 0.4);
            backdrop-filter: var(--ios-blur);
            -webkit-backdrop-filter: var(--ios-blur);
            border-radius: 20px;
            border: 1px solid var(--ios-border);
            padding: 24px;
            max-height: calc(100vh - 80px);
            min-width: 250px;
            box-sizing: border-box;
        }

        .history-panel h2 {
            font-size: 22px;
            font-weight: 700;
            margin: 0;
            color: var(--ios-text);
        }

        .history-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            overflow-y: auto;
            flex-grow: 1;
            padding-right: 8px;
        }

        .history-item {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 12px;
            padding: 14px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .history-item .hist-name {
            font-size: 14px;
            font-weight: 600;
            color: #34c759;
            word-break: break-all;
        }

        .history-item .hist-time {
            font-size: 12px;
            color: var(--ios-text-secondary);
        }

        @media (max-width: 1024px) {
            .main-wrapper { flex-direction: column; }
            .history-panel { max-height: 300px; }
        }
`;
html = html.replace(/\.main-wrapper\s*\{[\s\S]*?flex-direction:\s*row;\s*\}/, newCss.trim());

const inputCss = `input[type="text"],
        textarea {
            background: transparent;
            border: none;
            color: var(--ios-text);
            font-size: 17px;
            text-align: right;
            width: 60%;
            font-family: inherit;
        }

        input[type="text"] {
            text-transform: capitalize;
        }`;
html = html.replace(/input\[type="text"\],\s*textarea\s*\{[\s\S]*?font-family:\s*inherit;\s*\}/, inputCss);

html = html.replace('.panel {', `.history-panel {\n                display: none !important;\n            }\n            .panel {`);

// HTML Replace
const historyHTML = `<!-- History Panel -->
        <div class="history-panel" id="historyPanel">
            <h2>Records</h2>
            <div id="historyList" class="history-list"></div>
            <button class="action-btn secondary" onclick="clearHistory()" style="margin-top: auto; padding: 12px; font-size: 14px; border-radius: 12px;">Clear History</button>
        </div>

        <!-- Input Panel -->
        <div class="panel">`;
html = html.replace('<!-- Input Panel -->\n        <div class="panel">', historyHTML);

// JS 
html = html.replace(`const name = document.getElementById('studentName').value || 'Unknown Student';
            const cls = document.getElementById('className').value || 'Unknown Class';
            const teacher = document.getElementById('teacherName').value || 'Unknown Teacher';`, `const capitalizeWords = (str) => str.replace(/\\b\\w/g, c => c.toUpperCase());
            const name = capitalizeWords(document.getElementById('studentName').value) || 'Unknown Student';
            const cls = capitalizeWords(document.getElementById('className').value) || 'Unknown Class';
            const teacher = capitalizeWords(document.getElementById('teacherName').value) || 'Unknown Teacher';`);

html = html.replace(`const name = document.getElementById('studentName').value.trim() || 'Undefined';
            const cls = document.getElementById('className').value.trim() || 'NoClass';`, `const capitalizeWords = (str) => str.replace(/\\b\\w/g, c => c.toUpperCase());
            const name = capitalizeWords(document.getElementById('studentName').value.trim()) || 'Undefined';
            const cls = capitalizeWords(document.getElementById('className').value.trim()) || 'NoClass';`);

html = html.replace(`document.title = originalTitle;`, `document.title = originalTitle;
            saveHistory(generatedFileName, today);`);

html = html.replace(`function playHaptic() {`, `function saveHistory(fileName, dateObj) {
            const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            let history = JSON.parse(localStorage.getItem('pdfHistory') || '[]');
            history.unshift({ filename: fileName, time: \`\${dateStr} • \${timeStr}\` });
            if (history.length > 50) history.pop();
            localStorage.setItem('pdfHistory', JSON.stringify(history));
            renderHistory();
        }

        function clearHistory() {
            if(confirm("Clear all generation history?")) {
                localStorage.removeItem('pdfHistory');
                renderHistory();
            }
        }

        function renderHistory() {
            const list = document.getElementById('historyList');
            if (!list) return;
            let history = JSON.parse(localStorage.getItem('pdfHistory') || '[]');
            if (history.length === 0) {
                list.innerHTML = \`<div style="color:var(--ios-text-secondary); font-size:14px; text-align:center; padding-top: 20px;">No history records yet.</div>\`;
                return;
            }
            list.innerHTML = history.map(h => \`
                <div class="history-item">
                    <div class="hist-name">\${h.filename}</div>
                    <div class="hist-time">\${h.time}</div>
                </div>
            \`).join('');
        }
        
        // Initialize history on load
        document.addEventListener('DOMContentLoaded', renderHistory);

        function playHaptic() {`);

fs.writeFileSync('/Users/jiwanjeon/Downloads/성적표 만들기/generator.html', html);
console.log('Success');
