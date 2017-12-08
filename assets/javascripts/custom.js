// Navigation
(function( $ ) {
    'use strict';
    $('#form-business').find(':input:not(:button:not([type=submit]))').prop('disabled',true);
    $('#form-personal').find(':input:not(:button:not([type=submit]))').prop('disabled',true);
    $('#form-identity').find(':input:not(:button:not([type=submit]))').prop('disabled',true);
    $('#form-contract').find(':input:not(:button:not([type=submit]))').prop('disabled',true);

    $('#form-contract').find('.btn-contract-add').prop('disabled',false);
    //
    $('#form-create-contract').find(':input:not(:button:not([type=submit]))').prop('disabled',true);
    $('#form-contract').find('[name=_token]').prop('disabled', false);
    $('#form-contract').find('[name=version-item]').prop('disabled', false);


    //if($('#form-contract').find('#btn-create-contract').length){
    //    $('#form-contract').find('#btn-create-contract').prop('disabled',false);
    //    $('#form-contract').find('[name=_token]').prop('disabled', false);
    //}
    $('body').find('[id="form-edit"]').find('button[type=submit]').prop('disabled',false);

    $('#add_btn, #edit_btn').click(function(e){
        if($(this).attr('id')=='edit_btn'){
            e.preventDefault();
        } else {
            $('.edit_profile').removeClass('hidden');
        }
        if($(this).attr('id') == 'add_btn') {
            e.preventDefault();
            $('#bank option:selected').removeAttr('selected');
            $('#reg_source option:selected').removeAttr('selected');
            $('#account_status option:selected').removeAttr('selected');
            $('#verify_status option:selected').removeAttr('selected');
            $(this).closest('form').find(":input:not('.btn'):not('[name=_token]')").each(function(index,item){
                $(item).val('');
            });
        }
        $(this).closest('form').find(':input').prop('disabled',false);
        $(this).closest('form').find(':input').prop('disabled',false);
        $('#account-id').attr('disabled',true);
    });
    $('#tab-customer a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        console.log($(e.target).attr('href')); // newly activated tab
        var tab = $(e.target).attr('href');
        var token = window.Laravel.csrfToken;

        $.ajax({
            url:'/customer/1/ajax_tab',
            method: 'POST',
            data: {tab:tab,url:'1231 23', _token:token},
            success:function(response){
                alert('123');
            }

        });
    });
    $( "#stock_id" )
        .change(function() {
            $("#area_id").hide();
            $("#province_id").hide();
            var str = "";
            $( "#stock_id option:selected" ).each(function() {
                var stock_id = $( this ).val();
                if(stock_id == 'helpdesk') {
                    $("#area_id").show();
                    $("#province_id").hide();
                } else {
                    $("#area_id").hide();
                    $("#province_id").show();
                }
            });
            console.log(str);
        })
        .trigger( "change" );
    $('.file-popup').magnificPopup({
        type: 'image',
        callbacks:{
            open: function() {
                this.container.find('.mfp-content').css('height','initial').css('vertical-align','middle');
            }
        }
    });
    //Add ID for delete modal
    $('#delete-file').on('show.bs.modal', function(e){
        let $btn = $(e.relatedTarget);
        let $id = $btn.data('id');
        $(this).find('#attachmentId').val($id);
    });
    //Remove ID after hide modal
    $('#delete-file').on('hide.bs.modal', function(e){
        $(this).find('#attachmentId').val('');
    });
    updateFileUploaded();
    $('[data-type="ajax-upload"]').click(function(e){
        let oFiles = $('#'+$(this).data('files'));
        let att_type = oFiles.data('attachment-type');
        let customerId = oFiles.data('customer');
        let images = $($(this).data('target')).find('tbody');
        let data = new FormData();
        $.each(oFiles[0].files, function(index, item){
            data.append('file_attached[]', item);
        });
        data.append('_token', window.Laravel.csrfToken);
        data.append('attachment_type', att_type);
        $.ajax({
            url: '/customer/'+customerId+'/files/'+att_type,
            data: data,
            method: 'POST',
            dataType: 'json',
            processData: false,
            contentType: false,
            beforeSend: function() {
                $('[data-type="ajax-upload"]').find('span').removeClass('glyphicon-cloud-upload').addClass('glyphicon-refresh fa-spin');
            }
        }).done(function(response){
            if (response.success) {
                let html = '';
                $.each(response.images.attachment, function(x,item){
                    if(item.contentType == '1'){
                        html += '<tr><td>'+response.response.attachmentId[x]+'</td><td>'+item.name+'</td><td style="text-align: right"><span class="nowrap"><button class="btn btn-sm btn-default file-preview" href="'+linkfiles+item.content+'"><i class="fa fa-eye"></i> Preview</button>';

                    } else {
                        html += '<tr><td>'+response.response.attachmentId[x]+'</td><td>'+item.name+'</td><td style="text-align: right"><span class="nowrap"><button class="btn btn-sm btn-default file-preview" href="'+item.content+'"><i class="fa fa-eye"></i> Preview</button>';
                    }
                    html += '<a class="btn btn-sm btn-default" href="/download/'+response.response.attachmentId[x]+'" class="" target="_blank"><i class="fa fa-cloud-download"></i> Download</a>';
                    if(response.edit) {
                        html += '<button class="btn btn-sm btn-default btn-remove-file" href="#remove-file" data-customer="'+customerId+'" data-attachment-type="'+att_type+'" data-id="'+response.response.attachmentId[x]+'"><i class="fa fa-trash"></i> Delete</button></span></td></tr>';
                    } else {
                        html += '</span></td></tr>';
                    }
                    images.append(html);
                });
                $('.file-preview').magnificPopup({
                    type: 'image'
                });
                if(response.images.attachment.length != 0){
                    $(images).closest('.form-group').removeClass('hidden');
                }
                $('[data-type="ajax-upload"]').find('span').addClass('glyphicon-cloud-upload').removeClass('glyphicon-refresh fa-spin');
            } else {
                $('[data-type="ajax-upload"]').find('span').addClass('glyphicon-cloud-upload').removeClass('glyphicon-refresh fa-spin');
                alert('System cannot accept files! Please check!');
            }
        }).fail(function(response){
            $('[data-type="ajax-upload"]').find('span').addClass('glyphicon-cloud-upload').removeClass('glyphicon-refresh fa-spin');
            alert('System cannot accept files! Please check!');
        });
        //reset input;
        oFiles.wrap('<form>').closest('form').get(0).reset();
        oFiles.unwrap();
        return false;
    });
    $("#list-images").on('click','.remove-file[href="#remove-file"],.btn-remove-file[href="#remove-file"]',function(e){
        e.preventDefault();
        let id = $(this).data('id');
        let att_type = $(this).data('attachment-type');
        let customerId = $(this).data('customer');
        let self = $(this);
        $.ajax({
            url: '/customer/'+customerId+'/files/'+att_type,
            data: {_token:window.Laravel.csrfToken,attachmentId:id,_method:'DELETE'},
            method: 'POST',
            dataType: 'json',
            beforeSend:function(){
                self.html('<i class="fa fa-refresh fa-spin"></i>');
            }
        }).done(function(response){
            let tr = self.closest('tr');
            let tbody = tr.closest('tbody');
            tr.remove();
            if (!tbody[0].children.length){
                tbody.closest('.form-group').addClass('hidden');
            }

        }).fail(function(response){
            self.html('<i class="fa fa-trash"></i> Delete</button>');
            alert('System cannot remove files! Please check!');
        });
        return false;
    });
    // $('#datatable-payment').on('click', 'tr', function (e) {
    //     e.preventDefault();
    //     $(this).find('[data-target]').each(function(i,el){
    //         let target = $(el).data('target');
    //         $(target).val($(el).text());
    //     });
    //     $(this).closest('form').find(':input:not(:button:not([type=submit]))').prop('disabled',true);
    // });
    $('#searchfiles').click(function(e){
        e.preventDefault();
        let input = $($(this).data('target')).val();
        let images = $('.images li');
        images.removeClass('hidden');
        let patt = new RegExp('^((?!'+input+').)*$');
        images.filter(function(i, file) {
            let name = $(file).find('.info a').text();
            return patt.test(name);
        }).addClass('hidden');
    });
}).apply( this, [ jQuery ]);
(function($){
    updateProvinceOnLoad();
    $("[data-update-target]").change(function(e){
        var token = window.Laravel.csrfToken;
        var locationType = 'district';

        //console.log(e);
        let $value = $(this).val();
        let $target = '#'+$(this).data('update-target');
        let $prefix = $(this).attr('attr-prefix');
        let $locationType = $(this).attr('location-type');

        if($locationType == 'province') locationType = 'district';
        if($locationType == 'district') locationType = 'commune';

        console.log(locationType);
        if($value > 0) {
            //call ajax get childen location
            $.ajax({
                url:'/ajax/location',
                method: 'POST',
                data: {parentCode:$value,locationType: locationType, _token:token},
                success:function(data){
                    var result = $.parseJSON(data);
                    locations = result.locations;
                    renderFormLocation(locations, locationType, $prefix);
                }
            });
        }
    });
})(jQuery);


function renderFormLocation(locations, locationType, $prefix, selected = null) {

    var html = '<option value="">please select</option>';
    locations.forEach(function (location) {
        html += '<option value="'+location.code+'" data-parent=""';
        if (selected && selected == location.code) {
                html+= ' selected ';
        }
        html += '>'+location.name+'</option>';

    })
    $("#"+$prefix+"_"+locationType).empty();
    $("#"+$prefix+"_"+locationType).append(html);
}
function checkLocation() {
    var token = window.Laravel.csrfToken;
    var locationType = 'district';

    //console.log(e);
    let $value = $(this).val();
    let $target = '#'+$(this).data('update-target');
    let $prefix = $(this).attr('attr-prefix');
    let $locationType = $(this).attr('location-type');

    if($locationType == 'province') locationType = 'district';
    if($locationType == 'district') locationType = 'commune';

    console.log(locationType);
}

function updateProvinceOnLoad(){
    let token = window.Laravel.csrfToken;
    let target = $("[data-update-target]");

    target.each(function(index, item){
        console.log(item);
        let $prefix = $(item).attr('attr-prefix');
        let oUpdate = $(item).data('update-target');

        oUpdate = $('#'+oUpdate);
        let parentCode = $(item).data('value');
        let sValue = oUpdate.data('value');
        let locationType = oUpdate.attr('location-type');
        if (parentCode > 0) {
            $.ajax({
                url:'/ajax/location',
                method: 'POST',
                data: {parentCode:parentCode,locationType: locationType, _token:token},
                success:function(data){
                    var result = $.parseJSON(data);
                    let locations = result.locations;
                    renderFormLocation(locations, locationType, $prefix, sValue);
                }
            });
        }
    });

}
//customer list
$('#action-change-stage').on('show.bs.modal', function (e) {
    var target = e.relatedTarget;
    var customerId = $(target).data('id');
    var customerStage = parseInt($(target).attr('data-stage'));

    $(this).find('#customer-id').val(customerId);
    $(this).find('#customer-stage').val(customerStage);
    $(this).find('#stage-number').text(customerStage);
    updateState(customerStage,['modal']);
    buildViewModel(customerStage,1);
    var token = window.Laravel.csrfToken;
    var action = 'preview';
    $.ajax({
        url:'/customer/stage',
        method: 'POST',
        data: {action:action, id:customerId, _token:token},
        success:function(response){
            jQuery('#stage-preview').text(response.msg);
        }

    });
});
//Quick detail
$('#action-quick-detail').on('show.bs.modal', function (e) {
    var target = e.relatedTarget;
    var customerId = $(target).data('id');
    var token = window.Laravel.csrfToken;
    var reconciliation = JSON.parse(jQuery('#contract-reconciliation').val());
    //clear text - load default
    clearData();
    //load data
    $.ajax({
        url:'/customer/quick-detail',
        method: 'POST',
        data: {id:customerId, _token:token},
        success:function(response){
            var data =  $.parseJSON(response);
            console.log(data);
            if(data.status.code == 0) {

                if(data.customer !== null) {
                    var displayName = '';
                    if(data.customer.lastName !== null) displayName = data.customer.lastName + ' ';
                    if(data.customer.firstName !== null) displayName = displayName + data.customer.firstName;
                    jQuery('#displayName').text(displayName);


                    jQuery('#gender').text(data.customer.gender);
                    jQuery('#phone').text(data.customer.msisdn);
                    jQuery('#email').text(data.customer.email);
                    jQuery('#dateOfBirth').text(convertDate(data.customer.dateOfBirth,0));
                    jQuery('#country').text(data.customer.country);
                    jQuery('#jobOccupation').text(data.customer.jobOccupation);
                    jQuery('#jobPosition').text(data.customer.jobPosition);
                    jQuery('#livingAddress').text(data.customer.livingAddress);
                    jQuery('#customer-type').text(data.customer.customerType.name);
                    jQuery('#classification').text(data.customer.classificationId);

                    var strParentName = '';
                    if(data.customer.parentCif !== null) strParentName = data.customer.parentCif + ' - ';
                    if(data.customer.parentName !== null) strParentName = strParentName + data.customer.parentName;
                    jQuery('#parentName').text(strParentName);
                    var strParentInfo = '';
                    if(data.customer.parentMsisdn !== null ) strParentInfo = data.customer.parentMsisdn + ' - ';
                    if(data.customer.prarentEmail !== null ) strParentInfo = strParentInfo +  data.customer.prarentEmail;
                    jQuery('#parentInfo').text(strParentInfo);
                    //kyc status
                    jQuery('#kycStatus').text(data.customer.kycStatus);
                    var strVerifyType = (data.customer.verifyType == 1) ? 'Sale Excutive':'Other';
                    jQuery('#verifyType').text(strVerifyType);

                }

                //residentAddress missing
                if(data.identities !== null) {
                    jQuery('#issuer').text(data.identities[0].issuer);
                    jQuery('#identity').text(data.identities[0].identity);
                    var strType = '';
                    console.log(data.identities[0].identityType);
                    switch(data.identities[0].identityType) {
                        case 0:
                            strType = 'Identity card';
                            break;
                        case 1:
                            strType = 'Identification paper';
                            break;
                        case 2:
                            strType = 'Passport';
                            break;
                        default:
                            strType = '';
                    }
                    strType += ' No.';
                    jQuery('#identity-type').text(strType);
                    var strDateIdentity = '';
                    if(data.identities[0].dateIssued !== null) strDateIdentity = convertDate(data.identities[0].dateIssued,0);
                    if(data.identities[0].dateExpires !== null) strDateIdentity = strDateIdentity +' - ' +convertDate(data.identities[0].dateExpires,0) ;
                    jQuery('#valid-identity').text(strDateIdentity);

                    jQuery('#shop-name').text(data.addresses.company);
                    jQuery('#companyProduct').text(data.addresses.companyProduct);
                    jQuery('#shop-address').text(data.addresses.street1);
                    jQuery('#residentAddress').text(data.addresses.residentAddress);

                }
                //contract
                if(data.contracts !== null) {
                    jQuery('#contractType').text(data.contracts[0].contractType);
                    jQuery('#contractNo').text(data.contracts[0].contractNo);
                    jQuery('#version').text(data.contracts[0].version);
                    jQuery('#issueDate').text(convertDate(data.contracts[0].issueDate, 1));
                    jQuery('#signDate').text(convertDate(data.contracts[0].signDate, 1));
                    jQuery('#expiredDate').text(convertDate(data.contracts[0].expiredDate, 1));
                    if (data.contracts[0].isReceivedMail == 'Y') jQuery('#isReceivedMail').text('Receive email of reconciliation & invoice '+reconciliation[data.contracts[0].reconcilation]);
                    jQuery('#contractExtendedType').text(data.contracts[0].contractExtendedType);
                    jQuery('#taxNumber').text(data.contracts[0].taxNumber);
                    jQuery('#taxPayer').text(data.contracts[0].taxPayer);
                    jQuery('#taxAddress').text(data.contracts[0].taxAddress);
                }
                //device
                if(data.devices !== null){
                    if(data.devices[0].dateDelivery !== null) {
                        jQuery('#dateDelivery').text(convertDate(data.devices[0].dateDelivery, 0));
                    }
                    jQuery('#edcStatus').text(data.devices[0].edcStatus);
                    jQuery('#terminalId').text(data.devices[0].terminalId);
                    jQuery('#simId').text(data.devices[0].simId);
                    jQuery('#batteryId').text(data.devices[0].batteryId);
                    jQuery('#adapterId').text(data.devices[0].adapterId);
                    jQuery('#cardNumber').text(data.devices[0].cardNumber);
                    jQuery('#edcVersion').text(data.devices[0].edcVersion);
                }

            }
        }
    });
});

function convertDate(timestamp, isMini){
    var stg = 1;
    if(isMini == 1) stg = 1000;
    var date =  new Date(timestamp*stg);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var strDate = day+'/'+month+'/'+year;
    return strDate;
}

function clearData(){
    jQuery('#displayName').text('');
    jQuery('#gender').text('');
    jQuery('#phone').text('');
    jQuery('#email').text('');
    jQuery('#dateOfBirth').text('');
    jQuery('#country').text('');
    jQuery('#jobOccupation').text('');
    jQuery('#jobPosition').text('');
    jQuery('#livingAddress').text('');
    jQuery('#residentAddress').text('');
    jQuery('#issuer').text('');
    jQuery('#identity').text('');
    jQuery('#valid-identity').text('');
    jQuery('#shop-name').text('');
    jQuery('#companyProduct').text('');
    jQuery('#shop-address').text('');
    jQuery('#customer-type').text('');
    jQuery('#classification').text('');
    jQuery('#parentName').text('');
    jQuery('#parentInfo').text('');

    jQuery('#contractType').text('');
    jQuery('#contractNo').text('');
    jQuery('#version').text('');
    jQuery('#issueDate').text('');
    jQuery('#signDate').text('');
    jQuery('#expiredDate').text('');
    jQuery('#isReceivedMail').text('');
    jQuery('#contractExtendedType').text('');
    jQuery('#taxNumber').text('');
    jQuery('#taxPayer').text('');
    jQuery('#taxAddress').text('');

    jQuery('#dateDelivery').text('');
    jQuery('#terminalId').text('');
    jQuery('#edcStatus').text('');
    jQuery('#simId').text('');
    jQuery('#batteryId').text('');
    jQuery('#adapterId').text('');
    jQuery('#cardNumber').text('');
    jQuery('#edcVersion').text('');

    jQuery('#verifyType').text('');
    jQuery('#kycStatus').text('');
}

//Quick detail end
jQuery('#stage-approve').on('click', function(e){
    var customerStage = $('#customer-stage').val();
    //approve
    if(parseInt(customerStage)%2 == 0){
        var action = 'approve';
        changeStage(action);
    }
    //submit
    if(parseInt(customerStage)%2 == 1){
        var action = 'submit';
        changeStage(action);
    }
});

jQuery('#stage-reject').on('click', function(e){
    var action = 'reject';
    changeStage(action);
});

function changeStage(action){
    if(!jQuery('#chk-customer-confirm').is(":checked")) {
        jQuery('#stage-preview').text("Please check term of use!");
        return false;
    }
    if(jQuery.trim(jQuery('#customer-remark').val())==''){
        jQuery('#stage-preview').text("Please input remark!");
        return false;
    }
    var token = window.Laravel.csrfToken;
    var customerId = $('#customer-id').val();
    var remark = $('#customer-remark').val();
    $.ajax({
        url:'/customer/stage',
        method: 'POST',
        data: {action:action, id:customerId, remark:remark, _token:token},
        success:function(response){
            if(response.error == 0){
                var stateInfo = JSON.parse(jQuery('#state-info').val());
                var nextStage = response.lastStage;
                jQuery('#stage-preview').text(action +' success');
                jQuery('#stage-customer-'+customerId).text(nextStage);
                jQuery('#customer-stage').val(nextStage);
                jQuery('#stage-number').text(nextStage);
                updateState(nextStage,['guide','modal']);
                jQuery('#pre-stage-'+customerId).attr('data-stage', nextStage);
                jQuery('#pre-stage-'+customerId).parent().attr('data-content', stateInfo[nextStage].guide);
                console.log(stateInfo[nextStage].guide);

                if(nextStage == 28){
                    jQuery('#stage-customer-'+customerId).parent().parent().removeClass('reject').removeClass('pending').addClass('completed');
                    jQuery('#pre-stage-'+customerId).parent().next().remove();
                    jQuery('#pre-stage-'+customerId).parent().remove();
                } else {
                    if(action == 'reject'){
                        jQuery('#stage-customer-'+customerId).parent().parent().removeClass('pending').addClass('reject');
                    } else {
                        jQuery('#stage-customer-'+customerId).parent().parent().removeClass('reject').addClass('pending');
                    }
                }
                //Hide remark & agree box;
                jQuery('#customer-remark').closest('form-control').addClass('hidden');
                jQuery('#chk-customer-confirm').parent().addClass('hidden');
                //change data content
                jQuery('#stage-customer-'+customerId).parent().parent().attr('data-content', stateInfo[nextStage].name);
                buildViewModel(nextStage,0,'success');
                jQuery('.tmv-btn--advance').attr('data-stage', nextStage);
                jQuery('#stage-preview').prepend('<i class="fa fa-check text-success fa-2x" aria-hidden="true"></i>');
            } else {
                jQuery('#stage-preview').text(response.msg);
                jQuery('#stage-preview').prepend('<i class="fa fa-info-circle text-danger fa-2x" aria-hidden="true"></i>');

            }
            //disable button approve/ reject
            jQuery('#stage-reject').attr('disabled',true);
            jQuery('#stage-approve').attr('disabled',true);
            jQuery('#wrapper-chk-customer-confirm').addClass('hidden');
        }

    });
}
function buildViewModel(stage, isLoad){
    var preStage = 0;
    var nextStage = 0;
    var stateInfo = JSON.parse(jQuery('#state-info').val());
    var modal = $('#action-quick-detail');
    if(isLoad == 1) jQuery('#chk-customer-confirm').prop('checked', false);

    jQuery('#stage-reject').removeAttr('disabled');
    jQuery('#stage-approve').removeAttr('disabled');
    jQuery('#wrapper-chk-customer-confirm').removeClass('hidden');
    jQuery('#customer-remark').val('');
    if(parseInt(stage)%2 == 0){
        jQuery('#stage-number').parent().parent().removeClass('reject').addClass('pending');
        preStage = stage - 1;
        nextStage = stage + 2;
        if(stage == 28) nextStage = 'x';

    } else {
        jQuery('#stage-number').parent().parent().removeClass('pending').addClass('reject');
        preStage = stage - 2;
        if(stage <= 3){
            preStage = 'x';
            jQuery('#stage-reject').attr('disabled',true);
        }
        nextStage = stage + 1;
    }
    jQuery('#pre-stage-number').text(preStage);
    if(parseInt(preStage)%2 == 0) {
        jQuery('#pre-stage-number').parent().parent().removeClass('reject').addClass('pending');
    } else {
        jQuery('#pre-stage-number').parent().parent().removeClass('pending').addClass('reject');
    }
    jQuery('#next-stage-number').text(nextStage);
    if(parseInt(nextStage)%2 == 0) {
        jQuery('#next-stage-number').parent().parent().removeClass('reject').addClass('pending');
    } else {
        jQuery('#next-stage-number').parent().parent().removeClass('pending').addClass('reject');
    }
    jQuery('#stage-number').text(stage);
    jQuery('#pre-stage-name').text(stateInfo[1].name);
    jQuery('#next-stage-name').text('x');
    jQuery('#stage-name').text(stateInfo[stage].name);
    if(stage !== 28) {
        jQuery('#next-stage-name').text(stateInfo[nextStage].name);
    }
}
//end customer list

function updateFileUploaded(){
    let target = $('[data-type="ajax-upload"]');
    if(target.length) {
        let oFiles = $('#'+target.data('files'));
        let att_type = oFiles.data('attachment-type');
        let customerId = oFiles.data('customer');
        let images = $(target.data('target'));
        $.ajax({
            url: '/customer/'+customerId+'/files/'+att_type,
            method: 'GET',
            dataType: 'json',
            processData: false,
            contentType: false,
            beforeSend: function() {
                $('[data-type="ajax-upload"]').find('span').removeClass('glyphicon-cloud-upload').addClass('glyphicon-refresh fa-spin');
            }
        }).done(function(response){
            if (response.success) {
                $.each(response.images, function(x,item){
                    let html = '';
                    if(item.contentType == '1'){
                        html += '<tr><td>'+item.id+'</td><td>'+item.name+'</td><td style="text-align: right"><span class="nowrap"><button class="btn btn-sm btn-default file-preview" href="'+linkfiles+item.content+'"><i class="fa fa-eye"></i> Preview</button>';
                    } else {
                        html +='<tr><td>'+item.id+'</td><td>'+item.name+'</td><td style="text-align: right"><span class="nowrap"><button class="btn btn-sm btn-default file-preview" href="'+item.content+'"><i class="fa fa-eye"></i> Preview</button>';
                    }
                    html += '<a class="btn btn-sm btn-default" href="/download/'+item.id+'" class="" target="_blank"><i class="fa fa-cloud-download"></i> Download</a>';
                    if(response.edit) {
                        html += '<button class="btn btn-sm btn-default btn-remove-file" href="#remove-file" data-customer="'+customerId+'" data-attachment-type="'+att_type+'" data-id="'+item.id+'"><i class="fa fa-trash"></i> Delete</button></span></td></tr>';
                    } else {
                        html += '</span></td></tr>';
                    }
                    images.append(html);
                });
                $('.file-preview').magnificPopup({
                    type: 'image'
                });
                if(response.images.length!=0) {
                    $(images).closest('.form-group').removeClass('hidden');
                }
                $('[data-type="ajax-upload"]').find('span').addClass('glyphicon-cloud-upload').removeClass('glyphicon-refresh fa-spin');
            } else {
                $('[data-type="ajax-upload"]').find('span').addClass('glyphicon-cloud-upload').removeClass('glyphicon-refresh fa-spin');
                alert('System cannot accept files! Please check!');
            }
        }).fail(function(response){
            $('[data-type="ajax-upload"]').find('span').addClass('glyphicon-cloud-upload').removeClass('glyphicon-refresh fa-spin');
            alert('System cannot accept files! Please check!');
        });
    }
}



$(document).ready(function() {
    if($(".js-select2-single").length) $(".js-select2-single").select2();
    $("#saleId").select2({
        width: '100%'
    }).on("change", function(e) {
        var email = jQuery(e.target).find("option:selected").data('email');
        var phoneNumber = jQuery(e.target).find("option:selected").data('phone-number');
        jQuery('#info-saleEx').html(email+'<br/>'+phoneNumber);
    })
    ;
    function formatRepo (repo) {
        if (repo.loading) return repo.text;
        var markup = '<option value="' + repo.terminalId + '">' + repo.terminalId + '</option>';

        return markup;
    }
    function appendDevices(terminalId, adapterId, simId, betteryId) {
        $("#terminal_id").val(terminalId);
        $("#adapter_id").val(adapterId);
        $("#sim_id").val(simId);
        $("#battery_id").val(betteryId);
    }
    function formatRepoSelection (repo) {
        if (typeof(repo.terminalId) != "undefined") {
            appendDevices(repo.terminalId, repo.adapterId, repo.simId, repo.betteryId);
            return repo.terminalId;
        }
        return repo.text;
    }

    if($(".js-data-terminal").length) {
        $(".js-data-terminal").select2({
            ajax: {
                url: "/ajax/find-terminal",
                dataType: 'json',
                delay: 250,
                method: 'POST',
                data: function (params) {
                    return {
                        q: params.term, // search term
                        page: params.page,
                        _token: window.Laravel.csrfToken
                    };
                },
                processResults: function (data, params) {

                    data.forEach(function (d, i) {
                        //Just assign a unique number or your own unique id
                        d.id = d.terminalId; // or e.id = e.userId;
                    })

                    return {
                        results: data
                    };


                },
                cache: true
            },
            escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
            minimumInputLength: 1,
            templateResult: formatRepo,
            templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
        });
    }

    function formatRepoCard (repo) {
        if (repo.loading) return repo.text;
        var markup = '<option value="' + repo.cardId + '">' + repo.cardId + '</option>';

        return markup;
    }

    function formatRepoSelectionCard (repo) {
        if (typeof(repo.cardId) != "undefined") {
            $("#card_id").val(repo.cardId);
            return repo.cardId;
        }
        return repo.text;
    }

    if($(".js-data-card").length) {
        $(".js-data-card").select2({
            ajax: {
                url: "/ajax/find-card",
                dataType: 'json',
                delay: 250,
                method: 'POST',
                data: function (params) {
                    return {
                        q: params.term, // search term
                        page: params.page,
                        _token: window.Laravel.csrfToken
                    };
                },
                processResults: function (data, params) {

                    data.forEach(function (d, i) {

                        //Just assign a unique number or your own unique id
                        d.id = d.cardId; // or e.id = e.userId;
                    })

                    return {
                        results: data
                    };


                },
                cache: true
            },
            escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
            minimumInputLength: 1,
            templateResult: formatRepoCard,
            templateSelection: formatRepoSelectionCard // omitted for brevity, see the source of this page
        });
    }

    //load auto off filter
    //$(".panel-tools .minimise-tool").parents(".panel").find(".panel-body").slideToggle(1);

});

// Request customer
jQuery('#approve-request-customer-popup').on('show.bs.modal', function (e) {
    var btn = jQuery(e.relatedTarget);
    var row = btn.closest('tr');
    row.find('[data-modal="#approve-request-customer-popup"]').each(function(index,el){
        let item = jQuery(el);
        let target = jQuery(item.data('target'));
        console.log(target);
        if(target.length){
            target.val(item.text());
        }
    });
    var stage = row.find('[data-modal="#approve-request-customer-popup"][data-target="#request-state"]').text();
    loadRequestModal(stage);
});


jQuery('#btn-approve-request').on('click', function(e){
    var isApprove = true;
    approveCustomerRequest(isApprove);
});
jQuery('#btn-reject-request').on('click', function(e){
    var isApprove = false;
    approveCustomerRequest(isApprove);
});

function loadRequestModal(stage){
    var stateInfo = JSON.parse(jQuery('#state-info').val());
    jQuery('#request-msg').text('');
    jQuery('#request-remark').val('');
    jQuery('#request-stage').text(stage);
    jQuery('#chk-request-confirm').prop('checked', false);
    var preStage = 1;
    var nextStage = 4;

    jQuery('#request-stage-pre-name').text(stateInfo[preStage].name);
    jQuery('#request-stage-name').text(stateInfo[stage].name);
    jQuery('request-stage-next-name').text(stateInfo[nextStage].name);

    jQuery('#btn-reject-request').removeAttr('disabled');
    jQuery('#btn-approve-request').removeAttr('disabled');
    if(stage == 1 || stage == 4){
        var preStage = 'x';
        jQuery('#btn-reject-request').attr('disabled',true);
        if(stage == 4){
            jQuery('#btn-approve-request').attr('disabled',true);
        }
    }
    if(stage%2 == 0){
        jQuery('#request-stage').parent().parent().removeClass('reject').addClass('pending');
    } else {
        jQuery('#request-stage').parent().parent().removeClass('pending').addClass('reject');
    }
    jQuery('#request-stage-pre').text(preStage);
    jQuery('#request-stage-next').text(nextStage);

}

function approveCustomerRequest(isApprove){

    if(!jQuery('#chk-request-confirm').is(":checked")) {
        jQuery('#request-msg').text("Please check term of you!");
        return false;
    }
    if(jQuery.trim(jQuery('#request-remark').val())==''){
        jQuery('#request-msg').text("Please input remark!");
        return false;
    }
    if(isApprove == true){
        if(jQuery('#saleId').val()=="") {
            jQuery('#request-msg').text("Please choose a sale!");
            return false;
        }
        if(!jQuery('#province').val()) {
            jQuery('#request-msg').text("Please choose a province!");
            return false;
        }
    }

    var token = window.Laravel.csrfToken;
    var data = {
        requestId : jQuery('#request-id').val(),
        email : jQuery('#email').val(),
        phone :jQuery('#phone').val(),
        firstName : jQuery('#first-name').val(),
        lastName : jQuery('#last-name').val(),
        gender : jQuery('#gender').val(),
        provinceId : jQuery('#province').val(),
        shopAddress : jQuery('#shop-add').val(),
        remark : jQuery('#request-remark').val(),
        saleExecuteId : jQuery('#saleId').val()
    };

    $.ajax({
        url:'/customer/approve-request',
        method: 'POST',
        data: {data:data, isApprove:isApprove, _token:token},
        success:function(response){
            var result = JSON.parse(response);
            if(result.status.code == 0){
                var strApprove = (isApprove)?'Approve':'Reject';
                loadRequestModal(result.stage);
                jQuery('#request-msg').text(strApprove+' success');
                jQuery('#request-stage-'+jQuery('#request-id').val()).text(result.stage);
                if(result.stage%2 ==0){
                    jQuery('#request-stage-'+jQuery('#request-id').val()).parent().parent().removeClass('reject').addClass('pending');
                } else {
                    jQuery('#request-stage-'+jQuery('#request-id').val()).parent().parent().removeClass('pending').addClass('reject');
                }
                //add mess follow state
                var stateInfo = JSON.parse(jQuery('#state-info').val());
                jQuery('#request-list-'+jQuery('#request-id').val()).attr('data-content', stateInfo[result.stage].guide);

                jQuery('#request-stage-name').text(stateInfo[result.stage].name);
            } else {
                jQuery('#request-msg').text(result.status.value);
            }
        }

    });
}
//End Request customer
(function($){
    $('[data-type=filter-toggle]').click(function(e){
        e.preventDefault();
        $(this).toggleClass('active');
        $('#'+$(this).data('target')).toggleClass('collapsed');
    });
})(jQuery);
function quickinfo(userid, el){
    console.log(el);
}
/** State guideline update-function **/
function updateState(state,prefix){
    $pre_state = getPreState(state);
    $next_state = getNextState(state);
    var stateInfo = JSON.parse(jQuery('#state-info').val());
    jQuery.each(prefix,function(i,pf){
        if ($pre_state=='x')
            jQuery('#'+pf+'_state-guide').find('.state-guide-step-item .state-reject:not(.state-current)').addClass('state-disabled').html($pre_state).parent().find('.state-guide').html('');
        else
            jQuery('#'+pf+'_state-guide').find('.state-guide-step-item .state-reject:not(.state-current)').html($pre_state).parent().find('.state-guide').html(stateInfo[$pre_state].name);
        if ($next_state=='x')
            jQuery('#'+pf+'_state-guide').find('.state-guide-step-item .state-approve:not(.state-current)').addClass('state-disabled').html($next_state).parent().find('.state-guide').html('');
        else
            jQuery('#'+pf+'_state-guide').find('.state-guide-step-item .state-approve:not(.state-current)').html($next_state).parent().find('.state-guide').html(stateInfo[$next_state].name);
        if(state%2==0)
            jQuery('#'+pf+'_state-guide').find('.state-guide-step-item .state.state-current').removeClass('state-reject').addClass('state-approve').html(state).parent().find('.state-guide').html(stateInfo[state].name);
        else
            jQuery('#'+pf+'_state-guide').find('.state-guide-step-item .state.state-current').removeClass('state-approve').addClass('state-reject').html(state).parent().find('.state-guide').html(stateInfo[state].name);
    });
}
function getPreState(state){
    if(state==1)
        return 'x';
    if(state<2)
        return 1;
    else {
        if (state%2){
            return state-2;
        } else {
            return state-1;
        }
    }
    return 'x';
}
function getNextState(state){
    if(state==28)
        return 'x';
    if(state>26)
        return 28;
    else {
        if(state%2){
            return state+1;
        } else {
            return state+2;
        }
    }
    return 'x';
}
