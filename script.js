
var navLink = document.getElementsByTagName("a");
var about = document.getElementById("about");
var portfolio = document.getElementById("portfolio");


function scrollFunction(targetPosition) {
    var currentPosition = 0;
    console.log(targetPosition);
    var scrollInterval = setInterval(function () {
        if (currentPosition >= targetPosition) {
            clearInterval(scrollInterval);
            return;
        }
        console.log(currentPosition);
        window.scrollBy(0, 50);
        currentPosition += 50;
    }, 50);
};



for (let i = 0; i < navLink.length; i++) {
    navLink[i].addEventListener('click', function (event) {
        event.preventDefault(); //prevent anchor TAG scroll

       if (navLink[i].textContent.includes("About")) {
            scrollFunction(about.getBoundingClientRect()["y"]);
        } 
        else if (navLink[i].textContent.includes("Portfolio")) {
            scrollFunction(portfolio.getBoundingClientRect()["y"]);
        } 

    });

}
