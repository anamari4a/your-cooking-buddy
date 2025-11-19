# Web Development Final Project - *Your Cooking Buddy*

Submitted by: **Ana Maria Carrillo**

This web app: **Your Cooking Buddy simulates a social media platform where users are able create an account, look up recipes based on ingredient or a dish they have in mind, save the recipe to their account and create a post reviewing the recipe they tried out. The app allows multiple user to log in, view and interact with each other's post by allowing them to comment and upvote if logged in. The application allows users that are not logged in to view posts and search recipes but does not allow them to create a post/comment or upvote. Users are also able to log out. This project was created with React, Supabase for backend, TheMealDB Free API and Tailwind.**

Time spent: **28** hours spent in total

## Required Features

The following **required** functionality is completed:


- [X] **Web app includes a create form that allows the user to create posts**
  - Form requires users to add a post title
  - Forms should have the *option* for users to add: 
    - additional textual content
    - an image added as an external image URL
- [X] **Web app includes a home feed displaying previously created posts**
  - Web app must include home feed displaying previously created posts
  - By default, each post on the posts feed should show only the post's:
    - creation time
    - title 
    - upvotes count
  - Clicking on a post should direct the user to a new page for the selected post
- [X] **Users can view posts in different ways**
  - Users can sort posts by either:
    -  creation time
    -  upvotes count
  - Users can search for posts by title
- [X] **Users can interact with each post in different ways**
  - The app includes a separate post page for each created post when clicked, where any additional information is shown, including:
    - content
    - image
    - comments
  - Users can leave comments underneath a post on the post page
  - Each post includes an upvote button on the post page. 
    - Each click increases the post's upvotes count by one
    - Users can upvote any post any number of times

- [X] **A post that a user previously created can be edited or deleted from its post pages**
  - After a user creates a new post, they can go back and edit the post
  - A previously created post can be deleted from its post page

The following **optional** features are implemented:


- [X] Web app implements pseudo-authentication
  - Users can only edit and delete posts or delete comments by entering the secret key, which is set by the user during post creation
  - **or** upon launching the web app, the user is assigned a random user ID. It will be associated with all posts and comments that they make and displayed on them
  - For both options, only the original user author of a post can update or delete it
- [X] Web app displays a loading animation whenever data is being fetched

The following **additional** features are implemented:

- [X] Recipe search and detail pages integrated with TheMealDB API — users can search by name or ingredient and view full recipe details (ingredients, measures, and instructions).
- [X] Save recipes to a user account and a dedicated "Saved Recipes" page to view them.
- [X] Posts can be linked to saved recipes (posts store a `recipe_id` and link back to the recipe detail page) A user can not make a post about a recipe if they do not have it saved.
- [X] Responsive, consistent Tailwind-based UI across the app
- [X] Owner-only edit/delete controls.

## Video Walkthrough

Here's a walkthrough of implemented user stories:


<!-- Replace this with whatever GIF tool you used! -->
GIF created with ...  
<!-- Recommended tools:
[ScreenToGif](https://www.screentogif.com/) for Windows
 -->

## Notes

Building this project presented several challenges that helped me grow as a web developer:

- Routing and navigation: wiring up routes for discovery, recipe details, post creation, post detail, and post editing required careful coordination. Ensuring that users land on the correct page after actions (save, edit, sign-in redirects) and protecting edit/delete flows only for owners took extra attention.

- API correctness and UX: integrating TheMealDB meant handling edge cases (API returning `null` for no results), mapping ingredients/measures to the UI, and adding a debounced search to avoid excessive requests while keeping the app responsive as at first I tried using an API with limits but decided to eventually change to TheMealDB; however decided to keep the debounced search for loading purposes.

- Database schema and linking: modeling `posts`, `saved_recipes`, and `comments` and ensuring they link correctly to authenticated users required careful validation. Verifying that `recipe_id` links, saved-recipe lookups, and user ownership checks behaved consistently was an ongoing part of debugging.

- Learning Tailwind: this was my first hands-on experience with Tailwind CSS. Using utility classes made it fast to iterate on a cohesive, responsive UI, but it also required learning its conventions.

Future improvements would include adding automated tests and refining accessibility.

Posts/images used in the demo GIF are for demonstration only; I do not own them.
API used: https://www.themealdb.com/

## License

    Copyright [yyyy] [name of copyright owner]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.