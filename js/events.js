/* events.js — click / input / change handlers
   Plain browser JavaScript, no build step. Files share globals and load in the order listed in index.html. */
/* ---------- events ---------- */
document.addEventListener('click',function(e){
  var n=e.target.closest('[data-nav]');if(n){S.view=n.dataset.nav;S.modal=null;render();return;}
  var t=e.target.closest('[data-act]');if(!t||t.disabled)return;var a=t.dataset.act;
  if(saleAct(a,t))return;
  if(a=='reset'){seed();toast('Sample data restored');render();}
  else if(a=='new'){S.form={data:newVoucher(t.dataset.box,t.dataset.type),dirty:false,err:null,amtText:null};S.view='form';render();}
  else if(a=='openbook'){S.box=t.dataset.box;S.stateFilter=t.dataset.filter||'all';S.q='';S.view='book';render();}
  else if(a=='box'){S.box=t.dataset.box;render();}
  else if(a=='filter'){S.stateFilter=t.dataset.f;render();}
  else if(a=='open'){openForm(S.vouchers.filter(function(v){return v.id==t.dataset.id;})[0]);}
  else if(a=='back'){S.box=S.form.data.box;S.view='book';render();}
  else if(a=='save')saveForm(false);
  else if(a=='post')saveForm(true);
  else if(a=='cancelv'){var v=S.form.data;v.state='cancel';v.log.push({who:'Fatima Rahman',when:'Now',what:'Status: Draft <span class="o_arrow">→</span> <b>Cancelled</b>'});var i=S.vouchers.findIndex(function(x){return x.id==v.id;});S.vouchers[i]=JSON.parse(JSON.stringify(v));toast(v.name+' cancelled');render();}
  else if(a=='todraft'){var v2=S.form.data;v2.state='draft';v2.log.push({who:'Fatima Rahman',when:'Now',what:'Status: Cancelled <span class="o_arrow">→</span> <b>Draft</b>'});var j=S.vouchers.findIndex(function(x){return x.id==v2.id;});S.vouchers[j]=JSON.parse(JSON.stringify(v2));render();}
  else if(a=='print')toast('In Odoo this opens the PDF');
  else if(a=='reverse'){
    var o=S.form.data;if(closed(TODAY)){toast('Today is closed. Reopen the day to reverse.');return;}
    if(o.type=='receipt'&&balance(o.box)-o.amt<0){toast('Not enough cash in the box to reverse this receipt');return;}
    var rv={id:S.nextId++,box:o.box,name:nextName(o.box),date:TODAY,type:o.type=='receipt'?'payment':'receipt',partner:o.partner,acc:o.acc,amt:o.amt,narr:'Reversal of '+o.name,ref:o.name,state:'posted',reversalOf:o.name,log:[{who:'Fatima Rahman',when:'Now',what:'Reversal posted'}]};
    S.vouchers.push(rv);var orig=S.vouchers.filter(function(x){return x.id==o.id;})[0];orig.reversedBy=rv.name;orig.log.push({who:'Fatima Rahman',when:'Now',what:'Reversed by '+rv.name});
    if(orig.saleId){var so0=S.sales.filter(function(x){return x.id==orig.saleId;})[0];if(so0){so0.state='sold';so0.payment=null;so0.log.push({who:'Fatima Rahman',when:'Now',what:'Payment '+orig.name+' reversed. Back to <b>To Collect</b>.'});}}
    openForm(orig);toast('Reversal '+rv.name+' posted');}
  else if(a=='postdrafts'){var bad=[];S.vouchers.filter(function(v){return v.state=='draft'&&v.date<=TODAY;}).sort(sortV).forEach(function(v){var err=validate(v,true);if(err)bad.push(v.name);else{v.state='posted';v.log.push({who:'Fatima Rahman',when:'Now',what:'Status: Draft <span class="o_arrow">→</span> <b>Posted</b>'});}});toast(bad.length?'Could not post: '+bad.join(', '):'All drafts posted');render();}
  else if(a=='den'){S.modal={box:t.dataset.box,q:{}};render();}
  else if(a=='closemodal'){S.modal=null;render();}
  else if(a=='applyden'){var md=S.modal,c=box(md.box).cur,tot=0;DEN[c].forEach(function(v,i){tot+=v*(md.q[i]||0);});S.dc[md.box].text=nf.format(r2(tot));S.modal=null;render();}
  else if(a=='closeday'){
    var rec={by:'Fatima Rahman',verified:'Rohit Shah',rows:{}};
    S.boxes.forEach(function(b){var op=balance(b.code,TODAY),tt=dayTotals(b.code,TODAY),exp=r2(op+tt[0]-tt[1]),cnt=r2(parseFloat(S.dc[b.code].text.replace(/[^0-9.]/g,''))||0),diff=r2(cnt-exp);
      rec.rows[b.code]={exp:exp,cnt:cnt,diff:diff,reason:S.dc[b.code].reason};
      if(diff){S.vouchers.push({id:S.nextId++,box:b.code,name:nextName(b.code),date:TODAY,type:diff>0?'receipt':'payment',partner:'Fatima Rahman',acc:diff>0?S.cfg.diffGain:S.cfg.diffLoss,amt:Math.abs(diff),narr:'Day close difference – '+S.dc[b.code].reason,ref:'DC/2026/10/08',state:'posted',adj:true,log:[{who:'System',when:'Now',what:'Posted by Day Close'}]});}
    });
    S.closes[TODAY]=rec;S.dc={};toast('Day closed');render();}
  else if(a=='reopen'){S.vouchers=S.vouchers.filter(function(v){return !(v.adj&&v.date==TODAY);});var rec2=S.closes[TODAY];delete S.closes[TODAY];S.dc={};S.boxes.forEach(function(b){S.dc[b.code]={text:nf.format(rec2.rows[b.code].cnt),reason:rec2.rows[b.code].reason||''};});toast('Day reopened');render();}
});
document.addEventListener('input',function(e){
  var t=e.target;
  if(t.dataset.input=='q'){S.q=t.value;render();}
  else if(t.dataset.field&&S.form){var v=S.form.data,k=t.dataset.field;S.form.dirty=true;
    if(k=='amt'){S.form.amtText=t.value;v.amt=r2(parseFloat(t.value.replace(/[^0-9.]/g,''))||0);}
    else if(t.type!='radio'){v[k]=t.value;if(k=='type'&&v.acc&&acc(v.acc).use!=v.type)v.acc='';}
    if(k=='narr'||k=='partner'||k=='ref')return; // no re-render while typing text
    render();}
  else if(t.dataset.sfield&&S.sform){var so=S.sform.data;S.sform.dirty=true;if(t.type=='radio')return;so[t.dataset.sfield]=t.value;if(t.dataset.sfield=='partner')return;render();}
  else if(t.dataset.sprice!=null&&S.sform){var i=+t.dataset.sprice;S.sform.ptext[i]=t.value;S.sform.data.lines[i].price=r2(parseFloat(t.value.replace(/[^0-9.]/g,''))||0);S.sform.dirty=true;render();}
  else if(t.dataset.sdisc!=null&&S.sform){var j=+t.dataset.sdisc;S.sform.ptext['d'+j]=t.value;var dv=parseFloat(t.value.replace(/[^0-9.]/g,''))||0;S.sform.data.lines[j].disc=Math.min(100,dv);S.sform.dirty=true;render();}
  else if(t.dataset.sstone!=null&&S.sform){S.sform.data.lines[+t.dataset.sstone].stone=t.value;S.sform.dirty=true;render();}
  else if(t.dataset.dc){S.dc[t.dataset.dc].text=t.value;render();}
  else if(t.dataset.dcr){S.dc[t.dataset.dcr].reason=t.value;render();}
  else if(t.dataset.den!=null&&S.modal){S.modal.q[t.dataset.den]=parseInt(t.value.replace(/\D/g,''),10)||0;render();}
});
document.addEventListener('change',function(e){
  var t=e.target;
  if(t.dataset.sfield&&S.sform){var so=S.sform.data;if(t.type=='radio'||t.type=='date'){so[t.dataset.sfield]=t.value;S.sform.dirty=true;render();}else so[t.dataset.sfield]=t.value;return;}
  if(!t.dataset.field||!S.form)return;var v=S.form.data,k=t.dataset.field;S.form.dirty=true;
  if(k=='type'){v.type=t.value;if(v.acc&&acc(v.acc).use!=v.type)v.acc='';}
  else if(k=='box'||k=='acc'||k=='date'){v[k]=t.value;}
  else{v[k]=t.value;return;}
  render();
});
