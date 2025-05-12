// script.js
// data.js가 먼저 로드되어 전역 변수 제공 (START_DATE, EVENTS, baseColors, typeMap, orgMap, orgColors, MS_PER_DAY, STEP_DAYS, totalSteps)
(function() {
  const canvas = document.getElementById('timelineCanvas');
  const ctx = canvas.getContext('2d');

  // 툴팁 요소 생성
  const tooltip = document.createElement('div');
  Object.assign(tooltip.style, {
    position: 'absolute', background: 'rgba(0,0,0,0.8)', color: '#fff',
    padding: '6px 8px', borderRadius: '4px', pointerEvents: 'none',
    display: 'none', fontSize: '12px', zIndex: 1000
  });
  document.body.appendChild(tooltip);

  // 캔버스 리사이즈
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // 레인 수 계산
  const lanesType = Object.keys(typeMap).length;
  const lanesOrg = Object.keys(orgMap).length;
  const totalLanes = lanesType * lanesOrg;

  // 이벤트 전처리
  EVENTS.forEach(e => {
    e.startStep = Math.floor((new Date(e.start) - START_DATE) / (MS_PER_DAY * STEP_DAYS));
    e.endStep = Math.floor((new Date(e.end) - START_DATE) / (MS_PER_DAY * STEP_DAYS));
    e.fillColor = baseColors[e.type] || '#888';
    e.strokeColor = orgColors[e.org] || '#aaa';
    e.lane = typeMap[e.type] * lanesOrg + orgMap[e.org];
  });

  // 초기 오프셋: 현재 날짜를 화면 하단에
  const nowStep = Math.floor((Date.now() - START_DATE) / (MS_PER_DAY * STEP_DAYS));
  let offset = Math.min(Math.max(nowStep, 0), totalSteps - 1);
  const maxOffset = nowStep;

  // 휠 스크롤: 과거 방향만
  window.addEventListener('wheel', e => {
    e.preventDefault();
    offset = Math.min(Math.max(offset - e.deltaY * 0.2, 0), maxOffset);
  });

  // 2D→3D 투영
  function project(x, y, depth) {
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.1;
    const scale = 1 - depth * 0.8;
    return { x: cx + (x - cx) * scale, y: cy + (y - cy) * scale };
  }

  // 클릭 영역 감지
  function pointInPoly(pt, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i].x, yi = poly[i].y;
      const xj = poly[j].x, yj = poly[j].y;
      const intersect = ((yi > pt.y) !== (yj > pt.y)) &&
        (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  const shapes = [];
  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    for (const { poly, data } of shapes) {
      if (pointInPoly({ x, y }, poly)) {
        tooltip.innerHTML =
          `<strong>${data.name}</strong><br>` +
          `기간: ${data.start} ~ ${data.end}<br>` +
          `타입: ${data.type}<br>` +
          `기관: ${data.org}`;
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY + 10}px`;
        tooltip.style.display = 'block';
        return;
      }
    }
    tooltip.style.display = 'none';
  });

  // 드로우
  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // 배경
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#111');
    grad.addColorStop(1, '#000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const bottom = H * 0.15;
    const yNear = H - bottom, yFar = H * 0.1;
    const nearW = W * 0.8, nearL = (W - nearW) / 2;
    const farW = W * 0.2, farL = (W - farW) / 2;

    // 타입별 경계
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    for (let i = 0; i <= lanesType; i++) {
      const t = i / lanesType;
      const p1 = project(nearL + nearW * t, yNear, 0);
      const p2 = project(farL + farW * t, yFar, 1);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    }

    // org 내부 경계
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    for (let k = 1; k < totalLanes; k++) {
      if (k % lanesOrg === 0) continue;
      const t = k / totalLanes;
      const p1 = project(nearL + nearW * t, yNear, 0);
      const p2 = project(farL + farW * t, yFar, 1);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    }

    // 하단 타입 영역
    ctx.save(); ctx.globalAlpha = 0.1;
    Object.keys(typeMap).forEach((type, i) => {
      const x = nearL + nearW * (i / lanesType);
      const w = nearW / lanesType;
      const y0 = H - bottom * 0.1;
      ctx.fillStyle = baseColors[type];
      ctx.fillRect(x, y0, w, bottom * 0.1);
    });
    ctx.restore();

    // 시간 눈금 & 레이블 (크기 비례 확대)
    ctx.fillStyle = '#fff'; ctx.font = '12px sans-serif';
    for (let s = 0; s < totalSteps; s += 6) {
      const d = (s - offset) / (totalSteps - 1);
      if (d < 0 || d > 1) continue;
      const depth = 1 - d;
      const y = yNear + (yFar - yNear) * depth;
      const w = nearW + (farW - nearW) * depth;
      const x = nearL + (nearW - w) / 2;
      ctx.beginPath(); ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.stroke();
      const dt = new Date(START_DATE); dt.setDate(dt.getDate() + s * STEP_DAYS);
      const txt = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
      ctx.save();
      ctx.translate(x - 10, y);
      const scaleFactor = 0.5 + (1 - d);
      ctx.scale(scaleFactor, scaleFactor);
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(txt, 0, 0);
      ctx.restore();
    }

    // 이벤트
    shapes.length = 0;
    const buckets = {};
    EVENTS.forEach(e => (buckets[e.startStep] = buckets[e.startStep] || []).push(e));
    ctx.save(); ctx.globalAlpha = 0.6;
    Object.keys(buckets).map(Number).sort((a, b) => a - b).forEach(step => {
      const bucket = buckets[step];
      const d1 = (step - offset) / (totalSteps - 1);
      const depth1 = 1 - d1;
      if (depth1 < 0 || depth1 > 1) return;
      const y1 = yNear + (yFar - yNear) * depth1;
      const w1 = nearW + (farW - nearW) * depth1;
      const x0 = nearL + (nearW - w1) / 2;
      bucket.forEach((e, i) => {
        const zoneW = w1 / lanesType;
        const zx = x0 + zoneW * typeMap[e.type];
        const barW = (zoneW / lanesOrg) * 0.8;
        const cx1 = zx + (zoneW / lanesOrg) * (orgMap[e.org] + 0.5);
        const sx1 = cx1 - barW / 2;
        const d2 = 1 - ((e.endStep - offset) / (totalSteps - 1));
        if (d2 < 0 || d2 > 1) return;
        const y2 = yNear + (yFar - yNear) * d2;
        const p1 = project(sx1, y1, depth1);
        const p2 = project(sx1 + barW, y1, depth1);
        const p3 = project(sx1 + barW, y2, d2);
        const p4 = project(sx1, y2, d2);
        ctx.fillStyle = e.fillColor;
        ctx.strokeStyle = e.strokeColor; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y); ctx.closePath(); ctx.fill(); ctx.stroke();
        shapes.push({ poly: [p1, p2, p3, p4], data: e });
      });
    });
    ctx.restore();

    // 레전드
    const legendTypes = Object.keys(baseColors);
    const lw = W * 0.6;
    const lh = H * 0.04;
    const lx = (W - lw) / 2;
    const ly = H - lh - bottom * 0.02;
    const iw = lw / legendTypes.length;
    ctx.font = `${lh * 0.5}px sans-serif`;
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    legendTypes.forEach((type, idx) => {
      const x = lx + idx * iw;
      ctx.fillStyle = baseColors[type];
      ctx.fillRect(x, ly, iw * 0.6, lh);
      ctx.fillStyle = '#fff';
      ctx.fillText(type, x + (iw * 0.6) / 2, ly + lh * 1.2);
    });

    requestAnimationFrame(draw);
  }

  draw();
})();
