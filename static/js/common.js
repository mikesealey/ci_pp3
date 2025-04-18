// Trigger toast notifications
function showToastNotification(title, message){
    $('.toast .toast-header strong').text(title);
    $('.toast .toast-body').text(message);
  
    // Show the toast
    $('.toast').toast({ delay: 15000 });
    $('.toast').toast('show');
  }