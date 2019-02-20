$(document).ready( function () {

    $("#add-grade").click(function (event) {
        console.log($(this).siblings("ul"));
        $(this).siblings("ul").append(
            "<li class=\"list-inline-item col-3\">" +
            "<input class='form-control' name='id' placeholder='grade' required>" +
            "<input class='form-control' name='old_job_title' placeholder='score' required>" +
            "<button class=\"remove-grade btn \" type=\"button\">-</button>"+
            "</li>"
        );
        $(".remove-grade").click(function (event) {
            $(this).parent().remove();
        });
    });
    $(".remove-grade").click(function (event) {
        $(this).parent().remove();
    });
});