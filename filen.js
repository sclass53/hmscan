var cameraVideo = document.getElementById("camera-video")
var cameraStream,base64_photo;
var photo = document.getElementById('show-photo');

var tok="pat_BxvbBTxy8PwDv43194dK3tb4nCynsLN6X1ooIlGIqZPvysyO8iIXZSLLjaYb7Ev0"
var txt=document.getElementById("showtext");
// const apiClient = new CozeAPI({
//     token: tok,
//     baseURL: 'https://api.coze.cn',
//     allowPersonalAccessTokenInBrowser: true
//   });

/**
 * 开启摄像头
 */
function openCamera() {
    photo.src = '';
    cameraVideo.style.display = 'block';
    var constraints = {
        audio: false, //音频轨道
        video: {
            width: {
                min: 1280,
                ideal: 1920,
                max: 2560,
            },
            height: {
                min: 720,
                ideal: 1080,
                max: 1440,
            },
        },
        facingMode: "environment"
    }
    var mediaPromise = navigator.mediaDevices.getUserMedia(constraints);
    mediaPromise.then(function(stream) {
        console.log("----11");
        /* 使用这个stream stream */
        cameraStream = stream;
        cameraVideo.srcObject = stream;
        cameraVideo.play();
    }).catch(function(err) {
        /* 处理error */
        console.log("----22");
        alert(err);
    });
}

/**
 * 拍照
 */
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
async function getPhoto() {
    var canvas = document.querySelector('#camera-canvas');
    //获取 `canvas`元素，根据`cameraVideo`中的数据进行图片绘制 `ctx.drawImage()`；
    var ctx = canvas.getContext('2d');
    ctx.drawImage(cameraVideo, 0, 0, 300, 300);
    //将 `canvas`绘制的图片信息，展示在 `img`标签中；
    photo.src=canvas.toDataURL("image/jpg");
    const imageBlob = dataURLtoBlob(photo.src);
            
    const formData = new FormData();
    formData.append('file', imageBlob, 'resolveimage.jpg');
            
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
    
    setTimeout(function(){
        closeCamera();
    }, 100)

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
}

/**
 * 关闭摄像头
 */
function closeCamera() {
    cameraStream.getTracks().forEach(function(track) {
        track.stop();
    });
    cameraVideo.style.display = 'none';
}

/**
 * 获取base64照片
 * @param {Object} base64Data
 * @param {Object} fileName
 */