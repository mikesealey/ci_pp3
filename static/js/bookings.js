$(document).ready(function (){
    // User clicks on Booking in Bookings list
    $("#booking-list").on("click", ".booking-list-item", function (){
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
            bookingId: $booking.data("booking-id")
        }
        
        console.log("Booking ID at click" + $booking.data("booking-id"))
        // pass it to function
        displayBooking(bookingObject)
    })
})

// User clicks on Booking in Bookings list
function displayBooking(bookingData){
    console.log(bookingData)
    // Display booking details
    $("#left-block-inner").text("") // Empty out the placeholder anything already populated there
    $("#left-block-inner").append($("<div>", { id: "vrn-view", class: "vrn vrn-med", text: bookingData.vehicle }))
    $("#left-block-inner").append($("<div>", { id: "date-time-view", text: bookingData.dateTime }))
    $("#left-block-inner").append($("<div>", { id: "booking-type-view", text: bookingData.bookingType }))
    $("#left-block-inner").append($("<div>", { id: "customer-notes-view", text: bookingData.customerNotes }))
    $("#left-block-inner").append($("<div>", { id: "mechanics-notes-view", text: bookingData.mechanics_notes }))
    $("#left-block-inner").append($("<div>", { id: "vehicle-mileage-at-service-view", text: bookingData.vehicle_mileage_at_service }))
    $("#left-block-inner").append($("<div>", { id: "completed-service-view", text: bookingData.completed_service }))
    $("#left-block-inner").append($("<button>", { id: "edit-booking", text: "Edit booking" })); // replace with pen icon for edit
    $("#left-block-inner").append($("<button>", { id: "delete-booking", text: "Delete booking" })); // replace with bin icon for delete
    $("#left-block-inner").on("click", "#delete-booking", function(){
        showDeleteModal(bookingData)
    })
}

function showDeleteModal(bookingData){
        console.log("Opening Modal")
        $("#multi-purpose-modal-title").text("Are you sure?")
        $("#multi-purpose-modal-body").text(`You're about to cancel your booking for ${bookingData.bookingType} on ${bookingData.vehicle} on ${bookingData.dateTime}. Are you sure? This action cannot be undone`)
        $("#multi-purpose-modal-positive").html("I'm sure I want to delete it")
        $("#multi-purpose-modal-negative").html("No, take me back to safety...")
        $("#multi-purpose-modal").modal("show");
        $("#multi-purpose-modal-positive").on("click", function () {
          console.log("Deleting booking!")
            deleteBooking(bookingData)
        })
}

function deleteBooking(booking) {
    console.log(booking + "BOOKING")

    $.ajax({
        url: `/bookings/delete-booking/${booking.bookingId}/`,
        type: "POST",
        success: function (response) {
            if (response.status === "ok") {
                console.log("Booking deleted:", response.deleted_booking_id)
                refreshBookingList()
                // Reset left-block-inner
                
                // Polish the Title for the toast notification
                let title = "Other" ? "Other Booking" : booking.bookingType
                showToastNotification(title, `Your booking for ${booking.vehicle} on ${booking.dateTime} has been cancelled.`)
                $("#left-block-inner").empty()
            } else {
                console.log("Something went wrong: " + response.error)
                showToastNotification("Something went wrong", response.error)

            }
        },
        error: function (xhr, status, error) {
            console.log("AJAX error: " + error)
            showToastNotification("Something went wrong", error)
        }
    });
    $("#multi-purpose-modal").modal("hide");
}

function refreshBookingList(){
    console.log("Refreshing Booking List!")
    $.get("/bookings/api/bookings_list/", function(html) {
        $("#booking-list").html(html)
    })
}