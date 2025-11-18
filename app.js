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

const triBtn=document.getElementById('tri-calc');
triBtn.addEventListener('click',()=>{const A=parseFloat(document.getElementById('tri-A').value);const B=parseFloat(document.getElementById('tri-B').value);const known=parseFloat(document.getElementById('tri-known-side').value);const knownTag=document.querySelector('input[name="tri-known"]:checked').value;if(!isFinite(A)||!isFinite(B)||!isFinite(known))return;const C=180-(A+B);if(C<=0)return setTri('-', '-', '-', '-');const rA=deg2rad(A),rB=deg2rad(B),rC=deg2rad(C);let a,b,c;let k=0;if(knownTag==='a'){k=known/Math.sin(rA)}else if(knownTag==='b'){k=known/Math.sin(rB)}else{k=known/Math.sin(rC)}a=k*Math.sin(rA);b=k*Math.sin(rB);c=k*Math.sin(rC);setTri(format6(C),format6(a),format6(b),format6(c))});
function setTri(C,a,b,c){document.getElementById('tri-C').textContent=C;document.getElementById('tri-a').textContent=a;document.getElementById('tri-b').textContent=b;document.getElementById('tri-c').textContent=c}
function deg2rad(d){return d*Math.PI/180}
function rad2deg(r){return r*180/Math.PI}

const bBtn=document.getElementById('bearing-calc');
bBtn.addEventListener('click',()=>{const ab=parseFloat(document.getElementById('bearing-ab').value);if(!isFinite(ab))return;const ba=((ab+180)%360+360)%360;document.getElementById('bearing-ba').textContent=format2(ba)});

const geoBtn=document.getElementById('geo-calc');
geoBtn.addEventListener('click',()=>{const lat1=parseFloat(document.getElementById('geo-lat1').value);const lon1=parseFloat(document.getElementById('geo-lon1').value);const lat2=parseFloat(document.getElementById('geo-lat2').value);const lon2=parseFloat(document.getElementById('geo-lon2').value);if([lat1,lon1,lat2,lon2].some(v=>!isFinite(v)))return;const d=distanceMeters(lat1,lon1,lat2,lon2);const b1=bearingAB(lat1,lon1,lat2,lon2);const b2=bearingAB(lat2,lon2,lat1,lon1);document.getElementById('geo-dist').textContent=format2(d);document.getElementById('geo-bearing-ab').textContent=format2(b1);document.getElementById('geo-bearing-ba').textContent=format2(b2)});
function distanceMeters(lat1,lon1,lat2,lon2){const R=6371000;const r1=deg2rad(lat1),r2=deg2rad(lat2);const dlat=deg2rad(lat2-lat1),dlon=deg2rad(lon2-lon1);const a=Math.sin(dlat/2)**2+Math.cos(r1)*Math.cos(r2)*Math.sin(dlon/2)**2;const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));return R*c}
function bearingAB(lat1,lon1,lat2,lon2){const r1=deg2rad(lat1),r2=deg2rad(lat2);const dlon=deg2rad(lon2-lon1);const y=Math.sin(dlon)*Math.cos(r2);const x=Math.cos(r1)*Math.sin(r2)-Math.sin(r1)*Math.cos(r2)*Math.cos(dlon);let br=rad2deg(Math.atan2(y,x));br=(br%360+360)%360;return br}

const sBtn=document.getElementById('speed-calc');
sBtn.addEventListener('click',()=>{const v=parseFloat(document.getElementById('speed-value').value);const unit=document.getElementById('speed-unit').value;if(!isFinite(v))return;let kmh=0;if(unit==='kmh'||unit==='kmh2'){kmh=v}else if(unit==='ms'){kmh=v*3.6}else if(unit==='kmmin'){kmh=v*60}else{kmh=v*0.06}const ms=kmh/3.6;const kmmin=kmh/60;const mmin=ms*60;setSpeed(format2(kmh),format2(ms),format2(kmmin),format2(mmin))});
function setSpeed(kmh,ms,kmmin,mmin){document.getElementById('out-kmh').textContent=kmh;document.getElementById('out-ms').textContent=ms;document.getElementById('out-kmmin').textContent=kmmin;document.getElementById('out-mmin').textContent=mmin}

window.addEventListener('keydown',e=>{const active=document.querySelector('.view.active');if(active&&active.id==='calc-basic'){if(e.key.match(/^\d$/))inputDigit(e.key);else if(e.key==='.'||e.key==='Decimal')inputDigit('.');else if(e.key==='+')setOp('+');else if(e.key==='-')setOp('-');else if(e.key==='*')setOp('*');else if(e.key==='/')setOp('/');else if(e.key==='Enter')equals();else if(e.key==='Backspace')back()} });