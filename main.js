var xmlhttp = new XMLHttpRequest();
var url = './python/335mo_data.json';

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        console.log(myArr['E1']);
    }
};

xmlhttp.open("GET", url, true);
xmlhttp.send();