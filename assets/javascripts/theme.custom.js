/* Add here all your JS customizations */
$( "#edit-profile" ).click(function() {
    $('.profile').find('input, textarea, button, select').prop("disabled", false);
    $('.btn-update-profile').show();
});
$( "#view-profile" ).click(function() {
    $('.profile').find('input, textarea, button, select').prop("disabled", true);
    $('.btn-update-profile').hide();
});
$( "#btn-edit-identity" ).click(function() {
    $('#edit_identity').find('input, textarea, button, select').prop("disabled", false);
    $('.btn-update-identity').show();
});
$( "#btn-view-identity" ).click(function() {
    $('#edit_identity').find('input, textarea, button, select').prop("disabled", true);
    $('.btn-update-identity').hide();
});
$( "#btn-edit-business-infomation" ).click(function() {

    $('#edit-business-infomation').find('input, textarea, button, select').prop("disabled", false);
    $('.btn-update-business-infomation').show();
});
$( "#btn-view-business-infomation" ).click(function() {

    $('#edit-business-infomation').find('input, textarea, button, select').prop("disabled", true);
    $('.btn-update-business-infomation').hide();
});


