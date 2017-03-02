 $(document).ready(function(){

$(".modalButton").on("click", function(e){
console.log('clicked')
  $('#reader').html5_qrcode(function(data){

    console.log(data)
      $('#read').html(data);
      $('#reader').html("Found the data!");
      $('#reader').html5_qrcode_stop();
      // console.log(($('#public_key')))
      var pub_key = data.replace(/bitcoin:/gi, "")
      $('#public_key').val(pub_key);
      $('#myModal').modal('toggle');
      $(".modalButton").attr("disabled", true);
      // will need to do error checking on the address
      // and reactivate modal afterward too

    },
    function(error){
      $('#read_error').html(error);
    }, function(videoError){
      $('#vid_error').html(videoError);
    }
  );

})


$('#myModal').on('hide.bs.modal', function () {
  $('#reader').html5_qrcode_stop();
  $('#reader').empty()
    console.log('Fired at start of hide event!');
});
  });

