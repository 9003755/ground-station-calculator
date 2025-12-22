const navItems=document.querySelectorAll('.nav-item');
const views=document.querySelectorAll('.view');
navItems.forEach(b=>b.addEventListener('click',()=>{navItems.forEach(x=>x.classList.remove('active'));b.classList.add('active');views.forEach(v=>v.classList.remove('active'));document.getElementById(b.dataset.target).classList.add('active');}));

const display=document.getElementById('basic-display');
const exprEl=document.getElementById('basic-expr');
let current='0';
let stored=null;
let op=null;
let expr='';
let justEval=false;
function updateDisplay(){display.textContent=current;exprEl.textContent=expr}
function updateExpr(){if(op!==null&&stored!==null){expr=formatNum(stored)+' '+opSym(op)+' '+formatNum(current)}else{expr=''}}
function inputDigit(d){if(justEval&&op===null){current=d==='.'?'0.':d;expr='';justEval=false;updateDisplay();return}if(d==='.'&&current.includes('.'))return;current=current==='0'&&d!=='.'?d:current+d;updateExpr();updateDisplay()}
function setOp(o){if(op!==null&&stored!==null){evaluate(false)}else{stored=parseFloat(current)}op=o;expr=formatNum(current)+' '+opSym(op);current='0';justEval=false;updateDisplay()}
function clearAll(){current='0';stored=null;op=null;expr='';justEval=false;updateDisplay()}
function back(){if(current.length>1){current=current.slice(0,-1)}else{current='0'}updateExpr();updateDisplay()}
function equals(){if(op===null||stored===null)return;const a=stored;const b=parseFloat(current);const os=op;evaluate(true);op=null;stored=null;expr=formatNum(a)+' '+opSym(os)+' '+formatNum(b)+' =';justEval=true;updateDisplay()}
function evaluate(format){const a=stored;const b=parseFloat(current);let r=0;if(op==='+')r=a+b;else if(op==='-')r=a-b;else if(op==='*')r=a*b;else if(op==='/')r=b===0?NaN:a/b;current=format?format6(r):r.toString();stored=parseFloat(current);expr=formatNum(stored)+' '+opSym(op)}
function sqrt(){const v=parseFloat(current);const res=v<0?NaN:Math.sqrt(v);expr='√('+formatNum(current)+')';current=format6(res);justEval=true;updateDisplay()}
function square(){const v=parseFloat(current);const res=v*v;expr='sqr('+formatNum(current)+')';current=format6(res);justEval=true;updateDisplay()}
document.querySelectorAll('[data-digit]').forEach(b=>b.addEventListener('click',()=>inputDigit(b.dataset.digit)));
document.querySelectorAll('[data-op]').forEach(b=>b.addEventListener('click',()=>setOp(b.dataset.op)));
document.querySelector('[data-action="clear"]').addEventListener('click',clearAll);
document.querySelector('[data-action="back"]').addEventListener('click',back);
document.querySelector('[data-action="equals"]').addEventListener('click',equals);
document.querySelector('[data-action="sqrt"]').addEventListener('click',sqrt);
document.querySelector('[data-action="square"]').addEventListener('click',square);

function format6(x){if(Number.isNaN(x))return 'NaN';if(!Number.isFinite(x))return x.toString();return Number.parseFloat(x.toFixed(6)).toFixed(6)}
function format2(x){if(Number.isNaN(x))return 'NaN';if(!Number.isFinite(x))return x.toString();return Number.parseFloat(x.toFixed(2)).toFixed(2)}
function formatNum(x){return (/^-?\d+(\.\d+)?$/).test(String(x))?String(x):String(x)}
function opSym(o){if(o==='*')return '×';if(o=== '/')return '÷';if(o==='-')return '−';return '+'}

document.querySelectorAll('.tabbar .tab').forEach(t=>t.addEventListener('click',()=>{document.querySelectorAll('.tabbar .tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');const m=t.dataset.triTab;document.getElementById('tri-form-asa').style.display=m==='asa'?'flex':'none';document.getElementById('tri-form-sas').style.display=m==='sas'?'flex':'none';document.getElementById('tri-form-sss').style.display=m==='sss'?'flex':'none'}));
function setTri(A,B,C,a,b,c){const fa=isFinite(A)?format6(A):A;const fb=isFinite(B)?format6(B):B;const fc=isFinite(C)?format6(C):C;const sa=isFinite(a)?format6(a):a;const sb=isFinite(b)?format6(b):b;const sc=isFinite(c)?format6(c):c;document.getElementById('tri-out-A').textContent=fa;document.getElementById('tri-out-B').textContent=fb;document.getElementById('tri-C').textContent=fc;document.getElementById('tri-a').textContent=sa;document.getElementById('tri-b').textContent=sb;document.getElementById('tri-c').textContent=sc}
const triAsaBtn=document.getElementById('tri-asa-calc');
triAsaBtn.addEventListener('click',()=>{const A=parseFloat(document.getElementById('tri-A').value);const B=parseFloat(document.getElementById('tri-B').value);const known=parseFloat(document.getElementById('tri-known-side').value);const knownTag=document.querySelector('input[name="tri-known"]:checked').value;if(!isFinite(A)||!isFinite(B)||!isFinite(known))return;const C=180-(A+B);if(C<=0)return setTri('-', '-', '-', '-', '-', '-');const rA=deg2rad(A),rB=deg2rad(B),rC=deg2rad(C);let a,b,c;let k=0;if(knownTag==='a'){k=known/Math.sin(rA)}else if(knownTag==='b'){k=known/Math.sin(rB)}else{k=known/Math.sin(rC)}a=k*Math.sin(rA);b=k*Math.sin(rB);c=k*Math.sin(rC);setTri(A,B,C,a,b,c)});
const triSasBtn=document.getElementById('tri-sas-calc');
triSasBtn.addEventListener('click',()=>{
  const ang=parseFloat(document.getElementById('tri-sas-angle').value);
  const type=document.querySelector('input[name="tri-sas-angle-type"]:checked').value;
  const s1=parseFloat(document.getElementById('tri-sas-side1').value);
  const s2=parseFloat(document.getElementById('tri-sas-side2').value);
  if(!isFinite(ang)||!isFinite(s1)||!isFinite(s2))return;
  
  let A=NaN,B=NaN,C=NaN;
  let a=NaN,b=NaN,c=NaN;
  const rAng=deg2rad(ang);

  // 映射逻辑：
  // 假设输出顺序总是 A, B, C 和 a, b, c
  // 我们可以固定让 s1 对应 b，s2 对应 c (这是 SAS 时的传统做法，两边夹角为A)
  // 但为了通用性，我们根据输入类型进行不同计算

  if(type==='included') {
    // 夹角模式 (SAS)
    // 设夹角为 A，已知边为 b, c
    A = ang;
    b = s1;
    c = s2;
    // 余弦定理求 a
    a = Math.sqrt(Math.max(0, b*b + c*c - 2*b*c*Math.cos(rAng)));
    if(a <= 0) return setTri('-', '-', '-', '-', '-', '-');
    
    // 余弦定理求 B, C
    B = rad2deg(Math.acos(Math.min(1, Math.max(-1, (a*a + c*c - b*b)/(2*a*c)))));
    C = rad2deg(Math.acos(Math.min(1, Math.max(-1, (a*a + b*b - c*c)/(2*a*b)))));
  } else if (type==='side1') {
    // 边1对角模式 (SSA)
    // 已知角为 A，边1为 a，边2为 b
    // 即 a = s1, b = s2, A = ang
    A = ang;
    a = s1;
    b = s2;
    
    // 正弦定理求 sinB = b * sinA / a
    const sinB = b * Math.sin(rAng) / a;
    
    // 简单判断无解情况
    if (sinB > 1) return setTri('无解', '-', '-', '-', '-', '-');
    
    // 计算 B 的主值
    const B1 = Math.asin(sinB); // 弧度
    const B1_deg = rad2deg(B1);
    
    // SSA 可能有两解，这里我们先取通常解（锐角或钝角需判断）
    // 简单的单一解逻辑：
    // 若 a >= b，只有一解 B1
    // 若 a < b，可能有两解：B1 和 180-B1
    
    // 这里为简化显示，暂时只计算一种最常见的情况（锐角解），或者如果用户需要可以扩展显示多解
    // 根据需求“自动算出另一条边和另外两个角”，我们尽量给出一个有效解。
    
    B = B1_deg;
    C = 180 - A - B;
    if (C <= 0) {
      // 尝试钝角解
      B = 180 - B1_deg;
      C = 180 - A - B;
      if (C <= 0) return setTri('无解', '-', '-', '-', '-', '-');
    }
    
    // 正弦定理求 c
    // c / sinC = a / sinA
    c = a * Math.sin(deg2rad(C)) / Math.sin(rAng);
    
  } else {
    // 边2对角模式 (SSA)
    // 已知角为 A，边1为 b，边2为 a
    // 即 a = s2, b = s1, A = ang
    // 对称处理，交换 s1, s2 即可复用上面的逻辑
    A = ang;
    a = s2;
    b = s1;
    
    const sinB = b * Math.sin(rAng) / a;
    if (sinB > 1) return setTri('无解', '-', '-', '-', '-', '-');
    
    const B1 = Math.asin(sinB);
    const B1_deg = rad2deg(B1);
    
    B = B1_deg;
    C = 180 - A - B;
    if (C <= 0) {
      B = 180 - B1_deg;
      C = 180 - A - B;
      if (C <= 0) return setTri('无解', '-', '-', '-', '-', '-');
    }
    c = a * Math.sin(deg2rad(C)) / Math.sin(rAng);
    
    // 恢复原来的边对应关系显示
    // 上面逻辑中，我们假设了 s2 是对边 a，s1 是邻边 b
    // 输出时，tri-a 显示的是对边，tri-b 显示的是邻边
    // 我们的 setTri 接口是 (A, B, C, a, b, c)
    // 为了让用户理解，我们需要明确：
    // 角A 是输入角，角B 是计算出的另一个角，角C 是第三个角
    // 边a 是角A对边，边b 是角B对边，边c 是角C对边
    // 在这个分支里：a 是 s2, b 是 s1。
    // 所以调用 setTri 时，传入的 a 应该是 s2, b 应该是 s1。
  }

  setTri(A, B, C, a, b, c);
});
const triSssBtn=document.getElementById('tri-sss-calc');
triSssBtn.addEventListener('click',()=>{const a=parseFloat(document.getElementById('tri-sss-a').value);const b=parseFloat(document.getElementById('tri-sss-b').value);const c=parseFloat(document.getElementById('tri-sss-c').value);if(!isFinite(a)||!isFinite(b)||!isFinite(c))return;if(a<=0||b<=0||c<=0)return;if(a+b<=c||a+c<=b||b+c<=a)return setTri('-', '-', '-', a,b,c);const A=rad2deg(Math.acos(Math.min(1,Math.max(-1,(b*b+c*c-a*a)/(2*b*c)))));const B=rad2deg(Math.acos(Math.min(1,Math.max(-1,(a*a+c*c-b*b)/(2*a*c)))));const C=rad2deg(Math.acos(Math.min(1,Math.max(-1,(a*a+b*b-c*c)/(2*a*b)))));setTri(A,B,C,a,b,c)});
function deg2rad(d){return d*Math.PI/180}
function rad2deg(r){return r*180/Math.PI}

const bBtn=document.getElementById('bearing-calc');
bBtn.addEventListener('click',()=>{const ab=parseFloat(document.getElementById('bearing-ab').value);if(!isFinite(ab))return;const ba=((ab+180)%360+360)%360;document.getElementById('bearing-ba').textContent=format2(ba)});

const geoBtn=document.getElementById('geo-calc');
geoBtn.addEventListener('click',()=>{const lat1=parseFloat(document.getElementById('geo-lat1').value);const lon1=parseFloat(document.getElementById('geo-lon1').value);const lat2=parseFloat(document.getElementById('geo-lat2').value);const lon2=parseFloat(document.getElementById('geo-lon2').value);if([lat1,lon1,lat2,lon2].some(v=>!isFinite(v)))return;const d=distanceMeters(lat1,lon1,lat2,lon2);const b1=bearingAB(lat1,lon1,lat2,lon2);const b2=bearingAB(lat2,lon2,lat1,lon1);document.getElementById('geo-dist').textContent=format2(d);document.getElementById('geo-bearing-ab').textContent=format2(b1);document.getElementById('geo-bearing-ba').textContent=format2(b2)});
const geoClr=document.getElementById('geo-clear');
if(geoClr){geoClr.addEventListener('click',()=>{document.getElementById('geo-lat1').value='';document.getElementById('geo-lon1').value='';document.getElementById('geo-lat2').value='';document.getElementById('geo-lon2').value='';})}
function distanceMeters(lat1,lon1,lat2,lon2){const R=6371000;const r1=deg2rad(lat1),r2=deg2rad(lat2);const dlat=deg2rad(lat2-lat1),dlon=deg2rad(lon2-lon1);const a=Math.sin(dlat/2)**2+Math.cos(r1)*Math.cos(r2)*Math.sin(dlon/2)**2;const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));return R*c}
function bearingAB(lat1,lon1,lat2,lon2){const r1=deg2rad(lat1),r2=deg2rad(lat2);let dlon=deg2rad(lon2-lon1);const dpsi=Math.log(Math.tan(Math.PI/4+r2/2)/Math.tan(Math.PI/4+r1/2));if(Math.abs(dlon)>Math.PI)dlon=dlon>0?-(2*Math.PI-dlon):(2*Math.PI+dlon);let br=rad2deg(Math.atan2(dlon,dpsi));br=(br%360+360)%360;return br}

const ocrArea=document.getElementById('ocr-area');
const ocrOut=document.getElementById('ocr-output');
function setDragState(s){if(!ocrArea)return;ocrArea.classList.toggle('drag',s)}
function isFilledA(){const la=document.getElementById('geo-lat1').value;const lo=document.getElementById('geo-lon1').value;return isFinite(parseFloat(la))&&isFinite(parseFloat(lo))}
function isFilledB(){const la=document.getElementById('geo-lat2').value;const lo=document.getElementById('geo-lon2').value;return isFinite(parseFloat(la))&&isFinite(parseFloat(lo))}
function fillPairTo(target,p){if(target==='A'){document.getElementById('geo-lat1').value=Number.parseFloat(p.lat).toFixed(8);document.getElementById('geo-lon1').value=Number.parseFloat(p.lon).toFixed(8)}else{document.getElementById('geo-lat2').value=Number.parseFloat(p.lat).toFixed(8);document.getElementById('geo-lon2').value=Number.parseFloat(p.lon).toFixed(8)}}
function fillAB(pairs){if(!pairs||pairs.length===0)return;const valid=pairs.filter(p=>isFinite(p.lat)&&isFinite(p.lon));if(valid.length===0)return;const aDone=isFilledA();const bDone=isFilledB();if(!aDone&&!bDone&&valid.length>=2){fillPairTo('A',valid[0]);fillPairTo('B',valid[1]);if(ocrOut)ocrOut.textContent='已填入A/B点，可直接计算';return}if(!aDone){fillPairTo('A',valid[0]);if(ocrOut)ocrOut.textContent='已填入A点，请继续粘贴B点图片';return}if(!bDone){fillPairTo('B',valid[0]);if(ocrOut)ocrOut.textContent='已填入B点，可直接计算';return}if(ocrOut)ocrOut.textContent='A/B点已完成，可直接计算'}
function parseDMS(h, m, s, dir){let val=Number(h)+Number(m)/60+Number(s)/3600;if(dir==='S'||dir==='W')val=-val;return val}
function parseTextToPairs(t){const pairs=[];let txt=String(t||'');txt=txt.replace(/[↔→←]/g,' ').replace(/\s+/g,' ').trim();let m;let reLabel1=/纬度[^\d-]*(-?\d+(?:\.\d+)?)[^\d-]*经度[^\d-]*(-?\d+(?:\.\d+)?)/gi;while((m=reLabel1.exec(txt))){pairs.push({lat:Number(m[1]),lon:Number(m[2])})}
let reLabel2=/经度[^\d-]*(-?\d+(?:\.\d+)?)[^\d-]*纬度[^\d-]*(-?\d+(?:\.\d+)?)/gi;while((m=reLabel2.exec(txt))){pairs.push({lat:Number(m[2]),lon:Number(m[1])})}
let lonSingles=[], latSingles=[];let reLon=/经度[^\d-]*(-?\d+(?:\.\d+)?)/gi;while((m=reLon.exec(txt))){lonSingles.push(Number(m[1]))}
let reLat=/纬度[^\d-]*(-?\d+(?:\.\d+)?)/gi;while((m=reLat.exec(txt))){latSingles.push(Number(m[1]))}
for(let i=0;i<Math.min(latSingles.length,lonSingles.length)&&pairs.length<2;i++){pairs.push({lat:latSingles[i],lon:lonSingles[i]})}
const reCard=/([NS])\s*(\d+)\D+(\d+)\D+(\d+(?:\.\d+)?)\D*([EW])\s*(\d+)\D+(\d+)\D+(\d+(?:\.\d+)?)/gi;while((m=reCard.exec(txt))){pairs.push({lat:parseDMS(m[2],m[3],m[4],m[1]),lon:parseDMS(m[6],m[7],m[8],m[5])})}
const reDec=/([NS]?)[^\d-]*(-?\d+(?:\.\d+)?)[^\d-]*[,;\s]+([EW]?)[^\d-]*(-?\d+(?:\.\d+)?)/gi;while((m=reDec.exec(txt))){let a=Number(m[2]);let b=Number(m[4]);let lat=a;let lon=b;if(!m[1]&&!m[3]){if(Math.abs(a)>90&&Math.abs(b)<=90){lon=a;lat=b}else if(Math.abs(a)<=90&&Math.abs(b)>90){lat=a;lon=b}else{continue}}else{if(m[1]==='S')lat=-Math.abs(lat);if(m[1]==='N')lat=Math.abs(lat);if(m[3]==='W')lon=-Math.abs(lon);if(m[3]==='E')lon=Math.abs(lon)}pairs.push({lat,lon})}
if(pairs.length===0){const nums=(txt.match(/-?\d+(?:\.\d+)?/g)||[]).map(Number).filter(n=>Number.isFinite(n)&&Math.abs(n)<=180);let lat=null,lon=null;for(const n of nums){if(Math.abs(n)<=90){lat=n;break}}for(const n of nums){if(n!==lat&&Math.abs(n)<=180){lon=n;break}}if(lat!==null&&lon!==null){pairs.push({lat,lon})}}
return pairs.filter(p=>isFinite(p.lat)&&isFinite(p.lon)).slice(0,2)
}
let ocrBusy=false;
async function downscaleImage(blob){try{const bmp=await createImageBitmap(blob);const maxW=1000;const scale=Math.min(1,maxW/bmp.width);const w=Math.max(1,Math.floor(bmp.width*scale));const h=Math.max(1,Math.floor(bmp.height*scale));const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.drawImage(bmp,0,0,w,h);return await new Promise(res=>c.toBlob(b=>res(b),'image/png',0.92))}catch{return blob}}
async function recognizeOnce(image, lang){return await Tesseract.recognize(image,lang,{logger:m=>{if(m&&typeof m.progress==='number'){ocrOut.textContent='正在识别 '+Math.round(m.progress*100)+'%'}}})}
async function recognizeFromBlob(blob){if(!window.Tesseract){ocrOut.textContent='无法加载OCR';return}if(ocrBusy)return;ocrBusy=true;ocrOut.textContent='正在识别 0%';const scaled=await downscaleImage(blob);const url=URL.createObjectURL(scaled);const mkTimeout=(ms)=>new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms));try{let r=await Promise.race([recognizeOnce(url,'eng'),mkTimeout(25000)]);let txt=r&&r.data&&r.data.text?r.data.text:'';let pairs=parseTextToPairs(txt||'');if(!pairs||pairs.length===0){r=await Promise.race([recognizeOnce(url,'eng+chi_sim'),mkTimeout(25000)]);txt=r&&r.data&&r.data.text?r.data.text:'';pairs=parseTextToPairs(txt||'')}
if(pairs&&pairs.length>0){ocrOut.textContent='识别完成';fillAB(pairs)}else{ocrOut.textContent=txt?txt:'未识别到经纬度'}
}catch(e){ocrOut.textContent='识别失败或超时'}finally{ocrBusy=false;URL.revokeObjectURL(url)}}
const pasteDefault='在此处粘贴或拖拽图片，自动识别经纬度';
const pasteFocus='按 Ctrl+V 粘贴截图';
if(ocrArea){ocrArea.addEventListener('click',()=>{ocrArea.focus()});
ocrArea.addEventListener('focus',()=>{ocrArea.classList.add('active');ocrArea.textContent=pasteFocus});
ocrArea.addEventListener('blur',()=>{ocrArea.classList.remove('active');ocrArea.textContent=pasteDefault});
ocrArea.addEventListener('paste',e=>{const items=e.clipboardData&&e.clipboardData.items?e.clipboardData.items:[];let found=false;for(const it of items){if(it.type&&it.type.startsWith('image/')){const f=it.getAsFile();recognizeFromBlob(f);found=true;break}}if(!found){ocrOut.textContent='剪贴板中没有图片'}});
ocrArea.addEventListener('dragover',e=>{e.preventDefault();setDragState(true)});
ocrArea.addEventListener('dragleave',()=>setDragState(false));
ocrArea.addEventListener('drop',e=>{e.preventDefault();setDragState(false);const files=e.dataTransfer&&e.dataTransfer.files?e.dataTransfer.files:[];if(files.length>0){recognizeFromBlob(files[0])}})}
if(ocrOut){
  ocrOut.textContent='正在加载OCR...';
  const t=setInterval(()=>{
    if(window.__ocrLoaded||window.Tesseract){ocrOut.textContent='OCR已加载，可粘贴或拖拽图片';clearInterval(t)}
    else if(window.__ocrLoadError){ocrOut.textContent='无法加载OCR，请检查网络'}
  },500);
}

const sBtn=document.getElementById('speed-calc');
sBtn.addEventListener('click',()=>{const v=parseFloat(document.getElementById('speed-value').value);const unit=document.getElementById('speed-unit').value;if(!isFinite(v))return;let kmh=0;if(unit==='kmh'||unit==='kmh2'){kmh=v}else if(unit==='ms'){kmh=v*3.6}else if(unit==='kmmin'){kmh=v*60}else{kmh=v*0.06}const ms=kmh/3.6;const kmmin=kmh/60;const mmin=ms*60;setSpeed(format2(kmh),format2(ms),format2(kmmin),format2(mmin))});
function setSpeed(kmh,ms,kmmin,mmin){document.getElementById('out-kmh').textContent=kmh;document.getElementById('out-ms').textContent=ms;document.getElementById('out-kmmin').textContent=kmmin;document.getElementById('out-mmin').textContent=mmin}

window.addEventListener('keydown',e=>{const active=document.querySelector('.view.active');if(active&&active.id==='calc-basic'){if(e.key.match(/^\d$/))inputDigit(e.key);else if(e.key==='.'||e.key==='Decimal')inputDigit('.');else if(e.key==='+')setOp('+');else if(e.key==='-')setOp('-');else if(e.key==='*')setOp('*');else if(e.key==='/')setOp('/');else if(e.key==='Enter')equals();else if(e.key==='Backspace')back()} });
