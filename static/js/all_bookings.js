$(document).ready(function (){
    // User clicks on Booking in Bookings list
    $("#all-booking-list").on("click", ".all-booking-list-item", function (){
        console.log("HERE")
        // Gather booking data
        const $booking = $(this)
        
        bookingObject = {
            dateTime: $booking.data("date_time"),
            approved: $booking.data("approved"),
            bookingType: $booking.data("booking_type"),
            customer_notes: $booking.data("customer_notes"),
            mechanics_notes: $booking.data("mechanics_notes"),
            vehicle_mileage_at_service:  $booking.data("vehicle_mileage_at_service"),
            completed_service: $booking.data("completed_service"),
            vehicle: $booking.data("vehicle"),
            vehicleId: $booking.data("vehicle-id"),
            bookingId: $booking.data("booking-id"),
        }
        
        console.log("Booking dateTime at click" + bookingObject.dateTime)
        // pass it to function
        displayCustomerBooking(bookingObject)
    })
})

    function displayCustomerBooking(bookingData){
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Display Booking invoked")
        console.log("bookingdata" + JSON.stringify(bookingData))
        // Display booking details
        console.log("Emptying out customerBooking")
        $("#left-block-inner").text("") // Empty out the placeholder anything already populated there
        console.log($("#left-block-inner"))
        console.log()
        $("#left-block-inner").append($("<div>", { class: "label", text: "Vehicle" }))
        $("#left-block-inner").append($("<div>", { id: "vrn-view", class: "vrn vrn-med", text: bookingData.vehicle }))
        $("#left-block-inner").append($("<div>", { class: "label", text: "Booking Date & Time" }))
        $("#left-block-inner").append($("<div>", { id: "date-time-view", text: bookingData.dateTime }))
        $("#left-block-inner").append($("<div>", { class: "label", text: "Booking type" }))
        $("#left-block-inner").append($("<div>", { id: "booking-type-view", text: bookingData.bookingType }))
        $("#left-block-inner").append($("<div>", { class: "label", text: "Customer notes" }))
        $("#left-block-inner").append($("<div>", { id: "customer-notes-view", text: bookingData.customer_notes || "No customer notes provided" }))
        $("#left-block-inner").append($("<div>", { class: "label", text: "Mechanics notes" }))
        $("#left-block-inner").append($("<div>", { id: "mechanics-notes-view", text: bookingData.mechanics_notes || "No mechanics notes provided" }))
        $("#left-block-inner").append($("<div>", { class: "label", text: "Last known mileage" }))
        $("#left-block-inner").append($("<div>", { id: "vehicle-mileage-at-service-view", text: bookingData.vehicle_mileage_at_service }))
        $("#left-block-inner").append($("<div>", { class: "label", text: "Approval Status" }))
        $("#left-block-inner").append($("<div>", { id: "approved-view", text: bookingData.approved === "True"? "Approved" : "Pending" }))
        $("#left-block-inner").append($("<div>", { class: "label", text: "Booking Status" }))
        $("#left-block-inner").append($("<div>", { id: "completed-service-view", text: bookingData.completed_service === "True"? "Completed" : "Awaiting Service" }))
    
    
        let buttonDisabled = false
        const bookingDate = new Date(bookingData.dateTime)
        const now = new Date()
        if (bookingData.completed_service === "True" || bookingDate.getTime() < now.getTime()) { // Need to check against string of "True" because it's a response from Python/Django
            buttonDisabled = true
        }
        $("#left-block-inner").append($("<button>", { id: "approve-booking", text: "Approve booking", disabled: bookingData.approved === "True" || buttonDisabled })).on("click", "#approve-booking", function(){
            approveBooking(bookingData)
        });
        $("#left-block-inner").append($("<button>", { id: "carry-out-service", text: "Carry out service", disabled: buttonDisabled })); // replace with pen icon for edit
        $("#left-block-inner").off("click", "#carry-out-service").on("click", "#carry-out-service", function (){ // stops multiple event listeners being added - fixes bug in forms
          buildServiceForm(bookingData)
        })
    }
    




function approveBooking(bookingData){
    console.log("approve booking!")
    console.log("bookingData" + JSON.stringify(bookingData))
    // Make the AJAX call to approve the booking
    $.ajax({
        url: `/bookings/api/approve_booking/${bookingData.bookingId}/`,
        type: "PUT",
        headers: {
            "X-CSRFToken": getCSRFToken(),
        },
        success: function(response) {
            console.log("Booking approved successfully:", response);
            refreshAllBookingList(); 
            // Success Toast
            const message = `Booking approved for ${bookingData.bookingType === "Other" ? "Other Service" : bookingData.bookingType} of ${bookingData.vehicle} on ${bookingData.dateTime}`
            showToastNotification(bookingData.vrn, message)

        },
        error: function(xhr, status, error) {
            console.error("Failed to approve booking:", error);
            // Failure Toast
            showToastNotification("Failed to approve booking:", error)
            // Undo the optimistic change of the "approved"
            $("#approved-view").text("Approved")
            $("#approve-booking").prop("disabled", false)
        }
    });
    // Refresh the list
    refreshAllBookingList()

    // Optimistically change the 'approved-view'
    $("#approved-view").text("Pending")
    $("#approve-booking").prop("disabled", true)
}

function completeBooking(bookingData){
    
    // Gather data from the form
    // Make the AJAX call
    // Notifiy the customer
    // Refresh the bookings list
    refreshAllBookingList()
    // Show toast notification
}

function buildServiceForm(bookingData){
    console.log("Building the service form!")
    console.log(bookingData)
    // If service is being abandonned, inputs and buttons will exist- remove them
    if ($("#multi-purpose-modal").is(":visible")) {
        $("#carry-out-service").focus(); // Sets the button as the focus elsewhere before removing the modal
        $("#multi-purpose-modal").modal("hide"); // Then safely close the modal
        displayCustomerBooking(bookingData)
    } else {
    // Swap out statment of mechanics notes with input for mechanics ntoes
    $("#mechanics-notes-view").replaceWith(
        $("<textarea>", {
            id: "mechanics-notes-input",
            placeholder: "Enter mechanics notes...",
            rows: 5,
            cols: 40
        })
    );
    $("<button>", {
        id: "save-mechanics-notes",
        text: "Save"
    }).insertAfter("#mechanics-notes-input");
    $("<button>", {
        id: "cancel-mechanics-notes",
        text: "Cancel"
    }).insertAfter("#mechanics-notes-input");
    $("#save-mechanics-notes").off("click").on("click", function () {
        console.log("Saving notes and completing service");
        // Show modal to ask mechanic to confirm their notes
        const modalObject = {
            confirmationButtonFunction: saveMechanicsNotes,
            confirmationButtonFunctionArgument: bookingData,
            title: "Save notes and complete booking",
            body: `Do you want to save these notes: ${$("#mechanics-notes-input").val()}`,
            confirmButtonText: "Save Notes",
            cancelButtonText: "Keep Editing",
            booking: bookingData
        }
        showMultiPurposeModal(modalObject)
    });
    $("#cancel-mechanics-notes").off("click").on("click", function () {
        console.log("Cancelling notes");
        // Show modal to ask mechanic to confirm their notes
        const modalObject = {
            confirmationButtonFunction: buildServiceForm,
            confirmationButtonFunctionArgument: bookingData,
            title: "Are you sure...?",
            body: "You are about to abandon this service. No notes will be saved, the customer will not be notified. This service will still need to be completed at a later time.",
            confirmButtonText: "Abandon service",
            cancelButtonText: "Keep working on this service",
            booking: bookingData
        }
        showMultiPurposeModal(modalObject)
        

        
        
    });

    // Work on a way to save form
    // Work on a way to put the form back to the original view
    // refresh list
    // Make sure to send the email
    // Probably want some "Are you sure you want to continue?" modals
}
}

function refreshAllBookingList(){
    console.log("Refreshing All-Bookings List!")
    $.get("/bookings/api/all_bookings/", function(html) {
        $("#all-booking-list").html(html)
    })
}

function getCSRFToken() {
    console.log("getting CSRF tocken")
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

function saveMechanicsNotes(bookingData) {
    console.log("Saving mechanic's Notes!" + bookingData)
    // Get the notes from the form
    const mechanicsNotes = $("#mechanics-notes-input").val()
    console.log(mechanicsNotes)

    // Make the AJAX call
    $.ajax({
        url: `/bookings/${bookingData.bookingId}/complete/`,
        type: "PUT",
        contentType: "application/json",
        headers: {
            "X-CSRFToken": getCSRFToken(),
        },
        data: JSON.stringify({
            mechanicsNotes: mechanicsNotes
        }),
        success: function(response) {
            console.log("Booking marked complete:", response);
            refreshAllBookingList();
            showToastNotification("Success", "Mechanic's notes saved and booking marked complete.");
            $("#multi-purpose-modal").modal("hide");
            // Optimistically render these instead, 
            $("#mechanics-notes-input").replaceWith($("<div>", { id: "mechanics-notes-view", text: mechanicsNotes || "No mechanics notes provided" }))
            $("#completed-service-view").text("Completed")
            $("#save-mechanics-notes").remove()
            $("#cancel-mechanics-notes").remove()
            $("#carry-out-service").prop("disabled", true)
            // Email customer!


        },
        error: function(xhr, status, error) {
            console.error("Failed to save mechanic's notes:", error);
            showToastNotification("Error", "Failed to save mechanic's notes.");
            // Sad Toast
        }
    });
    
}
