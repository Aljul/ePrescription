$(document).ready(function(){

  $(".modalButton").on("click", function(e) {
    console.log('clicked')
    $('#reader').html5_qrcode(function(data) {
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
      function(error) {
        $('#read_error').html(error);
      }, function(videoError) {
        $('#vid_error').html(videoError);
      }
    );
  });

  $('#myModal').on('hide.bs.modal', function() {
    $('#reader').html5_qrcode_stop();
    $('#reader').empty()
    console.log('Fired at start of hide event!');
  });

  $(".prescription-submit").on('click', function(e){
      $(".loader-holder").addClass("loader")
      $(".holder").addClass("blur")
      $(".overlay-holder").attr('id', 'overlay')
  })


  // Set first user in list as default value of public_key
  let defaultVal = $('#usersList option:selected').val();
  $("#public_key").val(defaultVal);

  // Change the value of public_key when selecting something
  $("#usersList").on("changed.bs.select", function(){
    let selectVal = $('#usersList option:selected').val();
    $("#public_key").val(selectVal);
  });

});
