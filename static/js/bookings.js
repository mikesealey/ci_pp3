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
            vehicle: $booking.data("vehicle")
        }

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

}