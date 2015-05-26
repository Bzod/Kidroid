/**
 * Created by nikolay_ivanisenko on 25.05.2015.
 */
$(document).ready(function(){

    $('ul.tabs li').click(function(){
        var tab_id = $(this).attr('data-tab');

        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');

        $(this).addClass('current');
        $("#"+tab_id).addClass('current');
    })

});
function createNewCategory(){
    var nameCategory = $("#newCategory").val();
    socket.emit('createCategory',{name:"" + nameCategory + ""})
    //console.log(nameCategory);
}
function findNameId(){
    var DeviceNameIDSerial = $("#DeviceNameIDSerial").val();
    socket.emit('getDevicesByName',{name:"" + DeviceNameIDSerial + ""})
    //console.log(DeviceNameIDSerial);
}
