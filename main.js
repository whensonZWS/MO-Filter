
var xmlhttp = new XMLHttpRequest();
var url = './python/336mo_data.json';
var data;
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.responseText);
        for (var key in data) {
            addIcon(key, data[key]['name'], data[key]['filter'], data[key]['local'], text = data[key]['description'], al = data[key]['align']);
        }
    }
};

xmlhttp.open("GET", url, true);
xmlhttp.send();

function addIcon(id, name, filter, source = "http://mentalomega.com/images/cameo/bbtzicon.png", text = id, al = "top left") {
    al = al == undefined ? "top left" : al;
    source = source == './assets/.png' ? "./assets/wooticon.png" : source;
    var frame = document.getElementById("mc");
    var d = document.createElement("DIV");
    d.className = "tooltip filt " + filter;
    d.style.backgroundSize = "auto 80px";
    d.style.backgroundImage = "url('" + source + "')";
    d.style.backgroundPosition = al;
    d.title = name;
    if (source == "./assets/wooticon.png") {
        d2 = document.createElement("DIV");
        d2.innerHTML = name;
        d2.className = "noimage"
        d.appendChild(d2);
    }
    if (filter.includes('sy')) {
        nnn = document.createElement("DIV");
        nnn.innerHTML = "NANO";
        nnn.className = "nanot";
        d.appendChild(nnn);
    }

    var ttt = document.createElement("SPAN");
    ttt.innerHTML = name;
    ttt.className = "tooltiptext";
    if (filter.includes("na")) {
        d.style.borderColor = "red";
    }
    if (filter.includes("ga")) {
        d.style.borderColor = "blue";
    }
    if (filter.includes("ya")) {
        d.style.borderColor = "magenta";
    }
    if (filter.includes("fa")) {
        d.style.borderColor = "teal";
    }


    d.addEventListener("click", function () {
        myFunc(text);
    }
    );

    d.appendChild(ttt);
    frame.appendChild(d);
}
var arr = [];
for (var i = 0; i < 13; i++)
    arr[i] = 0;
var ft = ['na', 'ga', 'ya', 'fa', 'inf', 'veh', 'bud', 't1', 't2', 't3', 't4', 't5', 'sy'];


var ss = "";
filterSelection("all");

function myFunc(text) {
    document.getElementById("infobox").innerHTML = text;
}
function filterSelection(c) {
    if (c == "all")
        ss = "";
    else
        if (ss.includes(c)) ss = ss.replace("." + c, "");
        else ss += "." + c;
    if (c != "all")
        for (var i = 0; i < 13; i++)
            if (c == ft[i])
                arr[i] = !arr[i];
    applyFilter();
}





function notEmpty(num) {
    if (num == 1)
        return (arr[0] || arr[1] || arr[2] || arr[3]);
    if (num == 2)
        return (arr[4] || arr[5] || arr[6]);
    if (num == 3)
        return (arr[7] || arr[8] || arr[9] || arr[10] || arr[11] || arr[12]);
}


function applyFilter() {
    var el = document.getElementsByClassName("filt");
    for (var i = 0; i < el.length; i++)
        el[i].style.display = 'none';
    var validLen = notEmpty(1) + notEmpty(2) + notEmpty(3);
    if (validLen == 0) {
        for (var i = 0; i < el.length; i++)
            el[i].style.display = 'block';
    } else {
        for (var i = 0; i < 4; i++) {
            for (var j = 4; j < 7; j++) {
                for (var k = 7; k < 13; k++) {
                    var tempStr = "";

                    var l = 0;
                    if (arr[i]) {
                        tempStr += "." + ft[i];
                        l++;
                    }
                    if (arr[j]) {
                        tempStr += "." + ft[j];
                        l++;
                    }
                    if (arr[k]) {
                        tempStr += "." + ft[k];
                        l++;
                    }
                    if (l == validLen) {
                        var tl = document.querySelectorAll(tempStr);
                        for (var z = 0; z < tl.length; z++)
                            tl[z].style.display = 'block';
                    }
                }
            }
        }
    }


}

var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
var allbtn = btnContainer.getElementsByClassName("all");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        activeBtn(this.id);
    });
}

function activeBtn(id) {
    filterSelection(id);
    if (id != "all") {
        var temp = document.getElementById(id);
        var p = temp.parentElement.getElementsByClassName("btn");


        if (temp.className.includes("active"))
            temp.className = temp.className.replace(" active", "");
        else
            temp.className += " active";
    } else {
        for (var j = 0; j < btns.length; j++)
            btns[j].className = btns[j].className.replace(" active", "");
    }

}

