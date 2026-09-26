// logger.js - Advanced Floating, Collapsible Global Logger & Error Tracker
class FloatingLogger {
    constructor() {
        this.logs = [];
        this.errorCount = 0;
        this.isOpen = false;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.initUI();
        this.initGlobalErrorHandlers();
        this.log("Floating Logger initialized successfully.", "success");
    }

    initUI() {
        if (document.getElementById('floating-logger-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'floating-logger-wrapper';
        wrapper.innerHTML = `
            <style>
                #floating-logger-wrapper {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 999999;
                    font-family: 'Poppins', sans-serif;
                }
                #logger-toggle-btn {
                    background: #6c5ce7;
                    color: #fff;
                    border: none;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    cursor: pointer;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
                    font-size: 1.3rem;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s, background-color 0.2s;
                }
                #logger-toggle-btn:hover { transform: scale(1.08); background: #5b4cc4; }
                #logger-badge {
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    background: #ff7675;
                    color: white;
                    border-radius: 50%;
                    padding: 2px 7px;
                    font-size: 0.7rem;
                    font-weight: bold;
                    display: none;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                }
                #logger-panel {
                    position: absolute;
                    bottom: 65px;
                    right: 0;
                    width: 340px;
                    max-height: 420px;
                    background: #121214;
                    border: 1px solid #2d2d38;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.7);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                }
                #logger-panel.open { display: flex; }
                #logger-header {
                    background: #1e1e24;
                    padding: 12px 14px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #2d2d38;
                    font-size: 0.85rem;
                    color: #f1f1f1;
                    font-weight: 600;
                }
                #logger-actions button {
                    background: rgba(255,255,255,0.08);
                    border: none;
                    color: #a0a0ab;
                    cursor: pointer;
                    font-size: 0.75rem;
                    padding: 4px 8px;
                    border-radius: 4px;
                    margin-left: 4px;
                    transition: background 0.2s, color 0.2s;
                }
                #logger-actions button:hover { background: rgba(255,255,255,0.15); color: #fff; }
                #logger-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px;
                    font-size: 0.75rem;
                    line-height: 1.4;
                    background: #0b0b0d;
                }
                .log-entry {
                    margin-bottom: 8px;
                    padding-bottom: 6px;
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                    word-break: break-word;
                }
                .log-info { color: #f1f1f1; }
                .log-success { color: #00cec9; }
                .log-warn { color: #fdcb6e; }
                .log-error { color: #ff7675; font-weight: bold; }
                .log-meta { font-size: 0.65rem; color: #a0a0ab; margin-top: 2px; font-family: monospace; background: rgba(255,0,0,0.08); padding: 2px 4px; border-radius: 3px; display: inline-block; }
            </style>

            <button id="logger-toggle-btn" title="Toggle System Diagnostics">
                🐛
                <span id="logger-badge">0</span>
            </button>

            <div id="logger-panel">
                <div id="logger-header">
                    <span>Live Console & Error Tracker</span>
                    <div id="logger-actions">
                        <button id="logger-copy-btn" title="Copy all logs to clipboard">Copy</button>
                        <button id="logger-clear-btn" title="Clear logs">Clear</button>
                    </div>
                </div>
                <div id="logger-content"></div>
            </div>
        `;
        document.body.appendChild(wrapper);

        document.getElementById('logger-toggle-btn').addEventListener('click', () => this.togglePanel());
        document.getElementById('logger-clear-btn').addEventListener('click', () => this.clear());
        document.getElementById('logger-copy-btn').addEventListener('click', () => this.copyLogs());
    }

    togglePanel() {
        const panel = document.getElementById('logger-panel');
        this.isOpen = !this.isOpen;
        panel.classList.toggle('open', this.isOpen);
    }

    log(msg, type = 'info', meta = '') {
        const time = new Date().toLocaleTimeString();
        const entry = { time, msg, type, meta };
        this.logs.push(entry);

        if (type === 'error') {
            this.errorCount++;
            this.updateBadge();
        }

        this.renderToDOM(entry);
    }

    renderToDOM(entry) {
        const content = document.getElementById('logger-content');
        if (!content) return;

        const div = document.createElement('div');
        div.className = `log-entry log-${entry.type}`;
        div.innerHTML = `
            <div>[${entry.time}] ${this.escapeHtml(entry.msg)}</div>
            ${entry.meta ? `<div class="log-meta">📍 ${this.escapeHtml(entry.meta)}</div>` : ''}
        `;
        content.appendChild(div);
        content.scrollTop = content.scrollHeight;
    }

    updateBadge() {
        const badge = document.getElementById('logger-badge');
        if (!badge) return;
        if (this.errorCount > 0) {
            badge.style.display = 'block';
            badge.innerText = this.errorCount;
        } else {
            badge.style.display = 'none';
        }
    }

    clear() {
        this.logs = [];
        this.errorCount = 0;
        this.updateBadge();
        const content = document.getElementById('logger-content');
        if (content) content.innerHTML = '';
        this.log("Logs cleared.", "info");
    }

    copyLogs() {
        const text = this.logs.map(l => `[${l.time}] [${l.type.toUpperCase()}] ${l.msg} ${l.meta ? '-> ' + l.meta : ''}`).join('\n');
        navigator.clipboard.writeText(text).then(() => {
            alert('All logs copied to clipboard!');
        });
    }

    initGlobalErrorHandlers() {
        // Automatically capture syntax/runtime exceptions and exact file line numbers
        window.onerror = (msg, source, lineno, colno, error) => {
            const fileName = source ? source.split('/').pop() : 'inline-script';
            const location = `${fileName}:${lineno}:${colno}`;
            this.log(`Runtime Error: ${msg}`, 'error', location);
        };

        // Capture unhandled asynchronous promise failures
        window.addEventListener('unhandledrejection', (event) => {
            const reason = event.reason ? event.reason.message || event.reason : 'Unknown Promise Rejection';
            this.log(`Promise Rejection: ${reason}`, 'error', 'Async/Promise');
        });
    }

    escapeHtml(str) {
        return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
}

export const globalLogger = new FloatingLogger();
