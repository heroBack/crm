/**
 * Created by issuser on zhangjia
 */


function parseQueryStr(str)
{
    var tempa=null;//存放临时匹配到的字符串的那个临时数组
    //定义一个取每一对值的正则，把满足要求的内容分别定义成两个分组。匹配到的内容不到包括=?&这三个字符既可
    var reg=/([^=?&]+)=([^=?&]+)/g;
    var obj={};
    while( tempa=reg.exec(str)){//把exec的返回值赋给这个tempa,如果tempa不是null，则exec会执行多次。
        //tempa是一个数组，这个数组的长度是reg中匹配到的子表达式（分组）的个数加1
        //tempa的第0项是整个正则匹配到的内容，所以从索引1开始
        obj[tempa[1]]=tempa[2];
    }
    return obj;
};
var  userName = document.getElementById('userName'),
    userAge = document.getElementById('userAge'),
    userPhone = document.getElementById('userPhone'),
    userAddress = document.getElementById('userAdd'),
    // 判断修改还是增加, 如果url后面传递了id值就是修改。否则就是增加，这样我们加载页面的{id：2,name:3}
    customId = parseQueryStr(location.href).id;
    isFlag = typeof customId === 'undefined'?false:true;// 是否是修改操作， true是修改；false代表增加操作；
    // 如果是修改的话，就需要把对应的信息获取到 客户的详细的信息，并且返回到页面当中
    if(isFlag){
        // 这个是判断页面
        $.ajax({
            method: "POST",
            url: '/getInfo?id=' +customId,
            dataType:"json",
            beforeSend: function () {
            },
            success:function(data) {
                // 注意data的值改变了
                alert(data.msg);
                if(data&&data.code == 0){
                    var data =data.data;
                    userName.value = data['name'];
                    userAge.value  = data['age'];
                    userPhone.value = data['phone'];
                    userAddress.value = data['address'];
                }
            },
            error: function (data) {
                NetworkError();
            }
        });
    }
    submit = document.getElementById('submit');
    // 点击的时候不一定是修改
submit.onclick = function () {
    var obj = {
        name: userName.value,
        age:userAge.value,
        phone:userPhone.value,
        address: userAddress.value
    };
    // 修改
    if(isFlag){
        alert('修改页面了哈');
        obj.id = customId ;
        $.ajax({
            method: "POST",
            url: '/updateInfo',
            data: JSON.stringify(obj),// 请求主体是json格式的字符串；
            dataType:"json",
            beforeSend: function () {
            },
            success:function(data) {
                if(data&&data.code == 0){
                    // 成功之后跳转到首页
                    window.location.href = 'index.html';
                    alert(data.msg);
                    alert('跳转到首页');
                };
            },
            error: function (data) {
                alert(data.msg)
            }
        });
        return;
    }
    // add send ajax;
    console.log('增加接口的data',obj);
    $.ajax({
        method: "POST",
        url: '/addInfo',
        data: JSON.stringify(obj),// 请求主体是json格式的字符串；
        dataType:"json",
        beforeSend: function () {
        },
        success:function(data) {
            if(data&&data.code == 0){
                // 成功之后跳转到首页
                alert('请求成功，跳转到首页');
                window.location.href = 'index.html';
                return;
            }
        },
        error: function (data) {
            alert(data.msg)
        }
    });
}