// Simple task manager using localStorage
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const empty = document.getElementById('empty');
const search = document.getElementById('search');
const filter = document.getElementById('filter');
const clearBtn = document.getElementById('clear-completed');

let tasks = [];

function save(){ localStorage.setItem('tasks_v1', JSON.stringify(tasks)); }
function load(){ try{ tasks = JSON.parse(localStorage.getItem('tasks_v1')) || []; }catch(e){ tasks=[] } }

function render(){
  list.innerHTML = '';
  const q = search.value.trim().toLowerCase();
  const f = filter.value;
  const visible = tasks.filter(t=>{
    if(q && !t.title.toLowerCase().includes(q)) return false;
    if(f==='active') return !t.done;
    if(f==='completed') return t.done;
    return true;
  });
  if(visible.length===0){
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
  }
  visible.forEach(task=>{
    const li = document.createElement('li');
    li.className = 'task';
    const chk = document.createElement('input');
    chk.type='checkbox';
    chk.checked = task.done;
    chk.addEventListener('change', ()=>{ task.done = chk.checked; save(); render(); });

    const title = document.createElement('div');
    title.className = 'title' + (task.done ? ' completed' : '');
    title.contentEditable = true;
    title.spellcheck = false;
    title.innerText = task.title;
    title.addEventListener('blur', ()=>{ task.title = title.innerText.trim() || task.title; save(); render(); });

    const del = document.createElement('button');
    del.className='icon';
    del.title='Delete';
    del.innerText='🗑';
    del.addEventListener('click', ()=>{
      tasks = tasks.filter(t=>t.id !== task.id); save(); render();
    });

    const edit = document.createElement('button');
    edit.className='icon';
    edit.title='Edit';
    edit.innerText='✏️';
    edit.addEventListener('click', ()=>{
      title.focus();
    });

    li.appendChild(chk);
    li.appendChild(title);
    li.appendChild(edit);
    li.appendChild(del);
    list.appendChild(li);
  });
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const t = input.value.trim();
  if(!t) return;
  tasks.unshift({ id: Date.now().toString(), title: t, done:false });
  input.value='';
  save();
  render();
});

search.addEventListener('input', render);
filter.addEventListener('change', render);
clearBtn.addEventListener('click', ()=>{
  tasks = tasks.filter(t=>!t.done);
  save();
  render();
});

load();
render();
