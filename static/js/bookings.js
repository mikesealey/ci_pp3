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
            vehicleId: $booking.data("vehicle-id"),
            bookingId: $booking.data("booking-id"),
        }
        
        console.log("Booking dateTime at click" + bookingObject.dateTime)
        // pass it to function
        displayBooking(bookingObject)
    })

    // User clicks Add New Booking in Bookings list
    $("#booking-list").on("click", "#add-new-booking", function (){
        buildNewBookingForm()
    })

    // $("#left-block-inner").on("click", "save")
})

// User clicks on Booking in Bookings list
function displayBooking(bookingData){
    console.log("bookingdata" + JSON.stringify(bookingData))
    // Display booking details
    $("#left-block-inner").text("") // Empty out the placeholder anything already populated there
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
    $("#left-block-inner").append($("<div>", { class: "label", text: "Booking Status" }))
    $("#left-block-inner").append($("<div>", { id: "completed-service-view", text: bookingData.completed_service ? "Completed" : "Not yet completed" }))

    let editable = true
    const bookingDate = new Date(bookingData.dateTime)
    if (bookingData.completed_service || bookingDate < new Date()) {
        editable = false
    }
    $("#left-block-inner").append($("<button>", { id: "edit-booking", text: "Edit booking", disabled: !editable })); // replace with pen icon for edit
    $("#left-block-inner").off("click", "#edit-booking").on("click", "#edit-booking", function (){ // stops multiple event listeners being added - fixes bug in forms
      buildEditBookingForm(bookingData)
    })
    $("#left-block-inner").append($("<button>", { id: "delete-booking", text: "Delete booking", disabled: !editable })); // replace with bin icon for delete
    $("#left-block-inner").off("click", "#delete-booking").on("click", "#delete-booking", function(){
        showDeleteModal(bookingData) // showDeleteModal needs refactoring to be "showModal"
    })
}

function buildNewBookingForm(){
    console.log("building bookings form")
    $("#left-block-inner").empty()
    $("#left-block-inner").append($("<form>", { id: "new-booking-form" }))
    $("#new-booking-form").append(
        $("<label>", { for: "booking_type", text: "Booking Type:" }),
        $("<select>", { id: "booking_type", name: "booking_type", required: true }).append(
            $("<option>", { class: "placeholder", value: undefined, text: "Please select a booking type", disabled: true, selected: true, hidden: true }),
            $("<option>", { value: "Service", text: "Service" }),
            $("<option>", { value: "MOT", text: "MOT" }),
            $("<option>", { value: "Repair", text: "Repair" }),
            $("<option>", { value: "Other", text: "Other" })
        ),
        $("<label>", { for: "vehicle", text: "Vehicle:" }),
        $("<select>", { id: "vehicle", name: "vehicle", required: true }),
        // SELECT options populated with AJAX call below
        // Fetch vehicles associated with current user
        $.get("/vehicles/api/vehicle-listJSON/", function(response) {
            const vehicles = response.vehicles;
            console.log(vehicles)
            $("#vehicle").append(
            $("<option>", { class: "placeholder", value: undefined, text: "Please select a vehicle for service", disabled: true, selected: true, hidden: true }),
            )
            // Now add vehicles as options to the form
            vehicles.forEach((vehicle) => {
                console.log(vehicle.id)
            $("#vehicle").append(
                $("<option>", { value: vehicle.id, text: vehicle.vrn })
            )
            })
        }),
        $("<label>", { for: "date_time", text: "Date & Time:" }),
        $("<input>", { type: "datetime-local", id: "date_time", name: "date_time", required: true }),
        $("<label>", { for: "customer_notes", text: "Customer Notes:" }),
        $("<textarea>", { id: "customer_notes", name: "customer_notes", rows: 4, required: true }),
        $("<label>", { for: "vehicle_mileage_at_service", text: "Vehicle Mileage at Service:" }),
        $("<input>", { type: "number", id: "vehicle_mileage_at_service", name: "vehicle_mileage_at_service", min: 0, required: true }),
        $("<button>", { type: "submit", text: "Save Booking" }),
        // Booking Submission
        $("#new-booking-form").on("submit", function(e) {
            e.preventDefault()
            // Gather data from form
            const formData = {
                bookingType: $("#booking_type").val(),
                dateTime: $("#date_time").val(),
                customerNotes: $("#customer_notes").val(),
                vehicle_mileage_at_service: $("#vehicle_mileage_at_service").val(),
                vehicle: $("#vehicle").val()
            }
            // Pass data into AJAX query
            $.ajax({
                url: "/bookings/api/add-booking/",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(formData),
                success: function(response) {
                    console.log(response);
                    refreshBookingList()
                    $("#left-block-inner").empty()
                    showToastNotification(`${formData.bookingType} Booking`, `Your booking has been submitted for ${formData.dateTime}.`)
                },
                error: function (xhr, status, error) {
                    console.log("Error: ", error);
                    showToastNotification(formData.bookingType, "Something went wrong when saving this booking")
                }
            })
        }),
    )
    
}

function buildEditBookingForm(formData){
    console.log("135" + formData)
    $("#left-block-inner").empty()
    $("#left-block-inner").append($("<form>", { id: "new-booking-form" }))
    $("#new-booking-form").append(
        $("<label>", { for: "booking_type", text: "Booking Type:" }),
        $("<select>", { id: "booking_type", name: "booking_type", required: true }).append(
            $("<option>", { value: "Service", text: "Service" }),
            $("<option>", { value: "MOT", text: "MOT" }),
            $("<option>", { value: "Repair", text: "Repair" }),
            $("<option>", { value: "Other", text: "Other" })
        ).appendTo("#new-booking-form"),
        $("#booking_type").val(formData.bookingType),
        $("<label>", { for: "vehicle", text: "Vehicle:" }),
        $("<select>", { id: "vehicle", name: "vehicle", required: true }),
        // SELECT options populated with AJAX call below
        // Fetch vehicles associated with current user
        $.get("/vehicles/api/vehicle-listJSON/", function(response) {
            const vehicles = response.vehicles;
            $("#vehicle").empty() // Must empty options list to prevent duplicates
            $("#vehicle").append(
            $("<option>", { class: "placeholder", value: undefined, text: "Please select a vehicle for service", disabled: true, selected: true, hidden: true }),
            )
            // Now add vehicles as options to the form
            vehicles.forEach((vehicle) => {
            $("#vehicle").append(
                $("<option>", { value: vehicle.id, text: vehicle.vrn })
            )
            })
            // Now set the form's selected value as the vehicle already chosen in the booking
            $("#vehicle").val(formData.vehicleId)
        }),
        $("<label>", { for: "date_time", text: "Date & Time:" }),
        $("<input>", { type: "datetime-local", id: "date_time", name: "date_time", required: true, value: formData.dateTime }),
        $("#date_time").val(formData.dateTime),
        $("<label>", { for: "customer_notes", text: "Customer Notes:" }),
        $("<textarea>", { id: "customer_notes", name: "customer_notes", rows: 4, required: true  }).val(formData.customer_notes),
        $("<label>", { for: "vehicle_mileage_at_service", text: "Vehicle Mileage at Service:" }),
        $("<input>", { type: "number", id: "vehicle_mileage_at_service", name: "vehicle_mileage_at_service", min: 0, required: true, value: formData.vehicle_mileage_at_service}),
        $("<button>", { type: "submit", text: "Save Booking" }),
        // Booking Submission
        $("#new-booking-form").on("submit", function(e) {
            e.preventDefault()
            // Gather data from form
            const collectedFormData = {
                bookingType: $("#booking_type").val(),
                dateTime: $("#date_time").val(),
                customerNotes: $("#customer_notes").val(),
                vehicle_mileage_at_service: $("#vehicle_mileage_at_service").val(),
                vehicle: $("#vehicle").val(),
                bookingId: formData.bookingId
            }
            // Pass data into AJAX query
            console.log("bookingID" + collectedFormData.bookingId)
            $.ajax({
                url: `/bookings/api/update-booking/${collectedFormData.bookingId}/`,
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(collectedFormData),
                success: function(response) {
                    console.log(response);
                    refreshBookingList();
                    $("#left-block-inner").empty();
                    showToastNotification(
                        `${collectedFormData.bookingType} Booking`,
                        `Your booking has been amended for ${collectedFormData.dateTime}.`
                    );
                },
                error: function (xhr, status, error) {
                    console.log("Error: ", error);
                    showToastNotification(collectedFormData.bookingType, "Something went wrong when updating this booking");
                }
            });
        }),
    )
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

function saveBooking(){

}

