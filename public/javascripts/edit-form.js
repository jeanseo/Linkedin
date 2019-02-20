$(document).ready( function () {

    $("#add-grade").click(function (event) {
        console.log($(this).siblings("ul"));
        $(this).siblings("ul").append(
            "<li>" +
            "<input class='form-control' name='grade' placeholder='grade' required>-" +
            "<input class='form-control' name='score' placeholder='score' required>" +
            "<button class=\"remove-grade \" type=\"button\">-</button>"+
            "<input name=\"date\" type=\"hidden\" value=\"0\">"+
            "</li>"
        );
        $(".remove-grade").click(function (event) {
            $(this).parent().remove()
        });
    });
    $(".remove-grade").click(function (event) {
        $(this).parent().remove()
    });
});