function ajax(options){
    options.start && options.start.call('start');
    //执行上传操作
    var xhr = new XMLHttpRequest();
    xhr.open("post", options.url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            returnDate = JSON.parse(xhr.responseText);
            options.success && options.success.call('success', returnDate);
        };
    };
    //表单数据
    var fd = new FormData();
    for (k in options.data) {
        fd.append(k, options.data[k]);
    }
    options.file && fd.append('file', options.file);
    //执行发送
    result = xhr.send(fd);
}
var file = document.getElementById('file'),
    image = document.getElementById('image'),
    form = document.forms.upload_form;

function uploadImage(file){
    ajax({
        url: 'https://up-z2.qiniup.com',
        data: {
            file: file,
            key: form.key.value,
            'x:file_url': form.file_url.value,
            token: form.token.value,
        },
        start: function(){
            console.log('start to upload Image to Qiniu');
        },
        success: function(data){
            // 给表单中的参数赋值
            console.log(data);
            image.src = data.file_url;
        }
    })
}

file.addEventListener('change', function(e){
    var selected_file = e.target.files[0];
    // 先请求服务器获取token
    ajax({
        url: './upload.php',
        data: {
            filename: selected_file.name
        },
        start: function(){
            console.log('start to get uploadToken');
        },
        success: function(data){
            // 给表单中的参数赋值
            form.key.value = data.key;
            form.file_url.value = data.fileurl+"/"+data.key;
            form.token.value = data.token;
            form.info.value = data.info;

            // 执行上传图片操作
            uploadImage(selected_file)
        }
    })
})