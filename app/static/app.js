const SUMMARY_OPTIONS=[
  "[CX] Customer opened the SR regarding",
  "[GS] TSE contacted the customer to scope the SR.",
  "[GS] TSE held a Zoom session with the customer for troubleshooting.",
  "[GS] TSE requested logs/data for further investigation.",
  "[GS] TSE requested additional information from the customer.",
  "[CX] Customer provided the required data for troubleshooting.",
  "[CX] Customer did not join the scheduled Zoom session.",
  "[GS] TSE delivered the log analysis findings to the customer.",
  "[GS] TSE delivered the action plan to the customer.",
  "[GS] TSE followed up with the customer to confirm the latest status.",
  "[GS] TSE consulted with R&D for further clarification.",
  "[RD] A PR was created for this issue.",
  "[RD] R&D provided an update to GS.",
  "[TL] TL took the SR owner.",
  "[TL] An ER was created to push this SR forward."
];
const NEXT_OPTIONS=[
  "[CX]-Awaiting Customer to provide the latest status.",
  "[RD]-Awaiting RD to provide the update",
  "[GS]-TSE will contact Customer to confirm the current status.",
  "[GS]-TSE will contact RD to push the PR forward.",
  "[GS]-TSE will proceed with archive this SR."
];

const summaryEntries=[];
const nextEntries=[];
const tlcEntries=[];
let selectedSummaryId=null;
let selectedNextId=null;
let selectedTlcId=null;

function todayISO(){
  const d=new Date();
  const m=(d.getMonth()+1).toString().padStart(2,"0");
  const day=d.getDate().toString().padStart(2,"0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function populateSelect(sel,options){
  sel.innerHTML="";
  const ph=document.createElement("option");
  ph.value="";
  ph.textContent="Select fixed content";
  sel.appendChild(ph);
  for(const t of options){
    const o=document.createElement("option");
    o.value=t;
    o.textContent=t;
    sel.appendChild(o);
  }
}

function makeEntry(section,date,fixedText,custom){
  return {id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,section,date,fixedText,custom};
}

function formatLine(e){
  const c=(e.custom||"").trim();
  return c?`[${e.date}]- ${e.fixedText} ${c}`:`[${e.date}]- ${e.fixedText}`;
}

function renderList(section){
  const list=
    section==="summary"?document.getElementById("summary-list"):
    section==="next"?document.getElementById("next-list"):
    document.getElementById("tlc-list");
  const arr=
    section==="summary"?summaryEntries:
    section==="next"?nextEntries:
    tlcEntries;
  list.innerHTML="";
  arr.forEach((e, idx)=>{
    const li=document.createElement("li");
    const selectedId=section==="summary"?selectedSummaryId:section==="next"?selectedNextId:selectedTlcId;
    li.className=`entry-item${selectedId===e.id?" selected":""}`;
    const txt=document.createElement("div");
    txt.className="entry-text";
    txt.textContent=formatLine(e);
    const actions=document.createElement("div");
    actions.className="entry-actions";

    const up=document.createElement("button");
    up.textContent="Move Up";
    up.disabled = idx===0;
    up.addEventListener("click",()=>moveEntry(section,e.id,-1));
    actions.appendChild(up);

    const down=document.createElement("button");
    down.textContent="Move Down";
    down.disabled = idx===arr.length-1;
    down.addEventListener("click",()=>moveEntry(section,e.id,1));
    actions.appendChild(down);

    const del=document.createElement("button");
    del.textContent="Delete";
    del.addEventListener("click",()=>{
      const target=section==="summary"?summaryEntries:section==="next"?nextEntries:tlcEntries;
      const i=target.findIndex(x=>x.id===e.id);
      if(i>=0){target.splice(i,1);} 
      if(section==="summary" && selectedSummaryId===e.id) selectedSummaryId=null;
      if(section==="next" && selectedNextId===e.id) selectedNextId=null;
      if(section==="tlc" && selectedTlcId===e.id) selectedTlcId=null;
      renderList(section);
      renderPreview();
    });
    actions.appendChild(del);
    li.appendChild(txt);
    li.appendChild(actions);
    li.addEventListener("click",(ev)=>{
      const t=ev.target && ev.target.tagName ? ev.target.tagName.toLowerCase() : "";
      if(t==="button") return;
      if(section==="summary") selectedSummaryId=e.id; 
      else if(section==="next") selectedNextId=e.id; 
      else selectedTlcId=e.id;
      renderList(section);
    });
    list.appendChild(li);
  });
}

function moveEntry(section,id,delta){
  const target=section==="summary"?summaryEntries:section==="next"?nextEntries:tlcEntries;
  const i=target.findIndex(x=>x.id===id);
  if(i<0) return;
  const j=i+delta;
  if(j<0||j>=target.length) return;
  const tmp=target[i];
  target[i]=target[j];
  target[j]=tmp;
  renderList(section);
  renderPreview();
}

function renderPreview(){
  const sLines=summaryEntries.map(formatLine).join("\n");
  const nLines=nextEntries.map(formatLine).join("\n");
  const tLines=tlcEntries.map(formatLine).join("\n");
  const parts=[];
  parts.push("Summary:");
  if(sLines) parts.push(sLines);
  parts.push("");
  parts.push("Next Plan:");
  if(nLines) parts.push(nLines);
  if(tLines){
    parts.push("");
    parts.push("TL Comment:");
    parts.push(tLines);
  }
  const text=parts.join("\n").trim();
  document.getElementById("preview").value=text;
}

function addEntry(section){
  const date=document.getElementById(section==="summary"?"summary-date":"next-date").value;
  const fixedSel=document.getElementById(section==="summary"?"summary-fixed":"next-fixed");
  const fixedText=fixedSel.value;
  const custom=document.getElementById(section==="summary"?"summary-custom":"next-custom").value;
  if(!date||!fixedText) return;
  const e=makeEntry(section,date,fixedText,custom);
  const target=section==="summary"?summaryEntries:nextEntries;
  const selectedId=section==="summary"?selectedSummaryId:selectedNextId;
  if(selectedId){
    const i=target.findIndex(x=>x.id===selectedId);
    const insertIndex=i>=0?i+1:target.length;
    target.splice(insertIndex,0,e);
  }else{
    target.push(e);
  }
  if(section==="summary") selectedSummaryId=e.id; else selectedNextId=e.id;
  renderList(section);
  renderPreview();
  const customInput=document.getElementById(section==="summary"?"summary-custom":"next-custom");
  if(customInput) customInput.value="";
}

function addTlcEntry(){
  const date=document.getElementById("tlc-date").value;
  const custom=document.getElementById("tlc-custom").value;
  if(!date||!custom.trim()) return;
  const e=makeEntry("tlc",date,"TL Comment:",custom);
  const selectedId=selectedTlcId;
  if(selectedId){
    const i=tlcEntries.findIndex(x=>x.id===selectedId);
    const insertIndex=i>=0?i+1:tlcEntries.length;
    tlcEntries.splice(insertIndex,0,e);
  }else{
    tlcEntries.push(e);
  }
  selectedTlcId=e.id;
  renderList("tlc");
  renderPreview();
  const customInput=document.getElementById("tlc-custom");
  if(customInput) customInput.value="";
}

function clearSection(section){
  if(section==="summary") summaryEntries.length=0; 
  else if(section==="next") nextEntries.length=0; 
  else tlcEntries.length=0;
  if(section==="summary") selectedSummaryId=null; 
  else if(section==="next") selectedNextId=null; 
  else selectedTlcId=null;
  renderList(section);
  renderPreview();
}

function copyPreview(){
  const t=document.getElementById("preview").value;
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(t);
  }else{
    const ta=document.getElementById("preview");
    ta.focus();
    ta.select();
    document.execCommand("copy");
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  const sd=document.getElementById("summary-date");
  const nd=document.getElementById("next-date");
  const td=document.getElementById("tlc-date");
  sd.value=todayISO();
  nd.value=todayISO();
  if(td) td.value=todayISO();
  populateSelect(document.getElementById("summary-fixed"),SUMMARY_OPTIONS);
  populateSelect(document.getElementById("next-fixed"),NEXT_OPTIONS);
  document.getElementById("summary-add").addEventListener("click",()=>addEntry("summary"));
  document.getElementById("next-add").addEventListener("click",()=>addEntry("next"));
  const tlcAdd=document.getElementById("tlc-add");
  if(tlcAdd) tlcAdd.addEventListener("click",addTlcEntry);
  document.getElementById("summary-clear").addEventListener("click",()=>clearSection("summary"));
  document.getElementById("next-clear").addEventListener("click",()=>clearSection("next"));
  const tlcClear=document.getElementById("tlc-clear");
  if(tlcClear) tlcClear.addEventListener("click",()=>clearSection("tlc"));
  document.getElementById("copy-btn").addEventListener("click",copyPreview);
  const saveBtn=document.getElementById("save-btn");
  if(saveBtn){
    saveBtn.addEventListener("click",saveSR);
  }
  const loadBtn=document.getElementById("load-btn");
  if(loadBtn){
    loadBtn.addEventListener("click",loadSR);
  }
  renderPreview();
});

async function saveSR(){
  const sr=document.getElementById("sr-number").value.trim();
  const content=document.getElementById("preview").value;
  if(!sr) return;
  const res=await fetch("/save_sr",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({srNumber:sr,content})
  });
  if(res.ok){
    const data=await res.json();
    alert(data.message||"Saved");
  }
}

async function loadSR(){
  const sr=document.getElementById("load-sr").value.trim();
  if(!sr) return;
  const res=await fetch(`/load_sr?sr=${encodeURIComponent(sr)}`);
  if(res.ok){
    const data=await res.json();
    const txt=data.content||"";
    const area=document.getElementById("loaded-content");
    if(area) area.value=txt;
    const prev=document.getElementById("preview");
    if(prev) prev.value=txt;
  }else{
    const area=document.getElementById("loaded-content");
    if(area) area.value="";
    alert("Not found");
  }
}
