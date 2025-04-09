# ci_pp3

## Useful resources
coolors.co - colour pallette picker

## Credits
Background image by Malte Luk https://www.pexels.com/photo/man-fixing-vehicle-engine-2244746/

UK Rear number plate is colour #ffd800 with dimensions 520mm 111mm

Bootstrap Modal https://getbootstrap.com/docs/4.0/components/modal/
Adding in Bootstrap part way through this project was an awful decision and I should 100% have brought it in earlier or not at all

https://stackoverflow.com/questions/209029/best-way-to-remove-an-event-handler-in-jquery
Useful for removing an on(click) handler

Regarding "Deleting" a vehicle from a user - 
The vehicle is never actually deleted, only the relationship is removed. This helps to maintain a broader picture of the vehicle's history, should the car be sold from one user to another.
In order to reflect the change (vehicle "deleted") I could re-fetch the data from the database, which would reflect the vehicle being "deleted", but it may be better to simply save the "deletion" and then just not render it on the front-end. This would make things easier for users with poor connections.

Some writing on Optimistic vs Pessimistic rendering: https://medium.com/@whosale/optimistic-and-pessimistic-ui-rendering-approaches-bc49d1298cc0 and https://blog.devgenius.io/a-quick-look-at-optimistic-vs-pessimistic-rendering-4df00a5af0ff