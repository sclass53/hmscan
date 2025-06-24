const DBNAME="hmscannerdat";
const DCNAME="hmscannerdax";
function readK(st){
    const sname=`${st}`;
    if(!window.localStorage){
        alert("浏览器不支持localstorage!");
        return -1;
    }else{
        const jn=JSON.parse(localStorage.getItem(DBNAME));
        if(sname in jn)return JSON.parse(localStorage.getItem(DBNAME))[sname];
        else return -1;
    }
}

function readC(st){
    const sname=`${st}`;
    if(!window.localStorage){
        alert("浏览器不支持localstorage!");
        return -1;
    }else{
        const jn=JSON.parse(localStorage.getItem(DCNAME));
        if(sname in jn)return JSON.parse(localStorage.getItem(DCNAME))[sname];
        else return -1;
    }
}
function e(){
    var skg=document.getElementById("kl");
    //console.log(document.getElementById("kl"));
    if(localStorage.getItem(DBNAME)==null)localStorage.setItem(DBNAME,"{}");
    if(localStorage.getItem(DCNAME)==null)localStorage.setItem(DCNAME,"{}");

    if(localStorage.getItem(DBNAME)==null && localStorage.getItem(DCNAME)==null){
        skg.innerHTML="暂无知识点, 快去上传题目吧!"
    }else if(localStorage.getItem(DBNAME)=="{}" && localStorage.getItem(DBNAME)=="{}"){
        skg.innerHTML="暂无知识点, 快去上传题目吧!"
    }else{
        const yub=JSON.parse(localStorage.getItem(DBNAME));
        const yuc=JSON.parse(localStorage.getItem(DCNAME));
        var stu=new Set();
        var wyu="<table><tr><th class='lcol'>知识点</th><th>正确率</th><th>正确数</th><th>错误数</th></tr>";
        var tot=0;
        for(var key in yub){
            stu.add(key);
            tot+=yub[key];
        }for(var key in yuc){
            stu.add(key);
            tot+=yuc[key];
        }
        for(let val of stu){
            var sb=readK(val);
            var sc=readC(val);
            console.log(val,sb,sc);
            if(sb==-1)wyu+=`<tr><td class="lcol">${val}</td><td>0%</td><td>0</td><td>${sc}</td></tr>`;
            else if(sc==-1)wyu+=`<tr><td class="lcol">${val}</td><td>100%</td><td>${sb}</td><td>0</td></tr>`;
            else wyu+=`<tr><td class="lcol">${val}</td><td>${Math.round((sb)*1000.0/(sb+sc))/10.0}%</td><td>${sb}</td><td>${sc}</td></tr>`;
        }
        /*
        var val=yu[key];
        wyu+=`<tr><td>${key}</td><td>${val}</td></tr>`;
        */
        wyu+="</table>";
        skg.innerHTML=wyu;
    }
}
function resetData(){
    if(confirm("确定清空数据?")==true){
        localStorage.setItem("hmscannerdat","{}");
        e();
        console.log("Cleared");
    }
}
document.addEventListener("DOMContentLoaded",e);
