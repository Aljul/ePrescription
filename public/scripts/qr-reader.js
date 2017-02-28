 $(document).ready(function(){
  $('#reader').html5_qrcode(function(data){
    console.log(data)
      $('#read').html(data);
      $('#reader').html("Found the data!");
      $('#reader').html5_qrcode_stop();

    },
    function(error){
      $('#read_error').html(error);
    }, function(videoError){
      $('#vid_error').html(videoError);
    }
  );
});