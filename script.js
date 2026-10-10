// พื้นหลังกริดนีออนเคลื่อนไหว
  const cv = document.getElementById("grid"), cx = cv.getContext("2d");
  let t = 0;
  function size(){ cv.width = innerWidth; cv.height = innerHeight; }
  size(); addEventListener("resize", size);
  (function draw(){
    cx.clearRect(0,0,cv.width,cv.height);
    const h = cv.height, w = cv.width, hor = h*0.55;
    cx.strokeStyle = "rgba(255,46,136,.45)"; cx.lineWidth = 1;
    for (let i=-20;i<=20;i++){ cx.beginPath(); cx.moveTo(w/2, hor); cx.lineTo(w/2 + i*w/10, h); cx.stroke(); }
    for (let i=0;i<12;i++){ const p = ((i + t) % 12)/12, y = hor + (h-hor)*p*p;
      cx.beginPath(); cx.moveTo(0,y); cx.lineTo(w,y); cx.stroke(); }
    t += 0.012; requestAnimationFrame(draw);
  })();

  // พิมพ์ตำแหน่งงาน
  const roles = ["> IT Support", "> Junior Backend Developer", "> Odoo 17 ERP"];
  const roleEl = document.getElementById("role");
  let r=0, i=0, del=false;
  (function type(){
    const s = roles[r]; roleEl.textContent = s.slice(0,i);
    if (!del && i===s.length){ del=true; return setTimeout(type,1400); }
    if (del && i===0){ del=false; r=(r+1)%roles.length; }
    i += del ? -1 : 1; setTimeout(type, del ? 35 : 80);
  })();

  // แถบทักษะ
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.style.width = e.target.dataset.w+"%"; io.unobserve(e.target); }
  }), {threshold:.5});
  document.querySelectorAll(".bar i").forEach(b => io.observe(b));

  // ===== เพลง =====
  const bgm = document.getElementById("bgm"), btn = document.getElementById("music");
  let mode = "none", ac, synthTimer, playing = false;

  function startSynth(){            // เสียงสังเคราะห์สำรอง กรณีไม่มีไฟล์ music.mp3
    ac = ac || new AudioContext(); ac.resume();
    const notes = [110,110,164.8,146.8,110,110,196,164.8], lead = [440,523,659,523,440,392,440,587];
    let n = 0;
    synthTimer = setInterval(() => {
      const now = ac.currentTime;
      [[notes[n%8],"sawtooth",.09,.22],[lead[n%8],"square",.03,.12]].forEach(([f,type,v,d]) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(v, now); g.gain.exponentialRampToValueAtTime(.0001, now+d);
        o.connect(g).connect(ac.destination); o.start(now); o.stop(now+d);
      });
      n++;
    }, 230);
    mode = "synth";
  }
  function play(){
    playing = true; btn.classList.add("on");
    if (mode === "synth") return startSynth();
    bgm.play().then(()=>mode="file").catch(()=>startSynth());
  }
  function stop(){
    playing = false; btn.classList.remove("on");
    bgm.pause(); clearInterval(synthTimer);
  }
  bgm.addEventListener("error", () => { mode = "synth"; if (playing) startSynth(); });
  btn.onclick = () => playing ? stop() : play();
  document.getElementById("enter").onclick = () => {
    document.getElementById("gate").classList.add("off"); play();
  };