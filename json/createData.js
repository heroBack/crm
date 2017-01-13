/**
 * Created by issuser on 2017/1/3.
 */

var ary =[];
//取n到m的随机的正整数；
function getRandom(n,m){
    return Math.round(Math.random()*(m-n)+n);
};
var name ='赵钱孙李周吴郑王冯陈楮卫蒋沈韩杨朱秦尤许何吕施张孔曹严华';
name.getRandom(0,29);
for(var i =0;i<99;i++){
    var obj=[];
    obj['id'] = i;
    obj['name'] = name.getRandom(0,29);;
    obj['sex'] = getRandom(0,1);
    obj['score'] = getRandom(50,99);
    arry.push(obj);
};


