Ongoing Project ----

For user, this is an app that will people can search their favorite food, create new food and rate food

For developer, you are able to access data via RESTfulAPI

API Reference -

GET        /api/foods                      Get all food
POST       /api/foods                      Create one food

GET        /api/foods/:id                  Get a specific food
PUT        /api/foods/:id                  Update a specific food
DELETE     /api/foods/:id                  Delete a specific food


GET        /api/foods/:id/reviews          Get all reviews
POST       /api/foods/:id/reviews          Create one review

GET        /api/foods/:id/reviews/:id      Get a specific review
PUT        /api/foods/:id/reviews/:id      Update a specific review
DELETE     /api/foods/:id/reviews/:id      Delete a specific review