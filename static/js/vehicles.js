$(document).ready(function () {
    // User clicks on vehicle in list
    $(".vehicle-list-item").on("click", function () {
        const $vehicle = $(this);

        // Get vehicle data
        const vehicleData = {
            vrn: $vehicle.data("vrn"),
            make: $vehicle.data("make"),
            model: $vehicle.data("model"),
            engine_capacity: $vehicle.data("engine_capacity"),
            fuel_type: $vehicle.data("fuel_type"),
            year: $vehicle.data("year"),
            colour: $vehicle.data("colour"),
            owner: $vehicle.data("owner"),
        };
        // Check vehicle data
        console.log(vehicleData);
        // Display vehicle data
        $("#left-block-inner").text("") // Empyt out the placeholder anything already populated there
        $("#left-block-inner").append($("<div>", { id: "vrn-view", class: "vrn vrn-med", text: vehicleData.vrn }))
        if (vehicleData.fuel_type === "electric") {
            $("#vrn-view").addClass("electric")
        }
        $("#left-block-inner").append($("<div>", { id: "make-view", text: vehicleData.make }));
        $("#left-block-inner").append($("<div>", { id: "model-view", text: vehicleData.model }));
        $("#left-block-inner").append($("<div>", { id: "engine-capacity-view", text: vehicleData.engine_capacity }));
        $("#left-block-inner").append($("<div>", { id: "fuel-type-view", text: vehicleData.fuel_type }));
        $("#left-block-inner").append($("<div>", { id: "year-of-manufacture-view", text: vehicleData.year }));
        $("#left-block-inner").append($("<div>", { id: "colour-view", text: vehicleData.colour }));
        $("#left-block-inner").append($("<button>", { id: "edit-vehicle", text: `Edit ${vehicleData.vrn}` })); // replace with pen icon for edit
        $("#left-block-inner").append($("<button>", { id: "delete-vehicle", text: `Delete ${vehicleData.vrn}` })); // replace with bin icon for delete
        
        // User clicks "Edit vehicle" - switches info display to form
        $("#edit-vehicle").on("click", function(){
          $("#left-block-inner").empty()
          $("#left-block-inner").append(
            $("<h2>", { text: "Editing details for: "}),
            $("<div>", { id: "vrn", class: "vrn", text: vehicleData.vrn }),
            $("<label>", { for: "make", text: "Make:" }),
            $("<input>", { type: "text", id: "make", name: "make", required: "true", value: vehicleData.make }),
            $("<br>"),
            $("<label>", { for: "model", text: "Model:" }),
            $("<input>", { type: "text", id: "model", name: "model", required: "true", value: vehicleData.model }),
            $("<br>"),
            $("<label>", { for: "engine_capacity", text: "Engine Capacity:" }),
            $("<input>", { type: "text", id: "engine_capacity", name: "engine_capacity", required: "true", value: vehicleData.engine_capacity }),
            $("<br>"),
            $("<label>", { for: "fuel_type", text: "Fuel Type:" }),
            $("<input>", { type: "text", id: "fuel_type", name: "fuel_type", required: "true", value: vehicleData.fuel_type }),
            $("<br>"),
            $("<label>", { for: "year", text: "Year:" }),
            $("<input>", { type: "text", id: "year", name: "year", required: "true", value: vehicleData.year }),
            $("<br>"),
            $("<label>", { for: "colour", text: "Colour:" }),
            $("<input>", { type: "text", id: "colour", name: "colour", required: "true", value: vehicleData.colour }),
            $("<br>"),
            $("<button>", { 
              id: "save-changes",
              type: "submit",
              text: "Save changes to Vehicle",
              click: function() {
                updatedVehicleData = {
                  vrn: vehicleData.vrn,
                  make: $("#make").val(),
                  model: $("#model").val(),
                  engine_capacity: $("#engine_capacity").val(),
                  fuel_type: $("#fuel_type").val(),
                  year: $("#year").val(),
                  colour: $("#colour").val()
                }
                saveVehicleChanges(updatedVehicleData)
              } }),
            $("<h5>", { type: "text", id: "error" }),
          )
        })

      


        // User clicks "Delete Vehicle" - Confirmation modal opens, populates with vehicle data
        $("#delete-vehicle").on("click", function () {
          console.log("Opening Modal")
          $("#multi-purpose-modal-title").text("Are you sure?")
          $("#multi-purpose-modal-body").text(`You're about to delete your records for ${vehicleData.vrn}. Are you sure? This action cannot be undone`)
          $("#multi-purpose-modal-positive").html("I'm sure I want to delete it")
          $("#multi-purpose-modal-negative").html("No, take me back to safety...")
          $("#multi-purpose-modal").modal("show");
          $("#multi-purpose-modal-positive").on("click", function () {
            console.log("Deleting Vehicle!")
            deleteVehicle(vehicleData.vrn)


        })
    });

    
  });
  // User clicks "Add new vehicle"
  $("#add-new-vehicle").on("click", function() {
      console.log("Adding new vehicle!")
      // Remove displayed vehicle data
      $("#left-block-inner").empty()
      $("#left-block-inner").append($("<form>", { id: "new-vehicle-form" }));
      
      $("#new-vehicle-form").append(
          $("<label>", { for: "vrn", text: "Please enter your Vehicle Registration Number" }),
          $("<input>", { type: "text", id: "vrn", name: "vrn", class: "vrn vrn-med", value: "MY00REG", autocomplete: "off"}),
          $("<button>", {
              type: "button",
              text: "Check VRN",
              click: function () {
                // Need to clear form of existing data to account for typos
                clearForm()
                $("#error-status").empty()
                const vrn = $("#vrn").val();
                console.log("Sending VRN to Django backend:", vrn);
            
                $.ajax({
                  url: "/vehicles/api/query-vehicle/",
                  method: "POST",
                  contentType: "application/json",
                  data: JSON.stringify({ registrationNumber: vrn }),
                  success: function (data) {
                    console.log("Vehicle data from DVLA:", data);
                    // If property exists and is truthy, populate the form field with it
                    data.colour ? $("#colour").val(data.colour) : ""
                    data.engineCapacity ? $("#engine_capacity").val(data.engineCapacity) : ""
                    data.fuelType ? $("#fuel_type").val(data.fuelType) : ""
                    data.make ? $("#make").val(data.make) : ""
                    data.model ? $("#model").val(data.model) : ""
                    data.yearOfManufacture ? $("#year").val(data.yearOfManufacture) : ""
                    
                  },
                  error: function (err) {
                    console.error("Something went wrong:", err);
                    // Warn user that DVLA API has errored
                    $("#error-status").append(
                      // Add a warning ! icon
                      "<p id='warn'>Something went wrong when fetching the vehicle data. Please try again later, or manually input your vehicle's details</p>"
                    )
                  }
                });
              }
            }),
           $("<div>", { id: "error-status" }), 
          $("<br>"),
          $("<label>", { for: "make", text: "Make:" }),
          $("<input>", { type: "text", id: "make", name: "make", required: "true"}),
          $("<br>"),
          $("<label>", { for: "model", text: "Model:" }),
          $("<input>", { type: "text", id: "model", name: "model", required: "true" }),
          $("<br>"),
          $("<label>", { for: "engine_capacity", text: "Engine Capacity:" }),
          $("<input>", { type: "text", id: "engine_capacity", name: "engine_capacity", required: "true" }),
          $("<br>"),
          $("<label>", { for: "fuel_type", text: "Fuel Type:" }),
          $("<input>", { type: "text", id: "fuel_type", name: "fuel_type", required: "true" }),
          $("<br>"),
          $("<label>", { for: "year", text: "Year:" }),
          $("<input>", { type: "text", id: "year", name: "year", required: "true" }),
          $("<br>"),
          $("<label>", { for: "colour", text: "Colour:" }),
          $("<input>", { type: "text", id: "colour", name: "colour", required: "true" }),
          $("<br>"),
          $("<button>", { type: "submit", text: "Save Vehicle" }),
          $("<h5>", { type: "text", id: "error" })
        );
      // Removes placeholder text as soon as user clicks inside VRN field
      $("#vrn").on("click", function(){
        console.log("VRN FIELD CLICKED")
        const existingVRN = $("#vrn").val()
        console.log(existingVRN)
        if (existingVRN === "MY00REG") {
          $("#vrn").empty()
          console.log($("#vrn").val)
        }
      })
      // console.log($("#new-vehicle-form").children())
      
      // Handle form submission
$("#new-vehicle-form").on("submit", function(e) {
  e.preventDefault(); // prevent page reload

  // Get data from the form
  const formData = {
      vrn: $("#vrn").val(),
      make: $("#make").val(),
      model: $("#model").val(),
      engine_capacity: $("#engine_capacity").val(),
      fuel_type: $("#fuel_type").val(),
      year: $("#year").val(),
      colour: $("#colour").val()
  };
  // Pass it in to the request
  $.ajax({
    url: "/vehicles/api/add-vehicle/",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function(response) {
        console.log(response);
        refreshVehicleList()
    },
    error: function(xhr, status, error) {
        console.log("Error: ", error);
        $("#error").text("Something went wrong.") // Perhaps consider CTA ("please contact your administrator") maybe also add an ! icon
    }
});
});
  })
});

// Deletes User from Vehicle record
// Doesn't actually delete vehicle record, only deletes the relationship
function deleteVehicle(vrn){
  $.ajax({
    url: "/vehicles/api/delete_vehicle/",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ vrn: vrn }),
    success: function(response) {
      console.log("Success:", response);
      refreshVehicleList()
      
    },
    error: function(xhr) {
      alert("Error: " + xhr.responseText);
      console.log("Error:", xhr);
    }
  });
  $("#multi-purpose-modal").modal("hide");
  // Need to build a way to re-fetch the vehicles data once a vehicle has been "deleted"
  // Building a way to refetch

  // Hide the elements belonging to the deleted vehicle from the list on the right (Optimistic)
  $('.vehicle-list-item[data-vrn="' + vrn + '"]').remove()

  // Reset the form (Optimistic)
  $("#left-block-inner").empty()

  // Should I also re-fetch?
  // Refetch in success-response not here (async)
  
}

// Switches display to form
function saveVehicleChanges(vehicleData){
  console.log("Saving changes!")
  console.log(vehicleData)
  // Make the AJAX call to update the vehicle (but never allow VRN to be changed.)
  $.ajax({
    url: "/vehicles/api/update_vehicle/",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(vehicleData),  // stringified payload!
    success: function(response) {
      console.log("Success:", response);
      refreshVehicleList()
      showToastNotification(vehicleData.vrn, "Changes saved!")

    },
    error: function(xhr) {
      console.error("Error:", xhr.responseText);
      showToastNotification(vehicleData.vrn, "Something went wrong - please try again.")
      $("#left-inner-block").empty()
    }
  });
}

// Clear Form Function
function clearForm(){
  console.log("Clearing Form")
  $("#make").val()
  $("#model").val()
  $("#engine_capacity").val("")
  $("#fuel_type").val()
  $("#year").val()
  $("#colour").val()
}

function refreshVehicleList() {
  console.log("Refreshing vehicle list!")
  $.get("/vehicles/api/vehicle-list/", function(html) {
    $("#vehicle-list").html(html);
  });
}

function showToastNotification(vrn, message){
  console.log("Show Toast!!" + vrn + message)
  $('.toast .toast-header strong').text(vrn);
  $('.toast .toast-body').text(message);

    // Show the toast
  $('.toast').toast({ delay: 15000 });
  $('.toast').toast('show');
}