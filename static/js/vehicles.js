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
        $("#left-block").text("") // Empyt out the placeholder text
        $("#left-block").append($("<div>", { id: "vrn-view", class: "vrn", text: vehicleData.vrn }))
        if (vehicleData.fuel_type === "electric") {
            $("#vrn-view").addClass("electric")
        }
        $("#left-block").append($("<div>", { id: "make-view", text: vehicleData.make }));
        $("#left-block").append($("<div>", { id: "model-view", text: vehicleData.model }));
        $("#left-block").append($("<div>", { id: "engine-capacity-view", text: vehicleData.engine_capacity }));
        $("#left-block").append($("<div>", { id: "fuel-type-view", text: vehicleData.fuel_type }));
        $("#left-block").append($("<div>", { id: "year-of-manufacture-view", text: vehicleData.year }));
        $("#left-block").append($("<div>", { id: "colour-view", text: vehicleData.colour }));
    });

    // User clicks "Add new vehicle"
    $("#add-new-vehicle").on("click", function() {
        console.log("Adding new vehicle!")
        // Remove displayed vehicle data
        $("#left-block").empty()
        $("#left-block").append($("<form>", { id: "new-vehicle-form" }));
        
        $("#new-vehicle-form").append(
            $("<label>", { for: "vrn", text: "VRN:" }),
            $("<input>", { type: "text", id: "vrn", name: "vrn" }),
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
          );
        console.log($("#new-vehicle-form").children())
        

    })
});