(function () {
  const API_KEY = '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';
  const MODEL   = 'llama-3.1-8b-instant';
  const SYSTEM  = `You are Dragon AI's friendly website assistant. Dragon AI Media Inc. is an advertising and marketing agency in the Philippines — a subsidiary of Philippine Dragon Media Network, one of the most influential Chinese-Filipino media platforms in the country. Services include Out-of-Home (OOH) advertising, 3D billboard productions, transit media, product launch events, brand activations, creative services, and media buying. Notable clients include Honor of Kings (Tencent), Vivo Philippines, Alibaba Cloud, Haier, Haidilao, OMODA/JAECOO, and Level Infinite. Be concise, warm, and helpful. For inquiries direct users to hello@dragonai.ph or the contact page.`;

  /* ── Styles ── */
  const css = document.createElement('style');
  css.textContent = `
    #dai-btn {
      position: fixed; bottom: 24px; right: 24px;
      width: 52px; height: 52px; border-radius: 50%;
      background: #e8380d; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(232,56,13,.5);
      z-index: 9999; transition: transform .2s, box-shadow .2s;
    }
    #dai-btn:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(232,56,13,.7); }
    #dai-btn svg { width: 22px; height: 22px; fill: #fff; }

    #dai-panel {
      position: fixed; bottom: 88px; right: 24px;
      width: 320px; height: 430px;
      background: #141414; border: 1px solid rgba(232,56,13,.25);
      border-radius: 16px; box-shadow: 0 12px 48px rgba(0,0,0,.6);
      z-index: 9998; display: flex; flex-direction: column; overflow: hidden;
      transform: scale(.92) translateY(12px); opacity: 0; pointer-events: none;
      transition: all .25s cubic-bezier(.4,0,.2,1); transform-origin: bottom right;
    }
    #dai-panel.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }

    .dai-head {
      background: linear-gradient(135deg,#e8380d,#ff5c2b);
      padding: 13px 14px; display: flex; align-items: center; gap: 10px; flex-shrink: 0;
    }
    .dai-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: rgba(255,255,255,.2);
      display: flex; align-items: center; justify-content: center;
      font-size: .75rem; font-weight: 800; color: #fff; font-family: 'Poppins',sans-serif;
    }
    .dai-head-info { flex: 1; }
    .dai-head-name { font-size: .78rem; font-weight: 700; color: #fff; font-family: 'Poppins',sans-serif; }
    .dai-head-status {
      font-size: .62rem; color: rgba(255,255,255,.75); font-family: 'Poppins',sans-serif;
      display: flex; align-items: center; gap: 4px;
    }
    .dai-dot { width: 6px; height: 6px; background: #4ade80; border-radius: 50%; }
    .dai-x {
      background: none; border: none; cursor: pointer;
      color: rgba(255,255,255,.75); display: flex; padding: 2px;
    }
    .dai-x:hover { color: #fff; }
    .dai-x svg { width: 16px; height: 16px; fill: currentColor; }

    .dai-msgs {
      flex: 1; overflow-y: auto; padding: 12px; display: flex;
      flex-direction: column; gap: 8px;
      scrollbar-width: thin; scrollbar-color: rgba(232,56,13,.3) transparent;
    }
    .dai-msgs::-webkit-scrollbar { width: 3px; }
    .dai-msgs::-webkit-scrollbar-thumb { background: rgba(232,56,13,.3); border-radius: 4px; }

    .dai-msg {
      max-width: 86%; font-size: .76rem; line-height: 1.55;
      font-family: 'Poppins',sans-serif; padding: 8px 11px; border-radius: 12px;
    }
    .dai-msg.bot  { background: #242424; color: #ddd; align-self: flex-start; border-bottom-left-radius: 3px; }
    .dai-msg.user { background: #e8380d; color: #fff; align-self: flex-end; border-bottom-right-radius: 3px; }
    .dai-msg.typing { color: #777; font-style: italic; }

    .dai-foot {
      padding: 9px 10px; border-top: 1px solid rgba(255,255,255,.06);
      display: flex; gap: 7px; align-items: center; flex-shrink: 0;
    }
    .dai-input {
      flex: 1; background: #222; border: 1px solid rgba(255,255,255,.09);
      border-radius: 20px; padding: 8px 13px; color: #e0e0e0;
      font-size: .76rem; font-family: 'Poppins',sans-serif; outline: none;
    }
    .dai-input:focus { border-color: rgba(232,56,13,.45); }
    .dai-input::placeholder { color: #555; }
    .dai-send {
      width: 34px; height: 34px; border-radius: 50%; background: #e8380d;
      border: none; cursor: pointer; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0; transition: background .2s;
    }
    .dai-send:hover { background: #ff4d1f; }
    .dai-send:disabled { background: #444; cursor: not-allowed; }
    .dai-send svg { width: 15px; height: 15px; fill: #fff; }
  `;
  document.head.appendChild(css);

  /* ── HTML ── */
  document.body.insertAdjacentHTML('beforeend', `
    <button id="dai-btn" aria-label="Open Dragon AI chat">
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
    </button>
    <div id="dai-panel" role="dialog" aria-label="Dragon AI chat">
      <div class="dai-head">
        <div class="dai-avatar">D</div>
        <div class="dai-head-info">
          <div class="dai-head-name">Dragon AI Assistant</div>
          <div class="dai-head-status"><span class="dai-dot"></span>Online</div>
        </div>
        <button class="dai-x" id="dai-close" aria-label="Close chat">
          <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
      <div class="dai-msgs" id="dai-msgs">
        <div class="dai-msg bot">Hi! I'm the Dragon AI assistant. Ask me anything about our services or projects 🔥</div>
      </div>
      <div class="dai-foot">
        <input class="dai-input" id="dai-input" type="text" placeholder="Ask something…" autocomplete="off">
        <button class="dai-send" id="dai-send" aria-label="Send">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `);

  /* ── Logic ── */
  const panel   = document.getElementById('dai-panel');
  const input   = document.getElementById('dai-input');
  const sendBtn = document.getElementById('dai-send');
  const msgBox  = document.getElementById('dai-msgs');
  const history = [];
  let busy = false;

  document.getElementById('dai-btn').addEventListener('click', () => panel.classList.toggle('open'));
  document.getElementById('dai-close').addEventListener('click', () => panel.classList.remove('open'));
  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });

  function addMsg(role, text, typing = false) {
    const el = document.createElement('div');
    el.className = `dai-msg ${role}${typing ? ' typing' : ''}`;
    el.textContent = text;
    msgBox.appendChild(el);
    msgBox.scrollTop = msgBox.scrollHeight;
    return el;
  }

  async function send() {
    const text = input.value.trim();
    if (!text || busy) return;
    input.value = '';
    busy = true;
    sendBtn.disabled = true;

    addMsg('user', text);
    history.push({ role: 'user', content: text });

    const typing = addMsg('bot', 'Typing…', true);

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'system', content: SYSTEM }, ...history.slice(-10)],
          max_tokens: 300,
          temperature: 0.7
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || `API error ${res.status}`);
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
      typing.textContent = reply;
      typing.classList.remove('typing');
      history.push({ role: 'assistant', content: reply });
    } catch (err) {
      typing.textContent = err.message || 'Connection error. Please try again.';
      typing.classList.remove('typing');
    }

    busy = false;
    sendBtn.disabled = false;
  }
})();
