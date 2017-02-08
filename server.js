/**
 * Created by issuser on 2017/1/3.   http://www.zhufengpeixun.cn/course/22/learn#lesson/829
 */
var http=require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (req,res) {
    // 静态资源文件处理，
    var urlObj = url.parse(req.url,true),
        pathname = urlObj.pathname,
        query = urlObj.query;
    // API接口处理
    var con = null, costomPath = "./json/constorm.json",result=null;
    con = fs.readFileSync(costomPath,"utf-8");
    con.length === 0? con = '[]':null;// 防止我们custom。json中什么都没有,con 是一个空字符串，我们会使用JSON.parse转化时会报错，我们让其等于‘[]’,
    con = JSON.parse(con);
    //静态资源文件处理
    var reg = /\.(HTML|CSS|JS)/i;
    if(reg.test(pathname)){
        var suffix = reg.exec(pathname)[1].toUpperCase();
        var suffixMINE = "text/html";
        switch (suffix){
            case "CSS" :
                suffixMINE = "text/css";
                break;
            case "js":
                suffixMINE = "text/javascript";
                break;
        }
        try{
            // res.writeHeader(200,{   'Content-Type' : 'text/plain;charset=utf-8' // 添加charset=utf-8   }) ;
            var conFile = fs.readFileSync('.'+pathname,"utf-8");
            res.writeHead(200,{'content-type':suffixMINE+';charset = utf-8;'});
            // end是返回给客户端的意思；
            res.end(conFile);
        }catch (e){
            res.writeHead(404,{'content-type':'text/plain;charset=utf-8;'});
            res.end('file is not found 没有找到');
        }
        return;
    };
    // 1.获取客户信息列表
    if(pathname === '/getList'){
        //  开始按照api文档中的规范准备给客户端返回数据
        var result = {
            code:1,
            msg:'没有任何的客户信息',
            data:null
        };
        // 改变接口返回值;
        if( con.length >0){
            result = {
                code:   0,
                msg:"成功",
                data:con
            };
        }
        result.code = con.length === 0 ? 1:0;
        result.msg = con.length === 0?"没有任何的客户信息":"成功";
        result.data = con;
        res.writeHead(200,{'content-type':'text/html'+';charset = utf-8;'});
        res.end(JSON.stringify(result));
    }
    //2.查询单个的客户信息
    if(pathname === '/getInfo'){
        customId = query["id"];
        result ={
            code:1,
            msg:'客户不存在',
            data:null
        };
        for(var i=0;i<con.length;i++){
            if(con[i]["id"] == customId){
                result ={
                    code:0,
                    msg:'成功',
                    data:con[i]
                };
                // 跳出循环就ok了
                break ;
            }
        }
        // 返回客户端就ok了
        res.writeHead(200,{'content-type':'application/json'+';charset = utf-8;'});
        res.end(JSON.stringify(result));
        return;
    }
    //3.删除客户信息
    if(pathname === "/removeInfo"){
        var costomId = query['id'];
        var flag = false;
        for(var i=0; i<con.length;i++){
            if(con[i]['id']== costomId){
                // 把数组中的con[i]这项删除
                con.splice(i,1);
                flag = true;
                // 把文件中的这一项也删除掉
                break;
            }
        }
        result = {
            code:1,
            msg:'删除失败'
        }
        if(flag){
            // 把con余下的数据重新写入到数据库当中就OK了；
            fs.writeFileSync(costomPath,JSON.stringify(con),'utf-8');
            result = {
                code:0,
                msg:'删除成功'
            }
        };
        // 把页面中的数据返回回去
        res.writeHead(200,{'content-type':'text/html'+';charset = utf-8;'});
        res.end(JSON.stringify(result));
    };
    var str = '';
    // 4.增加客户信息
    if( pathname === "/addInfo" ){
            // 获取客户端请求主体传进来的内容
            //开始接收
            req.on('data',function (chunk) {
                str += chunk;
            });
            // 结束接收
            req.on('end',function () {
                //json格式的 字符串转化成json 格式的对象；
                if(str.length == 0){
                    res.writeHead(200,{'content-type':'text/html'+';charset = utf-8;'});
                    res.end(JSON.stringify({
                        code:1,
                        msg:'增加失败，没有传递任何需要增加的信息'
                    }));
                    return;
                };
                var data = JSON.parse(str);
                // 在现有的Data中追加一个ID；获取con中的最后的一项id，新的id是在原有基础上加1即可
                if(con.length === 0){
                    data['id'] = 1;
                }else {
                    data['id'] = parseFloat(con[con.length -1]['id'])+1;
                };
                con.push(data);
                // 把添加的 用户信息 ，传递给后台写进就constorm里面就ok了；
                fs.writeFileSync( "./json/constorm.json",JSON.stringify(con),'utf-8');
                result= {
                    code:0,
                    msg:"增加成功"
                };
            });
        res.writeHead(200,{'content-type':'text/html'+';charset = utf-8;'});
        res.end(JSON.stringify(result));
        return;
    };
    // 5修改客户信息的接口
    if(pathname =="/updateInfo"){
        str = '';
        var data =null;
        req.on('data',function (chunk) {
            str += chunk ;
        });
        var flag = false;
        var data = JSON.parse('{"id":"1"}');
        req.on('end',function (chunk) {
            if(str.length ===0){
                res.writeHead(200,{'content-type':'application/json;charset = utf-8;'});
                res.end(JSON.stringify({
                    code:1,
                    msg:'修改失败，没有传递任何需要增加的客户信息'
                }));
                return;
            }
            for(var i =0;i<con.length;i++){
                if(con[i]['id'] == data['id']){
                    con[i] = data;
                    flag = true;
                    break;
                };
            };
            // result.msg = '修改失败,需要修改的客户不存在';
            // 找到要修改的客户了
            if(flag === true){
                fs.writeFileSync( "./json/constorm.json",JSON.stringify(con),'utf-8');
                console.log( JSON.stringify(con) );
                result = {
                    code: 0,
                    msg :'修改成功',
                    data:con
                }
            };
            res.writeHead(200,{'content-type':'text/html'+';charset = utf-8;'});
            res.end(JSON.stringify(result));
        });
        // 写完data事件，注意要写return把该返回的就返回回去
        return;
    }
    // 如果请求的接口不是上述的任何一个呢，则 提示404找不到文件
    res.writeHead(404,{'content-type':'text/plain'+';charset = utf-8;'});
    res.end('请求的数据接口不存在')
})
server1.listen(3000,function () {
   console.log('server is success,listening on 3000 port!');
});