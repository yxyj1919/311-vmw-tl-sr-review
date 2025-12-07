const SUMMARY_OPTIONS=[
  "[CX]-Customer opened this SR regarding",
  "[GS]-TSE contact customer to get more details",
  "[GS]-TSE held a Zoom call with Customer to scope the issue",
  "[GS]-TSE requested vm-support for further investigation",
  "[GS]-TSE requested additional details from Customer",
  "[CX]-Customer provided the required data for troubleshooting",
  "[CX]-Customer didn't join the Zoom meeting.",
  "[GS]-TSE delivered the log analysis results",
  "[GS]-TSE reached out to Customer to confirm the latest status",
  "[GS]-TSE reached out to R&D to confirm the latest status",
  "[RD]-A PR was created.",
  "[RD]-RD provided GS with an update"
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
let selectedSummaryId=null;
let selectedNextId=null;

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
  const list=section==="summary"?document.getElementById("summary-list"):document.getElementById("next-list");
  const arr=section==="summary"?summaryEntries:nextEntries;
  list.innerHTML="";
  arr.forEach((e, idx)=>{
    const li=document.createElement("li");
    const selectedId=section==="summary"?selectedSummaryId:selectedNextId;
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
      const target=section==="summary"?summaryEntries:nextEntries;
      const i=target.findIndex(x=>x.id===e.id);
      if(i>=0){target.splice(i,1);} 
      if(section==="summary" && selectedSummaryId===e.id) selectedSummaryId=null;
      if(section==="next" && selectedNextId===e.id) selectedNextId=null;
      renderList(section);
      renderPreview();
    });
    actions.appendChild(del);
    li.appendChild(txt);
    li.appendChild(actions);
    li.addEventListener("click",(ev)=>{
      const t=ev.target && ev.target.tagName ? ev.target.tagName.toLowerCase() : "";
      if(t==="button") return;
      if(section==="summary") selectedSummaryId=e.id; else selectedNextId=e.id;
      renderList(section);
    });
    list.appendChild(li);
  });
}

function moveEntry(section,id,delta){
  const target=section==="summary"?summaryEntries:nextEntries;
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
  const parts=[];
  parts.push("Summary:");
  if(sLines) parts.push(sLines);
  parts.push("");
  parts.push("Next Plan:");
  if(nLines) parts.push(nLines);
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

function clearSection(section){
  if(section==="summary") summaryEntries.length=0; else nextEntries.length=0;
  if(section==="summary") selectedSummaryId=null; else selectedNextId=null;
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
  sd.value=todayISO();
  nd.value=todayISO();
  populateSelect(document.getElementById("summary-fixed"),SUMMARY_OPTIONS);
  populateSelect(document.getElementById("next-fixed"),NEXT_OPTIONS);
  document.getElementById("summary-add").addEventListener("click",()=>addEntry("summary"));
  document.getElementById("next-add").addEventListener("click",()=>addEntry("next"));
  document.getElementById("summary-clear").addEventListener("click",()=>clearSection("summary"));
  document.getElementById("next-clear").addEventListener("click",()=>clearSection("next"));
  document.getElementById("copy-btn").addEventListener("click",copyPreview);
  renderPreview();
});
