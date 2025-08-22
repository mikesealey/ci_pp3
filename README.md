# AutoMate

This project is an booking site for automotive service, inspection, and repair, as part of my Level 5 Diploma in Web Application Development.

This project is for educational purposes only. No services will be rendered.

## About AutoMate
With Automate, users can create an account and log in. From there, users can add vehicles to their profile and use those vehicles to create bookings for [MOT Tests](https://en.wikipedia.org/wiki/MOT_test), services, repair work, or other general bookings.

A feature of the "My Vehicles form is the Vehicle Registration Number API which ties into the official UK Driver and Vehicle Licencing Agency (DLVA) API key to get details of this vehicle. This ensures mechanics know specifically the type of vehicle to expect in the booking, as well as helping the user to provide valid information.

![VRN Search demonstration](./readme_images/vrn_check_demo.gif)

AutoMate also features a back-office section, specifically for staff-members, who can accept bookings from customers, and carry out services. When a booking has been completed, details of the booking are automatically emailed to the customer, so that they know the specifics of the service, and that their car is ready for collection.$




## Lighthouse Reports and Validation
### Performance
For Performance tests, I've run each page through Chrome's Lighthouse tests.
![Lightouse Tests Login](readme_images/lighthouse_login.png)

![Lighthouse Tests Homepage](readme_images/lighthouse_homepage.png)

![Lighthouse Tests Profile](readme_images/lighthouse_profile.png)

![Lighthouse Tests Vehicles](readme_images/lighthouse_vehicles.png)

![Lighthouse Tests Bookings](readme_images/lighthouse_bookings.png)

![Lighthouse Tests All Bookings](readme_images/lighthouse_all_bookings.png)

### Accessibility
I've used the [Web Accessability Evaluation tool (WAVE)](https://wave.webaim.org/) to check the accessibility of my project.

There are a couple of things that it throws an error over - one of which is a "Skipped Heading Level" issue. This is for people using Screen Readers, where Headings h1-h6 denote importance. I'm not completely sure why this error is thrown, as the page contains an h1 for the title in the nav bar, followed by an h1 and h2 accordingly in the main body of the page.
![alt text](readme_images/wave_skipped_heading.png)

I also had an error for an Empty Heading - this was because I was _always_ rendering the heading, and only conditionally rendering text inside it. [This commit](https://github.com/mikesealey/ci_pp3/commit/eec949f7b88ba0ff4a1cd9153d01cac1e4583761) handles it by moving the entire heading inside the if-statement, rather than having the if-statement inside the heading.
![WAVE Empty Heading warning](readme_images/wave_empty_heading.png)

![WAVE homepage](readme_images/wave_homepage.png)

![WAVE Login](readme_images/wave_login.png)

![WAVE Profile](readme_images/wave_profile.png)

![WAVE All Bookings](readme_images/wave_all_bookings.png)

![WAVE My Vehicles](readme_images/wave_my_vehicles.png)



### Code Validation

#### Python Validation
I've used a VSCode extension called Flake8 (v2025.2.0) in order to validate my Python code. There are a couple of occasions where lines exceed the reccomended 80 characters, such as the API endpoint for checking vehicle registration numbers (VRNs) but outside of that, everything else passes.

![Python Validation Commits](./readme_images/python_validation_commits.png)

#### JavaScript Validation
I've used jshint.com to validate my JS. It doesn't return any errors, though it does warn me about the following things
* `const` an `let` being specific to ES6
* Template literal being specific to ES6
* Missing colons, though they are entirely useless
* Arrow notation in functions being specific to ES6

It's also totally unsure of how to handle jQuery and throws many warnings about anything `$`related. There are also a couple of things surrounding the Bootstrap sidepanel that get warned as "declared but never read" but on closer inspection these variables are "declared but never read _in this particular file_".

##### all_bookings.js
![Validating all_bookings](./readme_images/js_validation_all_bookings.png)

##### bookings.js
![Validating bookings](./readme_images/js_validation_bookings.png)

#### common.js
![Validating common](./readme_images/js_validation_common.png)

#### vehicles.js
![Validating vehicles](./readme_images/js_validation_vehicles.png)

### HTML Validation
I have validated my HTML using https://validator.w3.org/nu/ - some pages were validated based on their web-address (ie feeding the live version of the site into the validator) though for logged-in pages this isn't possible, so other pages were fed into the validator in plain-html instead.

#### Homepage
There are a couple of reccuring issues that it flags - There's an h5 that contains a greeting to the logged in user, though the user is not always logged in, so there are occasions when the h5 tag is empty.

![Homepage Validation](readme_images/html_validation_homepage.png)

#### Log In
![Log In Validation](readme_images/html_validation_login.png)

#### Signup
The Signup form uses Django's baked-in form, which brings with it a handful of things that this HTML checker isn't happy about, though this isn't actually code I've written.
![Signup validation](readme_images/html_validation_signup.png)




### Code Documentation


## Useful resources
coolors.co - colour pallette picker

## Credits
Background image by Malte Luk https://www.pexels.com/photo/man-fixing-vehicle-engine-2244746/

UK Rear number plate is colour #ffd800 with dimensions 520mm 111mm
https://assets.publishing.service.gov.uk/media/6694e379fc8e12ac3edafc60/inf104-vehicle-registration-numbers-and-number-plates.pdf More writings on Number Plate Sizing Dimensions

Bootstrap Modal https://getbootstrap.com/docs/4.0/components/modal/
Adding in Bootstrap part way through this project was an awful decision and I should 100% have brought it in earlier or not at all

https://stackoverflow.com/questions/209029/best-way-to-remove-an-event-handler-in-jquery
Useful for removing an on(click) handler

Regarding "Deleting" a vehicle from a user - 
The vehicle is never actually deleted, only the relationship is removed. This helps to maintain a broader picture of the vehicle's history, should the car be sold from one user to another.
In order to reflect the change (vehicle "deleted") I could re-fetch the data from the database, which would reflect the vehicle being "deleted", but it may be better to simply save the "deletion" and then just not render it on the front-end. This would make things easier for users with poor connections.

Some writing on Optimistic vs Pessimistic rendering: https://medium.com/@whosale/optimistic-and-pessimistic-ui-rendering-approaches-bc49d1298cc0 and https://blog.devgenius.io/a-quick-look-at-optimistic-vs-pessimistic-rendering-4df00a5af0ff

Had to write a clearForm function - if the user went from looking at an ICE vehicle to an electric vehicle the engine capacity remained because it was not overwritten.

Some example VRNs for testing
MM71UOS - Peugeot Electric

Useful for validating VRN formats: https://www.belinus.co.uk/plates-format-history.php


Database structure forces rethink - 
When a user deletes a vehicle (for example, if they no longer own the vehicle) We don't actually delete the vehicle from the database, we simply update it to have no user-relationship.

The downside of doing it this way is that should another user buy that vehicle and try to register it, they're trying to create a new row in the database where vrn (vehicle registration number) is the ID, which must be unique.

Some frontend-validation is required to check if the car already exists in the database, and if it has no user associated with it. There are cases where someone may sell the vehicle but fail to update their account, and a different user buys that vehicle they won't be able to save the vehicle to themselves. In such cases it may worth building some sort of back-office admin panel for staff.

Update: This could be solved with a many-to-many relationship between vehicles and users - providing booking details were filtered to current user, it would maintain the data integrity but allow someone to register their newly-purchased second hand vehicle even if it's previous owner has still got it registered with their account.

CREDITS:
Boostrap
Toast notification from docs https://getbootstrap.com/docs/4.5/components/toasts/

Interesting bugs:
Because much of the dom is being manipulated, I had to change teh way they're applied 
Swapping $("#thing").on("click", function(){}) for $("#parent-thing").on("click", "#thing", function(){}) where the parent "thing" should always be present.

tripping point: 
JS booleans and Python booleans are not comparable - Django returns a True or False, which I want to compare with JS true or false
True =/= true and False =/= false
in fact, when simply checking if (knownFalsePython) for truthiness, False will return true, because it equates to a string

icons for service types


stumbled aacrrs View Decorators - https://docs.djangoproject.com/en/5.1/topics/http/decorators/ - basically allows you to set/restrict/ to specific methods for views. Limits the DELETE BOOKING to a POST which comes with the positive confirmation of "Yes, I'm sure I want to delete this booking"

issues setting the datetime-local element with the saved value in the input form
https://stackoverflow.com/questions/30166338/setting-value-of-datetime-local-from-date

Mobile Navbar tutorial
https://www.youtube.com/watch?v=iJRZi_OdlPE

Automating Emails tutorial
https://www.youtube.com/watch?v=1BaLWYUO1k4

Fun(!) Bug 
```JS
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
            // Clear the booking from the left block (or at least remove the form)
            // console.log("Done, and now going to display the booking data!")
            // displayBooking(bookingData)
            // Wont work! Because that's going to overwrite it with the data from before the mehcanics notes were saved
            // Optimistically render these instead, 
            $("#mechanics-notes-input").replaceWith($("<div>", { id: "mechanics-notes-view", text: bookingData.mechanics_notes || "No mechanics notes provided" }))
            // $("#mechanics-notes-view").val(mechanicsNotes)
        },
        error: function(xhr, status, error) {
            console.error("Failed to save mechanic's notes:", error);
            showToastNotification("Error", "Failed to save mechanic's notes.");
            // Sad Toast
        }
    });
```

Interesting Bug - Function from elsewhere in the code by the same name was getting called instead of one in the file
Had to rename displayBooking in all_bookings.js to displayCustomerBooking to combat this.


Code from w3school scrollbar https://www.w3schools.com/howto/howto_css_custom_scrollbar.asp


jquery mimic a click with https://api.jquery.com/click/

Bootstrap 5.0 (had to upgrade)
"Offcanvas" - (aka sidepanel for mobile navigation)