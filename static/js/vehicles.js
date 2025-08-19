$(document).ready(function () {
  // User clicks on vehicle in list
  $("#vehicle-list").on("click", ".vehicle-list-item", function () {
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
        $("#left-block-inner").append($("<div>", { class: "label", text: "Vehicle" }))
        $("#left-block-inner").append($("<div>", { id: "vrn-view", class: "vrn vrn-med", text: vehicleData.vrn }))
        if (vehicleData.fuel_type === "ELECTRICITY") {
            $("#vrn-view").addClass("electric-med")
        }
        $("#left-block-inner").append($("<div>", { class: "label", text: "Manufacturer" }))
        $("#left-block-inner").append($("<div>", { id: "make-view", text: vehicleData.make }));
        $("#left-block-inner").append($("<div>", { class: "label", text: "Model" }))
        $("#left-block-inner").append($("<div>", { id: "model-view", text: vehicleData.model }));
        $("#left-block-inner").append($("<div>", { class: "label", text: "Engine Capacity (use KWH for EVs)" }))
        $("#left-block-inner").append($("<div>", { id: "engine-capacity-view", text: vehicleData.engine_capacity }));
        $("#left-block-inner").append($("<div>", { class: "label", text: "Fuel type" }))
        $("#left-block-inner").append($("<div>", { id: "fuel-type-view", text: vehicleData.fuel_type }));
        $("#left-block-inner").append($("<div>", { class: "label", text: "Year of Manufacture" }))
        $("#left-block-inner").append($("<div>", { id: "year-of-manufacture-view", text: vehicleData.year }));
        $("#left-block-inner").append($("<div>", { class: "label", text: "Colour" }))
        $("#left-block-inner").append($("<div>", { id: "colour-view", text: vehicleData.colour, class: " mb-3" }));
        const editVehicleButton = $("<button>", {  id: "edit-vehicle", class: "btn btn-primary w-50"})
        editVehicleButton.append($("<i>", { class: "fa-solid fa-pencil mx-2" }))
        editVehicleButton.append("Edit Vehicle")
        $("#left-block-inner").append(editVehicleButton)

        const deleteVehicleButton = $("<button>", { id: "delete-vehicle", class: "btn btn-danger w-50"})
        deleteVehicleButton.append($("<i>", { class: "fa-solid fa-trash mx-2" }))
        deleteVehicleButton.append("Delete Vehicle")
        $("#left-block-inner").append(deleteVehicleButton)
        
        
        
        
        
        // User clicks "Edit vehicle" - switches info display to form
        $("#left-block-inner").on("click", "#edit-vehicle", function () {
          $("#left-block-inner").empty();
        
          const form = $("<form>", { id: "edit-vehicle-form" });
        
          form.append(
            $("<h2>", { text: "Editing details for:" }),
            $("<div>", { id: "vrn", class: "vrn vrn-med", text: vehicleData.vrn }),
            $("<label>", { for: "make", text: "Make:", class: "form-label pt-2" }),
            $("<input>", { type: "text", id: "make", name: "make", required: true, value: vehicleData.make, class: "form-control" }),
            $("<label>", { for: "model", text: "Model:", class: "form-label pt-2" }),
            $("<input>", { type: "text", id: "model", name: "model", required: true, value: vehicleData.model, class: "form-control" }),
            $("<label>", { for: "engine_capacity", text: "Engine Capacity (use Battery Capacity in KWH for EVs):", class: "form-label pt-2" }),
            $("<input>", { type: "text", id: "engine_capacity", name: "engine_capacity", required: true, value: vehicleData.engine_capacity, class: "form-control" }),
            $("<label>", { for: "fuel_type", text: "Fuel Type:", class: "form-label pt-2" }),
            $("<input>", { type: "text", id: "fuel_type", name: "fuel_type", required: true, value: vehicleData.fuel_type, class: "form-control" }),
            $("<label>", { for: "year", text: "Year:", class: "form-label pt-2" }),
            $("<input>", { type: "text", id: "year", name: "year", required: true, value: vehicleData.year, class: "form-control" }),
            $("<label>", { for: "colour", text: "Colour:", class: "form-label pt-2" }),
            $("<input>", { type: "text", id: "colour", name: "colour", required: true, value: vehicleData.colour, class: "form-control mb-3" }),
          )
          const saveChangesButton = $("<button>", {
              id: "save-changes",
              type: "submit",
              class: "btn btn-primary"
          })
          $(saveChangesButton).append($("<i>", { class: "fa-solid fa-floppy-disk mx-2" }))
          $(saveChangesButton).append("Save changes")
          form.append(saveChangesButton)
        
          $("#left-block-inner").append(form);
        
          form.on("submit", function (e) {
            e.preventDefault();
            const updatedVehicleData = {
              vrn: vehicleData.vrn,
              make: $("#make").val(),
              model: $("#model").val(),
              engine_capacity: $("#engine_capacity").val(),
              fuel_type: $("#fuel_type").val(),
              year: $("#year").val(),
              colour: $("#colour").val()
            };
            saveVehicleChanges(updatedVehicleData);
            // Reset bacj to vehicle view
            $("#")

          });
        });
        
        // User clicks "Delete Vehicle" - Confirmation modal opens, populates with vehicle data
        $("#left-block-inner").on("click", "#delete-vehicle", function () {
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
  $("#vehicle-list").on("click", "#add-new-vehicle", function() {
      console.log("Adding new vehicle!")
      // Remove displayed vehicle data
      $("#left-block-inner").empty()
      $("#left-block-inner").append($("<form>", { id: "new-vehicle-form", class: "" }));

      // Build the button outside of the form so that the icon can be added
      const searchButton = $("<button>", {
            type: "button",
            class: "btn btn-primary w-100",
            click: function () {
              clearForm();
              $("#error-status").empty();
              const vrn = $("#vrn").val();
              console.log("Sending VRN to Django backend:", vrn);

              $.ajax({
                url: "/vehicles/api/query-vehicle/",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ registrationNumber: vrn }),
                success: function (data) {
                  console.log("Vehicle data from DVLA:", data);
                  data.colour && $("#colour").val(data.colour);
                  data.engineCapacity && $("#engine_capacity").val(data.engineCapacity);
                  data.fuelType && $("#fuel_type").val(data.fuelType);
                  data.make && $("#make").val(data.make);
                  data.model && $("#model").val(data.model);
                  data.yearOfManufacture && $("#year").val(data.yearOfManufacture);
                },
                error: function (err) {
                  console.error("Something went wrong:", err);
                  showToastNotification(vrn, "Something went wrong searching for this vehicle");
                }
              });
            }
          });
          // Add in icon
          searchButton.append($("<i>", { class: "fa-solid fa-magnifying-glass me-2" }));
          searchButton.append("Search VRN");
      
      const saveVehicleButton = $("<button>", {
        type: "submit",
        class: "btn btn-primary w-100"
      })
      saveVehicleButton.append($("<i>", { class: "fa-regular fa-floppy-disk mx-2" }));
      saveVehicleButton.append("Save Vehicle");

      $("#new-vehicle-form").append(
          $("<label>", { for: "vrn", text: "Please enter your Vehicle Registration Number" }),
          $("<input>", { type: "text", id: "vrn", name: "vrn", class: "vrn vrn-med", value: "MY00REG", autocomplete: "off"}),
          searchButton,
          $("<div>", { id: "error-status" }), 
          $("<label>", { for: "make", text: "Make:", class: "form-label pt-3" }),
          $("<input>", { type: "text", id: "make", name: "make", required: "true", class: "form-control" }),
          $("<label>", { for: "model", text: "Model:", class: "form-label pt-2" }),
          $("<input>", { type: "text", id: "model", name: "model", required: "true", class: "form-control"  }),
          $("<label>", { for: "engine_capacity", text: "Engine Capacity (use KWH for EVs):", class: "form-label pt-2" }),
          $("<input>", { type: "text", id: "engine_capacity", name: "engine_capacity", required: "true", class: "form-control"  }),
          $("<label>", { for: "fuel_type", text: "Fuel Type:", class: "form-label pt-2" }),
          $("<input>", { type: "text", id: "fuel_type", name: "fuel_type", required: "true", class: "form-control"  }),
          $("<label>", { for: "year", text: "Year:", class: "form-label pt-2" }),
          $("<input>", { type: "text", id: "year", name: "year", required: "true", class: "form-control"  }),
          $("<label>", { for: "colour", text: "Colour:", class: "form-label pt-2" }),
          $("<input>", { type: "text", id: "colour", name: "colour", required: "true", class: "form-control mb-3"  }),
          saveVehicleButton,
          $("<h5>", { type: "text", id: "error" })
        );
      // Removes placeholder text as soon as user clicks inside VRN field
      $("#vrn").on("click", function(){
        console.log("VRN FIELD CLICKED")
        const existingVRN = $("#vrn").val()
        console.log(existingVRN)
        if (existingVRN === "MY00REG") {
          $("#vrn").val("")
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
        showToastNotification(formData.vrn, "Vehicle Saved")
        // And then reset the form to the vehicle that was just created by mimicing a click on that new vehicle-item-list
        $(`.vehicle-list-item[data-vrn="${formData.vrn}"]`).click();
    },
    error: function(xhr, status, error) {
        console.log("Error: ", error);
        showToastNotification(formData.vrn, "Something went wrong when saving this vehicle")
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
      showToastNotification(vrn, "vehicle deleted")
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
      // And then reset the form to the vehicle that was just created by mimicing a click on that new vehicle-item-list
      $(`.vehicle-list-item[data-vrn="${vehicleData.vrn}"]`).click();
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