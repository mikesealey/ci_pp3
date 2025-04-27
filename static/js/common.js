// Trigger toast notifications
function showToastNotification(title, message){
    $('.toast .toast-header strong').text(title);
    $('.toast .toast-body').text(message);
  
    // Show the toast
    $('.toast').toast({ delay: 15000 });
    $('.toast').toast('show');
  }


// Should move Multi-Purpose Modal function here, too.
/**
 * Expects an object with the following properties
 * {
 *  confirmationButtonFunction
 *  confirmationButtonFunctionArugment
 *  title
 *  body
 *  confirmButtonText
 *  cancelButtonText
 * 
 * }
 */
function showMultiPurposeModal(modalObject){
  console.log("Opening MultiPurposeModal")
        $("#multi-purpose-modal-title").text(modalObject.title)
        $("#multi-purpose-modal-body").text(modalObject.body)
        $("#multi-purpose-modal-positive").html(modalObject.confirmButtonText)
        $("#multi-purpose-modal-negative").html(modalObject.cancelButtonText)
        $("#multi-purpose-modal").modal("show");
        $("#multi-purpose-modal-positive").on("click", function () {
          console.log("invoking function!")
          modalObject.confirmationButtonFunction(confirmationButtonArgument)
        })
}