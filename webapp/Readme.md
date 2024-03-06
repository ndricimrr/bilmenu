Here lies the web application

# Requirements

It should be a website which shows a grid of pictures. It's UI should work well for Desktop as well as Mobile. Here are the requirements:

1. Open opening it shows a list of days as buttons. Vertically aligned and centered one above the other like a list. Each button represents a day of the week.
2. Upon clicking any of this button it should open the cafeteria menu for that particular day.
3. The cafeteria menu consists of 3 options:
   - Lunch Menu
   - Dinner Menu
   - Alternative Menu
4. So After clicking on say "Monday" button at first view, you go to second view which is the Meal View. Meal View shows Lunch Menu , Dinner Menu and Alternative Menu.
5. Each Menu is like a category, so it has a header and below it has a grid layout where a dynamic number of Meal Items is shown.
6. A number of Meal Items build the grid. Each Meal Item is nothing more than an image that contains the particular Meal with the label underneath it.
7. The Meal item is composed of two elements: Meal Image and Meal Label. Meal image is above and Meal Label is below it.
8. The design should be responsive, so shrinking the site makes the grid shrink in size accordingly.
9. You have a back button in case user wants to go back.
10. Users can also click on a Meal Item, in that case that item is opened up and the rest of items is under of a backdrop. The selected meal item is kind of opened up like a modal. When clicking on the backdrop or Back button, it goes back to previous view.

# Setup Local Development

In order to test the site locally you need to run the **index.html** file in a local web server. This is needed to avoid issues with locally fetching assets images.

- If you have **Python** then just run the following in the `webapp/` folder

  ```
  python -m http.server
  ```

- Alternatively you can use an **NPM** package to run a small web server:

1. Install http-server globally using npm:

   ```
   npm install -g http-server
   ```

2. Run the following command:

   ```
   http-server
   ```
