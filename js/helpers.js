/* helpers.js — formatting, balances, lookups
   Plain browser JavaScript, no build step. Files share globals and load in the order listed in index.html. */
/* ---------- helpers ---------- */
var nf=new Intl.NumberFormat('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
function box(c){return S.boxes.filter(function(b){return b.code==c;})[0];}
function acc(c){return S.accounts.filter(function(a){return a.code==c;})[0];}
function m(v,cur){return (cur=='USD'?'$ ':'AED ')+nf.format(v);}
function r2(v){return Math.round(v*100)/100;}
function d(s){var p=s.split('-');return p[2]+'/'+p[1]+'/'+p[0];}
function dl(s){return new Date(s+'T00:00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function sgn(v){return v.type=='receipt'?v.amt:-v.amt;}
function posted(v){return v.state=='posted';}
function balance(code,before){var b=box(code).opening;S.vouchers.forEach(function(v){if(v.box==code&&posted(v)&&(!before||v.date<before))b+=sgn(v);});return r2(b);}
function dayTotals(code,date){var i=0,o=0;S.vouchers.forEach(function(v){if(v.box==code&&posted(v)&&v.date==date){if(v.type=='receipt')i+=v.amt;else o+=v.amt;}});return [r2(i),r2(o)];}
function drafts(code,date){return S.vouchers.filter(function(v){return v.box==code&&v.state=='draft'&&(!date||v.date<=date);});}
function closed(date){return !!S.closes[date];}
function lastClose(){var k=Object.keys(S.closes).sort();return k.length?k[k.length-1]:null;}
function sortV(a,b){return a.date<b.date?-1:a.date>b.date?1:a.id-b.id;}
var ST={draft:['text-bg-info','Draft'],posted:['text-bg-success','Posted'],cancel:['text-bg-danger','Cancelled']};
function badge(v){var s=ST[v.state],h='<span class="badge '+s[0]+'">'+s[1]+'</span>';if(v.reversedBy)h+=' <span class="badge text-bg-secondary">Reversed</span>';return h;}
function toast(t){S.toast=t;clearTimeout(toast.t);toast.t=setTimeout(function(){S.toast=null;render();},2600);}
function stone(id){return S.stones.filter(function(x){return x.id==id;})[0];}
function boxOf(cur){return S.boxes.filter(function(b){return b.cur==cur;})[0];}
function lineAmount(l){return r2((+l.price||0)*(1-(+l.disc||0)/100));}
function saleTotal(so){return r2(so.lines.reduce(function(t,l){return t+(l.stone?lineAmount(l):0);},0));}
function productName(st){return st.shape.toUpperCase()+' '+st.ct.toFixed(2)+' '+st.color+' '+st.clarity;}
function nextSaleName(){S.saleSeq++;var n=String(S.saleSeq);while(n.length<4)n='0'+n;return 'CS/2026/'+n;}
function toCollect(cur){return r2(S.sales.filter(function(so){return so.state=='sold'&&so.cur==cur;}).reduce(function(t,so){return t+saleTotal(so);},0));}
function stoneLabel(st){return st.id+' · '+st.shape+' '+st.ct.toFixed(2)+'ct '+st.color+' '+st.clarity;}
var SST={draft:['text-bg-info','Quotation'],sold:['text-bg-warning','Sold · To Collect'],paid:['text-bg-success','Paid'],cancel:['text-bg-danger','Cancelled']};
function cashAccName(b){var a=acc(b.acc);return a.code+' '+a.name;}

