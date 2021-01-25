const { Buffer } = require('buffer');
const fs = require('fs')
var os = require('os');

var path = os.homedir() + '\\Desktop\\sycm\\';

function arriveData(req, res) {

    const urlList = ['live/index/overview.json?sellerType=online', 'live/index/trend.json?sellerType=online', 'portal/month/overview.json?']
    const pathList = ['overview.json', 'trend.json', 'overview_range.json']

    const { ruleValue } = req.originalReq;

    const { url } = req.originalReq;

    const index = urlList.findIndex(item => {
        return url.indexOf(item) > -1
    })



    if (index > -1) {
        console.log(url)
        const filePath = path + pathList[index]
        const result = fs.readFileSync(filePath).toString()
        const rep = JSON.parse(result)
            //  console.log(rep)

        // 简单处理，不支持各种编码，省得对响应内容进行解码
        delete req.headers['accept-encoding'];
        const client = req.request((svrRes) => {
            // 由于内容长度可能有变，删除长度自动改成 chunked
            var curValue = ''



            delete svrRes.headers['content-length'];
            res.writeHead(svrRes.statusCode, svrRes.headers);

            var body;

            svrRes.on('data', data => {
                body = body ? Buffer.concat([body, data]) : data;

            });



            svrRes.on('end', () => {
                if (body) {
                    curValue = body.toString()
                        //console.log(curValue)
                    var obj = JSON.parse(curValue)
                        //  console.log(obj)
                    console.log(index)
                    if (index <= 1) {
                        obj.content.data.data = rep
                    }
                    if (index == 2) {
                        obj.content.data = rep
                    }
                    res.end(JSON.stringify(obj));
                } else {
                    res.end();
                }


            });

        });
        req.pipe(client);

    } else {
        req.passThrough();
    }
}

module.exports = {
    arriveData
}