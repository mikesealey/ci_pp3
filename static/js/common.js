// Trigger toast notifications
function showToastNotification(title, message) {
  const toastElement = document.querySelector(".toast");
  const toastHeader = toastElement.querySelector(".toast-header strong");
  const toastBody = toastElement.querySelector(".toast-body");


  toastHeader.textContent = title;
  toastBody.textContent = message;

  // Show the toast
  const toast = new bootstrap.Toast(toastEl, { delay: 15000 });
  toast.show();
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
  console.log("Opening MultiPurposeModal");

  const modalEl = document.getElementById("multi-purpose-modal");
  const modalTitle = modalEl.querySelector("#multi-purpose-modal-title");
  const modalBody = modalEl.querySelector("#multi-purpose-modal-body");
  const positiveBtn = modalEl.querySelector("#multi-purpose-modal-positive");
  const negativeBtn = modalEl.querySelector("#multi-purpose-modal-negative");

  modalTitle.textContent = modalObject.title;
  modalBody.textContent = modalObject.body;
  positiveBtn.innerHTML = modalObject.confirmButtonText;
  negativeBtn.innerHTML = modalObject.cancelButtonText;

  // Clear old click handlers before adding new one
  const newPositiveBtn = positiveBtn.cloneNode(true);
  positiveBtn.parentNode.replaceChild(newPositiveBtn, positiveBtn);
  newPositiveBtn.addEventListener("click", () => {
    modalObject.confirmationButtonFunction(modalObject.confirmationButtonFunctionArgument);
  });

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

// For Bootstrap Sidepanel
document.addEventListener("DOMContentLoaded", function () {
  const offcanvasElement = document.getElementById("offcanvasRight");
  const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);

  offcanvasElement.addEventListener("shown.bs.offcanvas", function () {
    console.log("Offcanvas opened");
  });

  offcanvasElement.addEventListener("hidden.bs.offcanvas", function () {
    console.log("Offcanvas closed");
  });
});