const tok = "pat_lxlFBra1XGfDvbGLbELzhbE9C1OcSyBZolRQL7Yn4DpXTuZQKwF4tAapB7RoR7h3"
const DBNAME = "hmscannerdat";
const DCNAME = "hmscannerdax";
var spck = null;
var uic = null;
var poc = null;
var MathJax = null;
var butn = null;

function readK(st) {
    const sname = `${st}`;
    if (!window.localStorage) {
        alert("浏览器不支持localstorage!");
        return -1;
    } else {
        const jn = JSON.parse(localStorage.getItem(DBNAME));
        if (sname in jn) return JSON.parse(localStorage.getItem(DBNAME))[sname];
        else return -1;
    }
}

function togSolution() {
    butn = document.getElementById("solution");
    var tst = butn.getAttribute("style");
    if (tst == "display: none;") butn.setAttribute("style", "");
    else butn.setAttribute("style", "display: none;");
}

function readC(st) {
    const sname = `${st}`;
    if (!window.localStorage) {
        alert("浏览器不支持localstorage!");
        return -1;
    } else {
        const jn = JSON.parse(localStorage.getItem(DCNAME));
        if (sname in jn) return JSON.parse(localStorage.getItem(DCNAME))[sname];
        else return -1;
    }
}

function writeK(st) {
    const sname = `${st}`;
    if (!window.localStorage) {
        alert("浏览器不支持localstorage!");
    } else {
        if (localStorage.getItem(DBNAME) == null) {
            localStorage.setItem(DBNAME, "{}");
        }
        var sjs = JSON.parse(localStorage.getItem(DBNAME));
        if (sname in sjs) {
            sjs[sname] += 1;
        } else {
            sjs[sname] = 1;
        }
        localStorage.setItem(DBNAME, JSON.stringify(sjs));
    }
}

async function makeProblem() {
    const checkboxes = document.querySelectorAll('input[name="copt"]:checked');
    //console.log(spck,uic);
    if (checkboxes.length == 0) {
        uic.innerText = "你好像还没有选择知识点哦!"
        poc.innerText = "";
        spck.innerHTML = "";
    } else {
        uic.innerHTML = "<h6>出题中...</h6>";
        poc.innerHTML = `<p class="placeholder-glow">
      <span class="placeholder col-9"></span><br>
      <span class="placeholder col-4"></span>
      <span class="placeholder col-6"></span>
      <span class="placeholder col-9"></span><br>
      <span class="placeholder col-8"></span>
    </p>`

        var st = `
        <div class="dropdown">
            <ul class="dropdown-menu">`

        var oli = [];
        for (var i = 0; i < checkboxes.length; i++) {
            st += `<li><span class='dropdown-item'>${checkboxes[i].getAttribute("value")}</span></li>`;
            oli.push(checkboxes[i].getAttribute("value"));
        }
        st += `</ul></div>`;
        spck.innerHTML = st;
        var hd = new Headers();
        hd.append('Authorization', `Bearer ${tok}`);
        try {
            butn = document.getElementById("solution");
            butn.setAttribute("style", "display: none");
        } catch {
            console.log("Element not found!")
        }
        try {
            var bres = await fetch('https://hmscannerserver.netlify.app/.netlify/functions/makeproblem', {
                method: 'POST',
                headers: hd,
                body: `${oli.join('\n')}`
            });
            bres = await bres.text();
            //var bres = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa题解bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
        } catch {
            poc.innerText = "ERR...";
            MathJax.typeset();
            uic.innerHTML = "<h6>网络好像有点问题, 请刷新页面(目前处于测试阶段,大模型服务不稳定,敬请谅解!)!</h6>";
            return;
        }
        var lbi = bres.split('题解');
        poc.innerHTML = lbi[0].replaceAll("题目", "").replaceAll("###", "");
        console.log(lbi[1]);
        poc.innerHTML += `
<br><br>
<div class="alert alert-info" role="alert" id="solution" style="display: none;">
  <h5 class="alert-heading">
        <span class="badge bg-info iconic">i</span>
    题解
    </h5>
  <hr>
  <p id='solute'>${window.md.render(lbi[1]
        .replaceAll('_','\\_')
        .replaceAll('\(','\\(')
        .replaceAll('\)','\\)')
        .replaceAll('\]','\\]')
        .replaceAll('\[','\\['))}</p>
</div>`;
        butn = document.getElementById("solution");
        butn.setAttribute("style", "display: none;");
        spck.innerHTML += `
<button 
    class="btn btn-secondary btn-sm dropdown-toggle" 
    type="button" 
    data-bs-toggle="dropdown" 
    aria-expanded="false"
    >查看知识点...
</button>&nbsp;
<button class="btn btn-sm btn-primary" onclick="togSolution();">
    题解
</button>`;

        window.MathJax.typesetPromise();
        uic.innerHTML = "<h6>...出题完毕!</h6>";
    }
}

function e() {
    console.log("loaded...")
    butn = document.getElementById("solution");
    uic = document.getElementById("uic");
    spck = document.getElementById("probcontent");
    poc = document.getElementById("poc");
    var skg = document.getElementById("klkk");
    //console.log(document.getElementById("kl"));
    if (localStorage.getItem(DBNAME) == null) localStorage.setItem(DBNAME, "{}");
    if (localStorage.getItem(DCNAME) == null) localStorage.setItem(DCNAME, "{}");

    if (localStorage.getItem(DBNAME) == null && localStorage.getItem(DCNAME) == null) {
        skg.innerHTML = "暂无知识点, 快去上传题目吧!"
    } else if (localStorage.getItem(DBNAME) == "{}" && localStorage.getItem(DCNAME) == "{}") {
        skg.innerHTML = "暂无知识点, 快去上传题目吧!"
    } else {
        const yub = JSON.parse(localStorage.getItem(DBNAME));
        const yuc = JSON.parse(localStorage.getItem(DCNAME));
        var stu = new Set();
        var wyu = `
<table class='table'>
    <tr>
        <th class='lcol'>&nbsp;&nbsp;知识点</th>
        <th>正确率</th>
        <th>√</th>
        <th>x</th>
    </tr>`;
        var tot = 0;
        for (var key in yub) {
            stu.add(key);
            tot += yub[key];
        }
        for (var key in yuc) {
            stu.add(key);
            tot += yuc[key];
        }
        for (let val of stu) {
            var sb = readK(val);
            var sc = readC(val);
            //console.log(val,sb,sc);
            if (sb == -1) wyu += `<tr><td class="lcol"><input name="copt" type="checkbox" value="${val}">&nbsp;${val}</input></td><td>0%</td><td>0</td><td>${sc}</td></tr>`;
            else if (sc == -1) wyu += `<tr><td class="lcol"><input name="copt" type="checkbox" value="${val}">&nbsp;${val}</input></td><td>100%</td><td>${sb}</td><td>0</td></tr>`;
            else wyu += `<tr><td class="lcol"><input name="copt" type="checkbox" value="${val}">&nbsp;${val}</input></td><td>${Math.round((sb)*1000.0/(sb+sc))/10.0}%</td><td>${sb}</td><td>${sc}</td></tr>`;
        }
        wyu += "</table>";
        skg.innerHTML = wyu;
    }
}

function resetData() {
    if (confirm("确定清空数据?") == true) {
        localStorage.setItem("hmscannerdat", "{}");
        e();
        console.log("Cleared");
    }
}
document.addEventListener("DOMContentLoaded", e);