// increment and decrement buttons

function increment(btn) {
    var element = parseInt(document.getElementById(btn).value, 10);
    value = isNaN(element) ? 0 : element;

    value++;

    if (value >= 100) {
        document.getElementById(btn).value = 100;
    } else {
        console.log("value: " + value);
        document.getElementById(btn).value = value;
    }
}

function decrement(btn) {
    var element = parseInt(document.getElementById(btn).value, 10);
    value = isNaN(element) ? 0 : element;

    value--;

    if (value < 0) {
        value = 0;
    }else if (value >= 100) {
        document.getElementById(btn).value = value;
    } else {
        console.log("value: " + value);
        document.getElementById(btn).value = value;
    }
}

function reset() {
    var item = document.querySelectorAll('[name="quantidade"]');
    for (var i = 0; i < item.length; i++) {
        item[i].value = 0;
    }
}

function reset_quantity(id) {
    var input = parseInt(document.getElementById(id).value);
    value = isNaN(input) ? 0 : input;
    console.log(typeof input);

    if (value < 0){
        document.getElementById(id).value = 0;
    }

    if (value == "") {
        document.getElementById(id).value = 0;
    }

    if (value > 100) {
        document.getElementById(id).value = 100;
        alert("Quantidade máxima atingida\nQuantidade máxima: 100");
    }
}
