const fs = require('fs');
const path = require('path');
const formidable = require('formidable');  // 上传文件
const formatTime = require('silly-datetime');  // 格式化数据
const crypto = require('crypto');
const Music = require('../dbModel/music')


module.exports = (req, res) => {

    let form = new formidable.IncomingForm();  //创建上传表单
    form.encoding = 'utf-8';  // 设置编码格式
    form.uploadDir = path.join(__dirname, '../static/music'); // 设置上传目录(这个目录必须先创建好)
    form.keepExtensions = true;  // 保留文件后缀名
    form.maxFieldsSize = 20 * 1024 * 1024; // 设置文件大小

    /* 格式化form数据 */
    form.parse(req, (err, fields, files) => {
        let file = files.file;
        const fileContent = fs.readFileSync(files.file.filepath, 'utf8');
        const md5 = crypto.createHash('md5').update(fileContent).digest('hex');
        console.log(md5);

        /* 获取异常 */
        if (err) {
            return res.status(500).json({'status': 500, result: '服务器内部错误'});
        }
        if (file.size > form.maxFieldsSize) {
            fs.unlink(file.path);
            return res.status(412).json({'status': 412, result: '音频不能超过20M'});
        }
        let chunzaiFlag;
        Music.findOne({AudioMD5: md5}).then(hasOne => {
            if (hasOne) {
                // console.log('已存在');
                return res.status(412).json({'status': 412, result: '音频已存在'});
            } else {
                /* 存储后缀名 */
                let extName = '';
                switch (file.mimetype) {
                    case 'audio/mpeg':
                        extName = 'mp3';
                        break;
                    case 'audio/ogg':
                        extName = 'ogg';
                        break;
                }
                if (extName.length == 0) {
                    fs.unlink(file.path, () => {
                    });
                    return res.status(412).json({'status': 412, result: '只支持mp3格式音频'});
                }
                /* 拼接新的文件名 */
                let time = formatTime.format(new Date(), 'YYYYMMDDHHmmss');
                let num = Math.floor(Math.random() * 8999 + 10000);
                let songName = `${time}_${num}.${extName}`;
                let newPath = form.uploadDir + '/' + songName;

                /* 更改名字和路径 */
                fs.rename(file.filepath, newPath, (err) => {
                    if (err) {
                        return res.status(500).json({'status': 500, result: '音频上传失败'});
                    } else {
                        return res.send({'status': 200, 'msg': '音频上传成功', result: {src: songName, AudioMD5: md5}});
                    }
                })
            }
        })


    })
};