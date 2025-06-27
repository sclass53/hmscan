const tok = "pat_lxlFBra1XGfDvbGLbELzhbE9C1OcSyBZolRQL7Yn4DpXTuZQKwF4tAapB7RoR7h3"
const DBNAME = "hmscannerdat";
const DCNAME = "hmscannerdax"
var nowK = null;

function toList(st) {
    var li = st.split('\n');
    li.shift();
    return li;
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

function writeC(st) {
    const sname = `${st}`;
    if (!window.localStorage) {
        alert("浏览器不支持localstorage!");
    } else {
        if (localStorage.getItem(DCNAME) == null) {
            localStorage.setItem(DCNAME, "{}");
        }
        var sjs = JSON.parse(localStorage.getItem(DCNAME));
        if (sname in sjs) {
            sjs[sname] += 1;
        } else {
            sjs[sname] = 1;
        }
        localStorage.setItem(DCNAME, JSON.stringify(sjs));
    }
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

function Xupload() {
    var ar = new Array();
    for (var x = 0; x < nowK.length; x++) {
        writeK(nowK[x]);
        var ut = readK(nowK[x]);
        if (ut >= 15) ar.push(nowK[x]);
    }
    if (ar.length != 0) {
        alert(`提示: \n\n你已经做了很多 ${ar.join(',')} 的题目了, 换一些题目做吧!`);
    } else {
        alert('上传成功!');
    }
    location.href = "./index.html";
}

function Cupload() {
    var ar = new Array();
    for (var x = 0; x < nowK.length; x++) {
        writeC(nowK[x]);
        var ut = readC(nowK[x]);
        if (ut >= 15) ar.push(nowK[x]);
    }
    if (ar.length != 0) {
        alert(`提示: \n\n你已经做了很多 ${ar.join(',')} 的题目了, 换一些题目做吧!`);
    } else {
        alert('上传成功!');
    }
    location.href = "./index.html";
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
    var imblob = null;
    var spn = document.getElementById("spn");

    // 点击按钮触发文件选择
    selectButton.addEventListener('click', function() {
        fileInput.click();
    });

    // 处理文件选择
    uploadFile.addEventListener('click', async function() {
        uploadFile.setAttribute("style", "display: none");
        if (imblob == null) {
            alert("还未选择图片!");
            return;
        }
        var txt = document.getElementById("problemInfo");
        txt.innerHTML = `<p class="placeholder-glow">
      <span class="placeholder col-3"></span><br>
      <span class="placeholder col-4"></span>
      <span class="placeholder col-6"></span>
      <span class="placeholder col-8"></span>
    </p>`;
        spn.setAttribute("style", "");
        const formData = new FormData();
        formData.append('file', imblob, 'resolveimage.jpg');

        var resp;
        try {
            var hd = new Headers();
            hd.append('Authorization', `Bearer ${tok}`)
            var kresponse = await fetch('https://api.coze.cn/v1/files/upload', {
                method: 'POST',
                headers: hd,
                body: formData
            });
            resp = await kresponse.json();

            console.log(resp);
            var imageID = resp["data"]["id"]
            console.log(imageID);


            var bres = await fetch('https://hmscannerserver.netlify.app/.netlify/functions/getproblem', {
                method: 'POST',
                headers: hd,
                body: `${imageID}`
            });
            resp = await bres.text();
            console.log(resp);
            //var resp = "invalid";
        } catch {
            txt.innerHTML = "网络好像出问题了, 请尝试刷新页面!";
            spn.setAttribute("style", "display: none;");
            uploadFile.setAttribute("style", "");
            return;
        }
        if (resp == "invalid") {
            txt.innerHTML = "照片似乎不是一道题目!";
            spn.setAttribute("style", "display: none;");
            uploadFile.setAttribute("style", "");
        } else {
            nowK = toList(resp);
            txt.innerHTML = `<div class='btn-group'><button class='btn btn-success btn-sm' onclick='Xupload();'>做对了</button><button class='btn btn-danger btn-sm' onclick='Cupload();'>做错了</button></div><br><br>${toList(resp).join('<br>')}`;
            spn.setAttribute("style", "display: none;");
            uploadFile.setAttribute("style", "");
        }
    });

    fileInput.addEventListener('change', function(e) {
        spn.setAttribute("style", "display: none;");
        if (this.files && this.files[0]) {
            const file = this.files[0];
            imblob = new Blob([file]);

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
            uploadFile.setAttribute("style", "");
            reader.readAsDataURL(file);
        } else {
            fileName.textContent = '未选择文件';
            previewContainer.style.display = 'none';
            uploadFile.setAttribute("style", "display: none");
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