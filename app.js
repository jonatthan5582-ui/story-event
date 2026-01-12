// ===== utilities =====
const $ = (sel) => document.querySelector(sel);

// ----- กฎเริ่มต้น ใช้ฝั่ง Builder -----
const defaultRules = [
  { text: 'Toxic 100%', side: 'L', state: 'allow' },
  { text: 'เพื่มถอนรายชื่อ (จนกว่าจะมีสตอรี่)', side: 'L', state: 'allow' },
  { text: 'เล่นกิจกรรม (จนกว่าจะมีสตอรี่)', side: 'L', state: 'allow' },

  { text: 'AFK WARZONE AIRDROP (จนกว่าจะมีสตอรี่)', side: 'L', state: 'deny' },
  { text: 'อนุญาติเปลี่ยนใบเป็นคำปรับ(การบลัฟหลุด)', side: 'L', state: 'deny' },
  { text: 'ตีตัวหลุด บลัฟและก่อนถึงสตอรี่', side: 'R', state: 'deny' },
];

let rules = [...defaultRules];

// ===== ฝั่ง Builder (index.html) =====
function buildRuleRow(rule, idx) {
  const row = document.createElement('div');
  row.className = 'rule-input';
  row.dataset.idx = idx;
  row.innerHTML = `
    <input class="i" value="${rule.text.replaceAll('"', '&quot;')}" placeholder="พิมพ์ชื่อกฎ / รายละเอียด">
    <div class="seg">
      <button type="button" data-s="allow" class="${rule.state === 'allow' ? 'active allow' : ''}">อนุญาต</button>
      <button type="button" data-s="deny"  class="${rule.state === 'deny' ? 'active deny' : ''}">ไม่อนุญาต</button>
      <button type="button" data-s="cond"  class="${rule.state === 'cond' ? 'active cond' : ''}">มีเงื่อนไข</button>
    </div>
    <button type="button" class="remove" title="ลบกฎนี้">ลบ</button>
  `;

  // แก้ไขข้อความกฎ
  row.querySelector('input').addEventListener('input', e => {
    rules[idx].text = e.target.value;
    renderRules();
  });

  // เปลี่ยนสถานะ
  row.querySelectorAll('.seg button').forEach(btn => btn.addEventListener('click', e => {
    row.querySelectorAll('.seg button').forEach(b => b.classList.remove('active', 'allow', 'deny', 'cond'));
    e.currentTarget.classList.add('active', e.currentTarget.dataset.s);
    rules[idx].state = e.currentTarget.dataset.s;
    renderRules();
  }));

  // ลบแถวกฎ
  row.querySelector('.remove').addEventListener('click', () => {
    rules.splice(idx, 1);
    renderRules();
  });

  return row;
}

function rebuildEditor() {
  const wrap = $('#rules'); if (!wrap) return;
  wrap.innerHTML = ''; rules.forEach((r, i) => wrap.appendChild(buildRuleRow(r, i)));
}
function setText(sel, v) { const el = $(sel); if (el) el.textContent = v || '—'; }
function formatDate(iso) { if (!iso) return '—'; const d = new Date(iso + 'T00:00:00'); return d.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
function renderBasics() {
  setText('#pvTitle', $('#title')?.value?.trim());
  // เวลาเริ่ม
  setText('#stDate', formatDate($('#startDate')?.value));
  setText('#stTime', $('#startTime')?.value);
  // เวลาจบ
  setText('#edDate', formatDate($('#endDate')?.value));
  setText('#edTime', $('#endTime')?.value);
  setText('#pvFights', $('#fightCount')?.value);
  setText('#pvType', $('#storytype')?.value);
  setText('#pvDollars', $('#dollars')?.value);
  setText('#pvMember', $('#member')?.value);
  setText('#pvGang1Name', $('#gang1Name')?.value);
  setText('#pvGang1Tag', $('#gang1Tag')?.value);
  setText('#pvGang2Name', $('#gang2Name')?.value);
  setText('#pvGang2Tag', $('#gang2Tag')?.value);
  setText('#pvC1', $('#cond1')?.value);
  setText('#pvC2', $('#cond2')?.value);
  setText('#pvC3', $('#cond3')?.value);
  setText('#pvArena', $('#arena')?.value);
  setText('#pvF1', $('#foot1')?.value);
  setText('#pvF2', $('#foot2')?.value);
  setText('#pvF3', $('#foot3')?.value);

  const list = $('#pvMore ul');
  if (list) {
    list.innerHTML = '';
    ($('#more')?.value || '').split(/\n+/).filter(Boolean).forEach(line => {
      const li = document.createElement('li'); li.textContent = line.trim(); list.appendChild(li);
    });
  }
}
function renderRules() {
  const L = $('#pvRulesLeft'), R = $('#pvRulesRight');
  if (!L || !R) return;
  L.innerHTML = ''; R.innerHTML = '';
  rules.forEach(r => {
    const row = document.createElement('div'); row.className = 'rrow';
    const name = document.createElement('div'); name.className = 'rname'; name.textContent = r.text;
    const badge = document.createElement('div'); badge.className = 'badge';
    if (r.state === 'allow') { badge.textContent = 'อนุญาต'; badge.classList.add('ok'); }
    else if (r.state === 'deny') { badge.textContent = 'ไม่อนุญาต'; badge.classList.add('no'); }
    else { badge.textContent = 'มีเงื่อนไข'; badge.classList.add('co'); }
    row.appendChild(name); row.appendChild(badge);
    (r.side === 'L' ? L : R).appendChild(row);
  });
  rebuildEditor();
}
function bindImage(inputId, imgId) {
  const input = $(inputId), img = $(imgId); if (!input || !img) return;
  input.addEventListener('change', e => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.onload = ev => { img.src = ev.target.result; }; reader.readAsDataURL(file);
  });
}
function collectState() {
  return {
    title: $('#title')?.value?.trim() || '',
    dateISO: $('#startDate')?.value || '',
    sttime: $('#startTime')?.value || '',
    stdate: formatDate($('#startDate')?.value),
    dateISO: $('#endDate')?.value || '',
    edtime: $('#endTime')?.value || '',
    eddate: formatDate($('#endtDate')?.value),
    fights: $('#fightCount')?.value || '',
    typest: $('#storytype')?.value || '',
    dollars: $('#dollars')?.value || '',
    gang1Name: $('#gang1Name')?.value || '',
    gang1Tag: $('#gang1Tag')?.value || '',
    gang2Name: $('#gang2Name')?.value || '',
    gang2Tag: $('#gang2Tag')?.value || '',
    cond1: $('#cond1')?.value || '',
    cond2: $('#cond2')?.value || '',
    cond3: $('#cond3')?.value || '',
    arena: $('#arena')?.value || '',
    foot1: $('#foot1')?.value || '',
    foot2: $('#foot2')?.value || '',
    foot3: $('#foot3')?.value || '',
    notes: ($('#more')?.value || '').split(/\n+/).filter(Boolean),
    logo1: $('#pvLogo1')?.src || '',
    logo2: $('#pvLogo2')?.src || '',
    rules
  };
}
function openStandalone() {
  localStorage.setItem('storyAnnouncementData', JSON.stringify(collectState()));
  window.open('preview.html', '_blank');
}

if ($('#openStandalone')) {
  $('#openStandalone').addEventListener('click', () => { renderBasics(); renderRules(); openStandalone(); });
  $('#refresh')?.addEventListener('click', () => { renderBasics(); renderRules(); });
  document.querySelectorAll('#editor input.i, #editor textarea.ta')
    .forEach(el => el.addEventListener('input', renderBasics));
  bindImage('#gang1Logo', '#pvLogo1'); bindImage('#gang2Logo', '#pvLogo2');

  // 👉 ผูกปุ่มเพิ่มกฎ
  $('#addRule')?.addEventListener('click', () => {
    // สร้างกฎใหม่ สลับฝั่งซ้าย/ขวาอัตโนมัติให้ดูบาลานซ์
    const side = rules.filter(r => r.side === 'L').length <= rules.filter(r => r.side === 'R').length ? 'L' : 'R';
    rules.push({ text: '', side, state: 'allow' });
    renderRules();
    // โฟกัสช่องกรอกของกฎที่เพิ่งเพิ่ม
    setTimeout(() => {
      const last = document.querySelector(`#rules .rule-input:last-child input`);
      last?.focus();
    }, 0);
  });

  const now = new Date();
  $('#startDate').value = ''; $('#startTime').value = '';
  renderBasics(); renderRules(); rebuildEditor();
}


// ===== ฝั่ง Preview: เติมข้อมูล + export PNG =====
async function exportPNG(selector = '.stage', filename = 'Image.png') {
  const el = document.querySelector(selector);
  if (!el || !window.html2canvas) { alert('ไม่พบพื้นที่พรีวิว หรือ html2canvas ยังไม่โหลด'); return; }
  await new Promise(r => setTimeout(r, 300)); // ให้รูป/ฟอนต์โหลดให้ครบ
  const canvas = await window.html2canvas(el, { backgroundColor: null, scale: 2, useCORS: true, allowTaint: true });
  const link = document.createElement('a'); link.href = canvas.toDataURL('image/png'); link.download = filename; link.click();
}

function hydrateStandalone() {
  const s = localStorage.getItem('storyAnnouncementData'); if (!s) return;
  const state = JSON.parse(s);

  const map = {
    pv_title: state.title, pv_date: state.date, pv_time: state.sttime, pv_enddate: state.eddate, pv_endtime: state.edtime || '—',
    pv_fights: state.fights, pv_dollars: state.dollars, pv_story: state.typest,
    pv_gang1Name: state.gang1Name, pv_gang1Tag: state.gang1Tag,
    pv_gang2Name: state.gang2Name, pv_gang2Tag: state.gang2Tag,
    pv_cond1: state.cond1, pv_cond2: state.cond2, pv_cond3: state.cond3,
    pv_arena: state.arena, pv_foot1: state.foot1, pv_foot2: state.foot2, pv_foot3: state.foot3
  };
  Object.keys(map).forEach(id => { const el = document.getElementById(id); if (el) el.textContent = map[id] ?? '—'; });

  const l1 = document.getElementById('pv_logo1'); const l2 = document.getElementById('pv_logo2');
  if (l1) l1.src = state.logo1 || ''; if (l2) l2.src = state.logo2 || '';

  const list = document.getElementById('pv_notes');
  if (list) { list.innerHTML = (state.notes || []).map(n => `<li>${n}</li>`).join(''); }

  const L = document.getElementById('pv_rules_left'), R = document.getElementById('pv_rules_right');
  if (L && R) {
    L.innerHTML = ''; R.innerHTML = '';
    (state.rules || []).forEach(r => {
      const row = document.createElement('div'); row.className = 'rrow';
      const name = document.createElement('div'); name.className = 'rname'; name.textContent = r.text;
      const badge = document.createElement('div'); badge.className = 'badge';
      if (r.state === 'allow') { badge.textContent = 'อนุญาต'; badge.classList.add('ok'); }
      else if (r.state === 'deny') { badge.textContent = 'ไม่อนุญาต'; badge.classList.add('no'); }
      else { badge.textContent = 'มีเงื่อนไข'; badge.classList.add('co'); }
      row.appendChild(name); row.appendChild(badge);
      (r.side === 'L' ? L : R).appendChild(row);
    });
  }

  // ถ้าต้องการให้ดาวน์โหลดอัตโนมัติเมื่อเปิด ให้ uncomment บรรทัดด้านล่าง
  // setTimeout(()=>exportPNG('.stage','Image.png'), 500);
}

// ทำงานอัตโนมัติเมื่ออยู่หน้า preview
if (document.body && document.body.dataset.page === 'preview') { hydrateStandalone(); }
