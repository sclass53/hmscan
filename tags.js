function e(){
    const DBNAME="hmscannerdat";
    var skg=document.getElementById("kl");
    //console.log(document.getElementById("kl"));
    if(localStorage.getItem(DBNAME)==null){
        skg.innerHTML="暂无知识点, 快去上传题目吧!"
    }else if(localStorage.getItem(DBNAME)=="{}"){
        skg.innerHTML="暂无知识点, 快去上传题目吧!"
    }else{
        const yu=JSON.parse(localStorage.getItem(DBNAME));
        var wyu="<table>";
        for(var key in yu){
            var val=yu[key];
            wyu+=`<tr><td>${key}</td><td>${val}</td></tr>`;
        }
        wyu+="</table>";
        skg.innerHTML=wyu;
    }
}
document.addEventListener("DOMContentLoaded",e);
