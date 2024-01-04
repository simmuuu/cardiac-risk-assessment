// Front-End: Updates Sliders with Custom Values

var slider = document.getElementById("GenHlth");
var output = document.getElementById("GenHlthOut");
output.innerHTML = sliderRating(slider.value); // Display the default slider value

slider.oninput = function () {
    output.innerHTML = sliderRating(this.value);
}

function sliderRating(score) {
    const ratingMap = {
        1: "Poor",
        2: "Fair",
        3: "Good",
        4: "Very Good",
        5: "Excellent"
    };

    return ratingMap[score] || "Invalid Score";
}