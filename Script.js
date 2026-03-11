document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("orderForm");

if (form) {
form.addEventListener("submit", function (e) {

e.preventDefault();

alert("Thank you! Your order has been received. We will contact you soon.");

form.reset();

});
}

});