var grantCustomerRoleMode = null;
//END VARIABLES
function confirmGrantRole(item) {
    var txt;
    var r = confirm("Do you really want to delete this "+item+"?");
    if (r == true) {
        txt = "You pressed OK!";
    } else {
        txt = "You pressed Cancel!";
    }
}

//Show password function
function togglePassword(field){
    if(field.attr('type') == 'password') {
        field.attr('type') == 'text';
    } else {
        field.attr('type') == 'password';
    }
}

function callNotifyModal(msg, type){
    if(type=='success')
        $('#notifyModal').find('.notify-message').addClass('text-success').html(msg);
    else
        $('#notifyModal').find('.notify-message').addClass('text-danger').html(msg);
    $('#notifyModal').modal('show');
}

//privilege-description
$(document).ready(function() {
    $("#privilege-select").select2({
        width: '100%'
    }).on("change", function (e) {
        var msg = jQuery(e.target).find("option:selected").data('msg');
        jQuery('#privilege-description').html(msg);
    });
    //Clear notify modal
    $('#notifyModal').on('bs.modal.hidden', function(){
        $('#notifyModal').find('.notify-message').removeClass('text-success').removeClass('text-danger').html('');
    });
    //Change password Handle
    function showChangePasswordValidate(validateResponse){
        let form = $('#changePasswordForm');
        $.each(validateResponse, function(field, messages){
            $.each(messages, function(i,message){
                form.find(':input[name='+field+']').closest('.col-md-8').append('<span class="help-block text-danger validated">'+message+'</span>');
            });
        });
    }
    function clearChangePasswordValidate(){
        $('#changePasswordForm').find('.help-block.validated').remove();
    }

    $('#changePasswordForm').submit(function(e){
        e.preventDefault();
        clearChangePasswordValidate();
        let data = $(this).serialize();
        let msg = '';
        $.ajax({
            url: $(this).attr('action'),
            method: 'POST',
            data: data
        }).done(function(response){
            let result = null;
            try{
                let result = JSON.parse(response);
            } catch (err) {
                result = response;
            }
            alertMsg(result.data.msg,result.data.type,'msg-change-pwd');
        }).fail(function(jqXHR){
            if (jqXHR.status == 422) {
                alertMsg('Please fix some problems!',0,'msg-change-pwd');
                showChangePasswordValidate(jqXHR.responseJSON);
            } else {
                msg = 'lbl_system_cannot_response';
                alertMsg(msg,0,'msg-change-pwd');
            }
        });
        return false;
    });
    //Grand Role
    $('#action-grant-role').on('hide.bs.modal', function(e){
        if(e.namespace == 'bs.modal') {
            grantCustomerRoleMode = null;
            clearRoleValidate();
            $('#grand_account_role')[0].reset();
            $('#action-grant-role').find("#roleId").val('');
        }
    });
    $('#grand_account_role').submit(function(e){
        e.preventDefault();
        $data = $(this).serialize();
        $.ajax({
            url:$(this).attr('action'),
            data:$data,
            method:'POST'
        }).done(function(response){
            if (response.status.code == 0) {
                if (grantCustomerRoleMode == 'edit') {
                    alertMsg('Update Role Success!', 1, 'msg-grant-role');
                    updateRoleTable($data);
                } else {
                    alertMsg('Grant Role Success!',1,'msg-grant-role');
                    addRoleToTable(response.umgrCustomerRoleId, $data);
                }
                $('#grant-role').prop('disabled', true);
            } else {
                alertMsg(response.status.value,0,'msg-grant-role');
            }
        }).fail(function(jqXHR){
            if (jqXHR.status == 404) {
                alertMsg('Cannot connect to Server!',0,'msg-grant-role');
            }
            if (jqXHR.status == 405) {
                alertMsg('Method not Allowed!',0,'msg-grant-role');
            }
            if (jqXHR.status == 422) {
                showRoleValidate(jqXHR.responseJSON);
                alertMsg('You must fill all required field!',0,'msg-grant-role');
            }
        });
    });
    //_END_ Grand Role
});

//Edit Customer Role
function editCustomerRoleModal(id, button) {
    grantCustomerRoleMode = 'edit';
    let $row = $(button).closest('tr').addClass('selected');
    updateGrantCustomerModal(id,$row);
    $('#action-grant-role').modal('show');
}

function updateGrantCustomerModal(id,row)
{
    let roleName = row.find('.roleName').html();
    let validFrom = row.find('.roleValidFrom').data('order');
    let validTo = row.find('.roleValidTo').data('order');
    $('#action-grant-role').find("#roleId").val(id);
    $('#action-grant-role').find("#customer-type").val(roleName);
    $('#action-grant-role').find("#validDate").datepicker('setDate', new Date(validFrom));
    $('#action-grant-role').find("#validTo").datepicker('setDate', new Date(validTo));
}
//_END_ EDIT CUSTOMER ROLE


//account list
function blackListAccount(accountId,blackListReason){
    //init
    jQuery('#msg-blacklist').text('');
    jQuery('#remark-modal-account-list').val('');
    jQuery('#wrapper-chk-customer-confirm').show();
    jQuery('#chk-customer-confirm').attr('checked',false);
    jQuery('#btn-account-blacklist-save').attr('disabled',false);
    jQuery('#action-blacklist').find('#account-id').val(accountId);
    jQuery('#action-blacklist').find('#blacklist-id').val(blackListReason);
    jQuery('#action-blacklist').modal('show');
    return false;
}

jQuery('#action-blacklist').on('show.bs.modal', function (e) {
    //alert(123);
});

function changeBlackList(){
    var accountId = jQuery('#account-id').val();
    var blacklistIdOld = jQuery('#blacklist-id').val();
    var valueBlackList = jQuery('#blackListModal').val();
    var valueBlackListText = jQuery('#blackListModal option:selected').text();
    //validate blacklist
    if(valueBlackList == ''){
        alertMsg('Please select Blacklist reason!',0,'msg-blacklist');
        return;
    }
    if(blacklistIdOld == valueBlackList){
        alertMsg('Please change Blacklist reason!',0,'msg-blacklist');
        return;
    }

    //validate remark
    var remark = jQuery('#remark-modal-account-list').val();
    if(remark == ''){
        alertMsg('Please input Remark',0,'msg-blacklist');
        return;
    }

    //validate checkbox
    if(jQuery('#chk-customer-confirm').is(':checked') == false){
        alertMsg('Please check Term of use!',0,'msg-blacklist');
        return;
    }

    //change blackList reason
    actionChangeBlackListReason(valueBlackList, remark, accountId,valueBlackListText);


}
function alertMsg(msg, isSuccess, idMsg) {
    var htmlMsg = '';
    if (isSuccess == 0) {
        htmlMsg += '<i class="fa fa-info-circle text-danger fa-lg" aria-hidden="true"></i> ';
    } else {
        htmlMsg += '<i class="fa fa-check text-success fa-lg" aria-hidden="true"></i> ';
    }
    htmlMsg += msg;
    jQuery('#'+idMsg).html(
        '<div class="warp-msg"><div class="text-orange text-center modal-msg">' + htmlMsg
        + '</div></div>'
    );
}

function actionChangeBlackListReason(valueBlackList, remark, accountId, valueBlackListText){
    var token = window.Laravel.csrfToken;
    $.ajax({
        url:'/account/changeBlackList',
        method: 'POST',
        data: {blacklistReasonType:valueBlackList, customerId:accountId, remark:remark, _token:token},
        success:function(response){
            var result = JSON.parse(response);
            if(result.status.code == 0){
                //success
                alertMsg('Blacklist change success!',1);
                jQuery('#wrapper-chk-customer-confirm').hide();
                jQuery('#btn-account-blacklist-save').attr('disabled',true);
                jQuery('#txn-blacklist-reason-'+accountId).text(valueBlackListText);
                if(valueBlackList == 0){
                    jQuery('#chk-blacklist-status-'+accountId).attr('checked',true);
                } else {
                    jQuery('#chk-blacklist-status-'+accountId).attr('checked',false);
                }
            }
        }
    });
}

//load default disable input for account detail screen
$('#form-account-detail').find(':input:not(:button:not([type=submit]))').prop('disabled',true);
$('#form-role-detail').find(':input:not(:button:not([type=submit]))').prop('disabled',true);

function removeCustomerRoleModal(roleName){
    jQuery('#roleName').val(roleName);
    jQuery('#msg-delete-role').html('');
    jQuery('#chk-account-confirm').prop('checked', false);
    $('#removeRole').prop('disabled', false);
}

function removeCustomerRole(){
    var accountId = jQuery('#accountId').val();
    var roleName = jQuery('#roleName').val();
    var token = window.Laravel.csrfToken;
    //validate checkbox
    if(jQuery('#chk-account-confirm').is(':checked') == false){
        alertMsg('Please check Term of use!',0,'msg-delete-role');
        return;
    }
    $.ajax({
        url:'/account/remove-customer-role',
        method: 'DELETE',
        data: {roleName:roleName, customerId:accountId, _token:token},
        success:function(response){
            var result = null;
            try {
                result = JSON.parse(response);
            } catch (e) {
               result = response;
            }
            if(result.status.code == 0){
                jQuery('#datatable-role').dataTable().api().row('#datatable-role .'+roleName).remove().draw();
                //success
                alertMsg('Remove role successful!',1,'msg-delete-role');
                $('#removeRole').prop('disabled', true);
            }
        }
    });
}

//account list end
function showRoleValidate(validateResponse){
    let form = $('#grand_account_role');
    $.each(validateResponse, function(field, messages){
        $.each(messages, function(i,message){
            form.find(':input[name='+field+']').parent().append('<span class="help-block text-danger validated">'+message+'</span>');
        });
    });
}
//role manager
function clearRoleValidate(){
    $('#grand_account_role').find('.help-block.validated').remove();
    jQuery('#msg-grant-role').html('');
    jQuery('#chk-customer-confirm').prop('checked', false);
    $('#grant-role').prop('disabled', false);
}
function addRoleToTable($id, $data) {
    $data = decodeURIComponent($data);
    $row = $.parseJSON('{"' + $data.replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    $action = getRoleAccountAction($id);
    $node = roleTable.api().row.add(['', $row.roleName, getTimeFormat($row.validFrom), getTimeFormat($row.validTo),'', $action]).draw();
    $($node.node()).addClass($row.roleName);
}

function updateRoleTable($data) {
    $data = decodeURIComponent($data);
    $row = $.parseJSON('{"' + $data.replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    $action = getRoleAccountAction($row.roleId);
    $dateFrom = {'@data-order':moment($row.validFrom,"DD/MM/YYYY").format("x"),'display':moment($row.validFrom,"DD/MM/YYYY").format("DD/MM/YYYY HH:mm:ss Z zz")};
    $dateTo = {'@data-order':moment($row.validTo,"DD/MM/YYYY").format("x"),'display':moment($row.validTo,"DD/MM/YYYY").format("DD/MM/YYYY HH:mm:ss Z zz")};
    $node = roleTable.api().row('#datatable-role tr.selected').data([ null, $row.roleName, $dateFrom, $dateTo, null, $action]).draw();
    $($node.node()).removeClass('selected');
    grantCustomerRoleMode = null;
}
function getRoleAccountAction(id){
    $html = '';
    $html += getRoleAccountEditAction(id);
    $html += getRoleAccountDeleteAction();
    return $html;
}

function getRoleAccountEditAction(id){
    $html = '<i class="fa fa-2x fa-pencil-square text-success" onclick="editCustomerRoleModal('+id+', this)" style="cursor: pointer;" aria-hidden="true"></i> ';
    return $html;
}
function getRoleAccountDeleteAction(){
    $html = '<i class="fa fa-2x fa-trash-o text-danger" data-target="#action-grant-delete" data-toggle="modal" style="cursor: pointer;" onclick="removeCustomerRoleModal(\''+$row.roleName+'\')" aria-hidden="true"></i>'
    return $html;
}
function getTimeFormat($data){
    if (!$data)
        return '';
    return decodeURIComponent($data) +' 00:00:00 +00:00 UTC'
}
function removeRoleModal(roleName){
    jQuery('#roleName').val(roleName);
    jQuery('#msg-delete-role').html('');
    jQuery('#chk-account-confirm').prop('checked', false);
    $('#removeRole').prop('disabled', false);
}
function removeRole(){
    var roleName = jQuery('#roleName').val();
    var token = window.Laravel.csrfToken;
    //validate checkbox
    if(jQuery('#chk-account-confirm').is(':checked') == false){
        alertMsg('Please check Term of use!',0,'msg-delete-role');
        return;
    }
    $.ajax({
        url:'/role/remove-role',
        method: 'DELETE',
        data: {roleName:roleName, _token:token},
        success:function(response){
            var result = JSON.parse(response);
            if(result.status.code == 0){
                jQuery('#datatable-role').dataTable().api().row('#datatable-role .'+roleName).remove().draw();
                //success
                alertMsg('Remove role successful!',1,'msg-delete-role');
                $('#removeRole').prop('disabled', true);
            }
        }
    });
}
function preChangeStatusRole(roleName){
    //init
    jQuery('#roleName').val(roleName);
    var chkStatus = jQuery('#chk'+roleName).is(":checked");
    jQuery('#chk-account-confirm').attr('checked',false);
    var status = 'Y';
    if (chkStatus == true) status = 'N';
    jQuery('#btnChangeStatusRole').attr('disabled',false);
    jQuery('#roleStatus').val(status);
    jQuery('#action-change-status-role').modal('show');
    jQuery('#msg-change-role').html('');
    return false;
}

function changeStatusRole(){
    var roleName = jQuery('#roleName').val();
    var status = jQuery('#roleStatus').val();
    var token = window.Laravel.csrfToken;
    //validate checkbox
    if(jQuery('#chk-account-confirm').is(':checked') == false){
        alertMsg('Please check Term of use!',0,'msg-change-role');
        return;
    }
    $.ajax({
        url:'/role/change-status-role',
        method: 'POST',
        data: {roleName:roleName,active:status, _token:token},
        success:function(result){
            if(result.status.code == 0){
                //success
                alertMsg('Change status role successful!',1,'msg-change-role');
                var isChecked = (status == 'Y')? true: false;
                jQuery('#chk'+roleName).prop('checked',isChecked);
                jQuery('#btnChangeStatusRole').prop('disabled',true);
            } else {
                alertMsg(result.status.value,0,'msg-change-role');
            }
        }
    });
}

//role manager end
//privileges manager
function preChangeStatusPrivilege(privilegeName){
    //init
    jQuery('#privilegeName').val(privilegeName);
    var chkStatus = jQuery('#chk'+privilegeName).is(":checked");
    jQuery('#chk-account-confirm').attr('checked',false);
    var status = 'Y';
    if (chkStatus == true) status = 'N';
    jQuery('#btnChangeStatusPrivilege').attr('disabled',false);
    jQuery('#privilegeStatus').val(status);
    jQuery('#action-change-status-privilege').modal('show');
    jQuery('#msg-change-privilege').html('');
    return false;

}

function changeStatusPrivilege(){
    var privilegeName = jQuery('#privilegeName').val();
    var status = jQuery('#privilegeStatus').val();
    var token = window.Laravel.csrfToken;
    //validate checkbox
    if(jQuery('#chk-account-confirm').is(':checked') == false){
        alertMsg('Please check Term of use!',0,'msg-change-privilege');
        return;
    }
    $.ajax({
        url:'/privilege/change-status-privilege',
        method: 'POST',
        data: {privilegeId:privilegeName,active:status, _token:token},
        success:function(result){
            if(result.status.code == 0){
                //success
                alertMsg('Change status role successful!',1,'msg-change-privilege');
                var isChecked = (status == 'Y')? true: false;
                jQuery('#chk'+privilegeName).prop('checked',isChecked);
                jQuery('#btnChangeStatusPrivilege').prop('disabled',true);
            } else {
                alertMsg(result.status.value,0,'msg-change-privilege');
            }
        }
    });
}
//privileges manager end