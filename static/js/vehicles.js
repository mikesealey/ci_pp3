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
    });

    // User clicks "Add new vehicle"
    $("#add-new-vehicle").on("click", function() {
        console.log("Adding new vehicle!")
        // Remove displayed vehicle data
        $("#left-block-inner").empty()
        $("#left-block-inner").append($("<form>", { id: "new-vehicle-form" }));
        
        $("#new-vehicle-form").append(
            $("<label>", { for: "vrn", text: "Your Vehicle Registration Number" }),
            $("<input>", { type: "text", id: "vrn", name: "vrn", class: "vrn vrn-med", value: "MY00REG"}),
            $("<button>", {
                type: "button",
                text: "Check VRN",
                click: function () {
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
                      data.fuel_Type ? $("#fuel_type").val(data.fuel_Type) : ""
                      data.make ? $("#make").val(data.make) : ""
                      data.model ? $("#model").val(data.model) : ""
                      data.yearOfManufacture ? $("#year").val(data.yearOfManufacture) : ""
                      
                    },
                    error: function (err) {
                      console.error("Something went wrong:", err);
                    }
                  });
                }
              }),
            $("<br>"),
            $("<label>", { for: "make", text: "Make:" }),
            $("<input>", { type: "text", id: "make", name: "make" }),
            $("<br>"),
            $("<label>", { for: "model", text: "Model:" }),
            $("<input>", { type: "text", id: "model", name: "model" }),
            $("<br>"),
            $("<label>", { for: "engine_capacity", text: "Engine Capacity:" }),
            $("<input>", { type: "text", id: "engine_capacity", name: "engine_capacity" }),
            $("<br>"),
            $("<label>", { for: "fuel_type", text: "Fuel Type:" }),
            $("<input>", { type: "text", id: "fuel_type", name: "fuel_type" }),
            $("<br>"),
            $("<label>", { for: "year", text: "Year:" }),
            $("<input>", { type: "text", id: "year", name: "year" }),
            $("<br>"),
            $("<label>", { for: "colour", text: "Colour:" }),
            $("<input>", { type: "text", id: "colour", name: "colour" }),
            $("<br>"),
            $("<button>", { type: "submit", text: "Save Vehicle" })
          );
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
            console.log(success)
        },
        error: function(xhr) {
            alert("Error: " + xhr.responseText);
            console.log(error)
        }
    });
});
    })


});

