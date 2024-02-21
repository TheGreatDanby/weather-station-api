---------------------- Weather Endpoints - Start ----------------------
GET
/weather
Get all weather readings (currently limited to 10)

- working
<!-- TODO still limited to 10 -->

POST
/weather
Create a weather reading.

- working
  <!-- TODO creating two id fields, need to fix the constructor  -->
  <!-- FIXED -->

GET
/weather/{id}
Get a specific weather reading by ID.

- working
  <!-- TODO no linger working.  -->
  <!-- FIXED -->

PATCH
/weather
Update a weather readings.

- working
    <!-- TODO no longer working since changed to /update -->
    <!-- FIXED -->
    <!-- TODO also creating two id fields, need to fix the constructor  -->
    <!-- FIXED -->
    <!-- TODO ID input  change from Request body  to parameters  -->
  ???

DELETE
/weather/
Delete a weather reading by ID.

- working
  <!-- TODO ID input  change from Request body  to parameters  -->
  <!-- TODO 500 error 404 when oto found -->

GET
/weather/spaceTime
Get weather data for a specific device and date and time

<!-- TODO no longer working. maybe because i changed the endpoint location to /spaceTime -->
<!-- TODO not fixed -->
<!-- fixed -->

GET
/weather/max-temperature
Find the maximum Temp(C) recorded for all stations for a given Date / Time range (start and finish date)

<!-- TODO no linger working.  -->
<!-- fixed -->

---------------------- Weather Endpoints - End ----------------------

---------------------- User Endpoints - Start ----------------------

POST
/users/login
User Login

- working

POST
/users/logout
User Logout

- working
  <!-- TODO ID input  change from Request body  to parameters  -->
  <!-- why, i think it can stay in the body -->

GET
/users
Get a list with all users

<!-- TODO the returned list shows the empty ID filed instead of the content of ObjectID, need to fix that one way or another -->

POST
/users
Create a user

<!-- TODO working, how ever creates an blank ID filed besides the ObjectID   -->

PATCH
/users
Only Update a value for a specific a user

<!-- TODO not working, no ID is passed in to update the user -->

GET
/users/{id}
Get a specific user by ID

<!-- TODO not working when authentication is on, only works when authentication is off-->

DELETE
/users/{id}
Delete a user by ID

<!-- TODO not working when authentication is on, only works when authentication is off-->
<!-- fixed -->

GET
/users/by-key/{authenticationKey}
Get a user by the authentication key

<!-- TODO not working when authentication is on, only works when authentication is off-->

POST
/users/register
Register a user

- working

PUT
/user/{id}
Create or Override a value for a specific user by ID.

<!-- TODO not working   "message": "Authentication key missing" -->
