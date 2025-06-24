const tok="pat_BxvbBTxy8PwDv43194dK3tb4nCynsLN6X1ooIlGIqZPvysyO8iIXZSLLjaYb7Ev0"

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
    var imblob;

    // 点击按钮触发文件选择
    selectButton.addEventListener('click', function() {
        fileInput.click();
    });
    
    // 处理文件选择
    uploadFile.addEventListener('click', async function() {
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
            txt.innerText="Not a problem!";
        }else{
            txt.innerText=resp;
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
                    fileDimensions.textContent = `尺寸: ${this.naturalWidth} × ${this.naturalHeight} 像素`;
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