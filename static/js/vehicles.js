$(document).ready(function () {
    // User clicks on vehicle in list
    $(".vehicle-list-item").on("click", function () {
        const $vehicle = $(this);

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

        console.log(vehicleData);  // 🔍 check output

        // Update left panel
        $("#vrn-view").text(vehicleData.vrn);
        $("#make-view").text(vehicleData.make);
        $("#model-view").text(vehicleData.model);
        $("#engine-capacity-view").text(vehicleData.engine_capacity)
        $("#fuel-type-view").text(vehicleData.fuel_type);
        $("#year-of-manufacture-view").text(vehicleData.year)
        
    });

    // User clicks "Add new vehicle"
    $("#add-new-vehicle").on("click", function() {
        console.log("Adding new vehicle!")
        $("#existing-vehicle").text("hidden")
        $("#existing-vehicle").addClass(".hidden")
        
    })
});