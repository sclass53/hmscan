const tok="pat_lxlFBra1XGfDvbGLbELzhbE9C1OcSyBZolRQL7Yn4DpXTuZQKwF4tAapB7RoR7h3"
const DBNAME="hmscannerdat";
var nowK=null;

function toList(st){
    var li=st.split('\n');
    li.shift();
    return li;
}

function writeK(st){
    const sname=`hmscanner${st}`;
    if(!window.localStorage){
        alert("浏览器不支持localstorage!");
    }else{
        if(localStorage.getItem(DBNAME)==null){
            localStorage.setItem(DBNAME,"{}");
        }
        var sjs=JSON.parse(localStorage.getItem(DBNAME));
        if(sname in sjs){
            sjs[sname]+=1;
        }else{
            sjs[sname]=1;
        }
        localStorage.setItem(DBNAME,JSON.stringify(sjs));
    }
}

function readK(st){
    const sname=`hmscanner${st}`;
    if(!window.localStorage){
        alert("浏览器不支持localstorage!");
        return -1;
    }else{
        return JSON.parse(localStorage.getItem(DBNAME))[sname];
    }
}

function Xupload(){
    var ar=new Array();
    for(var x=0;x<nowK.length;x++){
        writeK(nowK[x]);
        var ut=readK(nowK[x]);
        if(ut>=10)ar.push(nowK[x]);
    }if(ar.length!=0){
        alert(`提示: \n\n你已经做了很多 ${ar.join(',')} 的题目了,换一些题目做吧!`)
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const selectButton = document.getElementById('selectButton');
    const fileInput = document.getElementById('fileInput');
    const fileName = document.getElementById('fileName');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const fileSize = document.getElementById('fileSize');
    const fileType = document.getElementById('fileType');
    const fileDimensions = document.getElementById('fileDimensions');
    const uploadFile = document.getElementById('upload');
    var imblob=null;

    // 点击按钮触发文件选择
    selectButton.addEventListener('click', function() {
        fileInput.click();
    });
    
    // 处理文件选择
    uploadFile.addEventListener('click', async function() {
        if(imblob==null){
            alert("还未选择图片!");
            return;
        }
        var txt = document.getElementById("problemInfo");
        txt.innerText="Loading...";
        const formData = new FormData();
        formData.append('file', imblob, 'resolveimage.jpg');

        var resp;
        var hd=new Headers();
        hd.append('Authorization',`Bearer ${tok}`)
        var kresponse= await fetch('https://api.coze.cn/v1/files/upload', {
                method: 'POST',
                headers: hd,
                body: formData
            });
        resp=await kresponse.json();
        
        console.log(resp);
        var imageID=resp["data"]["id"]
        console.log(imageID);
        

        hd.append("Access-Control-Allow-Origin",true);
        var bres=await fetch('https://hmscannerserver.netlify.app/.netlify/functions/getproblem',{
            method: 'POST',
            headers: hd,
            body: `${imageID}`
        });
        resp=await bres.text();
        console.log(resp);
        if(resp=="invalid"){
            txt.innerHTML="照片似乎不是一道题目!";
        }else{
            nowK=toList(resp);
            txt.innerHTML=`<button class='hbutton' onclick='Xupload();'>上传</button><br>${toList(resp).join('\n')}`;
        }
    });

    fileInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            imblob=new Blob([file]);

            // 显示文件名
            fileName.textContent = "";
            
            // 显示文件信息
            fileSize.textContent = `大小: ${formatFileSize(file.size)}`;
            fileType.textContent = `类型: ${file.type}`;
            
            // 创建图片预览
            const reader = new FileReader();
            
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewContainer.style.display = 'block';
                
                // 图片加载后获取尺寸信息
                previewImage.onload = function() {
                    fileDimensions.textContent = `尺寸: ${this.naturalWidth} x ${this.naturalHeight} 像素`;
                };
            };
            
            reader.readAsDataURL(file);
        } else {
            fileName.textContent = '未选择文件';
            previewContainer.style.display = 'none';
        }
    });
    
    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
});