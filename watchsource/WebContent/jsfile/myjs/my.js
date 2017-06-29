$(function() {
    $("body").append("hello world");
    //test extend

    var res = $.fn.extend({}, {
        name: 'aaa',
        age: 'bbb',
        work: 'ccc'
    });
});
var tes = {
    name: 'aaa',
    age: 'bbb',
    work: 'ccc'
}

var res_1 = $.fn.extend(tes)
    console.log(res_1);
    console.log(res_1.name);

 var res_2 =  $.type(res_1);



 console.log(res_2)