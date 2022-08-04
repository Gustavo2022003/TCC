var screenSize = window.matchMedia("((max-width: 600px))")

function openNav() {
        document.getElementById("mySidenav").style.width = "295px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

const clearInput = () => {
    const input = document.getElementsByTagName("input")[0];
    input.value = "";
}