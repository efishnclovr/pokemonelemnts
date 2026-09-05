const T=["Normal","Fire","Water","Electric","Grass","Ice","Fighting","Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"];

const C={
  Normal:{strong:[],weak:["Rock","Steel"],zero:["Ghost"]},
  Fire:{strong:["Grass","Ice","Bug","Steel"],weak:["Fire","Water","Rock","Dragon"],zero:[]},
  Water:{strong:["Fire","Ground","Rock"],weak:["Water","Grass","Dragon"],zero:[]},
  Electric:{strong:["Water","Flying"],weak:["Electric","Grass","Dragon"],zero:["Ground"]},
  Grass:{strong:["Water","Ground","Rock"],weak:["Fire","Grass","Poison","Flying","Bug","Dragon","Steel"],zero:[]},
  Ice:{strong:["Grass","Ground","Flying","Dragon"],weak:["Fire","Water","Ice","Steel"],zero:[]},
  Fighting:{strong:["Normal","Ice","Rock","Dark","Steel"],weak:["Poison","Flying","Psychic","Bug","Fairy"],zero:["Ghost"]},
  Poison:{strong:["Grass","Fairy"],weak:["Poison","Ground","Rock","Ghost"],zero:["Steel"]},
  Ground:{strong:["Fire","Electric","Poison","Rock","Steel"],weak:["Grass","Bug"],zero:["Flying"]},
  Flying:{strong:["Grass","Fighting","Bug"],weak:["Electric","Rock","Steel"],zero:[]},
  Psychic:{strong:["Fighting","Poison"],weak:["Psychic","Steel"],zero:["Dark"]},
  Bug:{strong:["Grass","Psychic","Dark"],weak:["Fire","Fighting","Poison","Flying","Ghost","Steel","Fairy"],zero:[]},
  Rock:{strong:["Fire","Ice","Flying","Bug"],weak:["Fighting","Ground","Steel"],zero:[]},
  Ghost:{strong:["Psychic","Ghost"],weak:["Dark"],zero:["Normal"]},
  Dragon:{strong:["Dragon"],weak:["Steel"],zero:["Fairy"]},
  Dark:{strong:["Psychic","Ghost"],weak:["Fighting","Dark","Fairy"],zero:[]},
  Steel:{strong:["Ice","Rock","Fairy"],weak:["Fire","Water","Electric","Steel"],zero:[]},
  Fairy:{strong:["Fighting","Dragon","Dark"],weak:["Fire","Poison","Steel"],zero:[]}
};

const K={Normal:"#9199a1",Fighting:"#d3425f",Flying:"#8fa8dc",Poison:"#a866c8",Ground:"#e17c3d",Rock:"#c9b57d",Bug:"#87c82a",Ghost:"#586fb4",Steel:"#5d98aa",Fire:"#ff9848",Water:"#4d91d8",Grass:"#61bd57",Electric:"#f4cf38",Psychic:"#f46f73",Ice:"#6bcac0",Dragon:"#1675c4",Dark:"#574f5e",Fairy:"#df78d9"};

// Circular type icon recreations matching the modern Pokémon game style.
const ICON_BASE="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/";

let a="Fire",b=null,slot=1;
const $=s=>document.querySelector(s);

function mult(atk,def){
  const r=C[atk];
  return r.zero.includes(def)?0:r.strong.includes(def)?2:r.weak.includes(def)?0.5:1;
}

function iconUrl(t){
  return `${ICON_BASE}${t.toLowerCase()}.svg`;
}

function icon(t,cl="smallicon"){
  return `<span class="${cl}"><img src="${iconUrl(t)}" alt="${t} type icon" loading="eager"></span>`;
}

function chip(t){
  return `<span class="chip">${icon(t,"mini")}${t}</span>`;
}

function fill(id,arr){
  $(`#${id}`).innerHTML=arr.length?arr.map(chip).join(""):'<span class="empty">None</span>';
}

function renderGrid(){
  $("#typegrid").innerHTML=T.map(t=>`<button type="button" class="typebtn ${t===a||t===b?'selected':''}" data-type="${t}" style="background:${K[t]}">${icon(t,"icon")}<span class="typename">${t}</span></button>`).join("");
  $("#typegrid").querySelectorAll("button").forEach(x=>x.onclick=()=>choose(x.dataset.type));
}

function choose(t){
  if(slot===1){
    a=t;
    if(b===a)b=null;
  }else{
    b=t===a?null:t;
  }
  render();
}

function renderSlots(){
  $("#slot1").classList.toggle("active",slot===1);
  $("#slot2").classList.toggle("active",slot===2);
  $("#slot1name").textContent=a;
  $("#slot1icon").innerHTML=`<img src="${iconUrl(a)}" alt="${a} type icon">`;
  $("#slot2name").textContent=b||"Tap here, then choose a type";
  $("#slot2icon").hidden=!b;
  $("#slot2icon").innerHTML=b?`<img src="${iconUrl(b)}" alt="${b} type icon">`:"";
  $("#clear2").hidden=!b;
}

function renderSummary(){
  $("#summary").innerHTML=`${icon(a,"icon")}<strong>${a}</strong>${b?`<span class="plus">+</span>${icon(b,"icon")}<strong>${b}</strong>`:""}`;
}

function renderStrongWeak(){
  const strong=[...new Set([...C[a].strong,...(b?C[b].strong:[])])].sort((x,y)=>T.indexOf(x)-T.indexOf(y));
  const weak=[];
  T.forEach(t=>{
    const v=mult(t,a)*(b?mult(t,b):1);
    if(v>1)weak.push(t);
  });
  fill("strong",strong);
  fill("weak",weak);
}

function moveCard(t){
  const s=C[t].strong,w=C[t].weak,z=C[t].zero;
  const n=T.filter(x=>!s.includes(x)&&!w.includes(x)&&!z.includes(x));
  return `<article class="attackcard">
    <div class="attackhead">${icon(t,"smallicon")}<span>${t} moves</span></div>
    <div class="groups">
      <div class="group"><h3>Super effective</h3><div class="chips">${s.length?s.map(chip).join(""):'<span class="empty">None</span>'}</div></div>
      <div class="group"><h3>Effective</h3><div class="chips">${n.map(chip).join("")}</div></div>
      <div class="group"><h3>Not very effective</h3><div class="chips">${w.length?w.map(chip).join(""):'<span class="empty">None</span>'}</div></div>
      <div class="group"><h3>No effect</h3><div class="chips">${z.length?z.map(chip).join(""):'<span class="empty">None</span>'}</div></div>
    </div>
  </article>`;
}

function renderOverall(){
  $("#moveSets").innerHTML=moveCard(a)+(b?moveCard(b):"");

  const incomingStrong=[],incomingNeutral=[],incomingResist=[],incomingZero=[];
  T.forEach(t=>{
    const v=mult(t,a)*(b?mult(t,b):1);
    if(v===0)incomingZero.push(t);
    else if(v>1)incomingStrong.push(t);
    else if(v<1)incomingResist.push(t);
    else incomingNeutral.push(t);
  });

  fill("incomingStrong",incomingStrong);
  fill("incomingNeutral",incomingNeutral);
  fill("incomingResist",incomingResist);
  fill("incomingZero",incomingZero);
}

function render(){
  renderSlots();
  renderGrid();
  renderSummary();
  renderStrongWeak();
  renderOverall();
}

$("#slot1").onclick=()=>{slot=1;renderSlots()};
$("#slot2").onclick=()=>{slot=2;renderSlots()};
$("#clear2").onclick=()=>{b=null;slot=1;render()};

render();