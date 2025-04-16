// Trigger toast notifications
function showToastNotification(vrn, message){
    console.log("Show Toast!!" + vrn + message)
    $('.toast .toast-header strong').text(vrn);
    $('.toast .toast-body').text(message);
  
      // Show the toast
    $('.toast').toast({ delay: 15000 });
    $('.toast').toast('show');
  }