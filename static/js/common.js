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

/**
 * @typedef {Object} ModalObject
 * @property {function} confirmationButtonFunction - Function to call when confirming.
 * @property {*} confirmationButtonFunctionArgument - Argument to pass into the confirmation function.
 * @property {string} title - Title of the modal.
 * @property {string} body - Body text of the modal.
 * @property {string} confirmButtonText - Text for the confirmation button.
 * @property {string} cancelButtonText - Text for the cancellation button.
 * @property {object} booking - the bookingData object
 * 
 * Opens and handles the Multi-Purpose Modal.
 * @param {ModalObject} modalObject - The configuration for the modal.
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
          modalObject.confirmationButtonFunction(modalObject.confirmationButtonFunctionArgument)
  })
  console.log("|abandingonig service")
  
}