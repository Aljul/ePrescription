 $(document).ready(function(){
  $('#reader').html5_qrcode(function(data){
    console.log(data)
      $('#read').html(data);
      $('#reader').html("Found the data!");
      $('#reader').html5_qrcode_stop();
      // console.log(($('#public_key')))
      var pub_key = data.replace(/bitcoin:/gi, "")
      $('#public_key').val(pub_key);
      $('#myModal').modal('toggle');

    },
    function(error){
      $('#read_error').html(error);
    }, function(videoError){
      $('#vid_error').html(videoError);
    }
  );
});