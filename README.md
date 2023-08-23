## My booktracker

A book tracking application build with *react, express,  mongodb and Google book API*. User have access to an entire library that offers book searching, bookshelf management and reading progress tracking.

- #### Demo Video: https://www.youtube.com/watch?v=busUHFWhIAw&t=156s 

- #### Features

  - **Without Google login**: User can search books based on keywords and see the details of the books such as title, author, description...etc.
  - **With Google login**: 
    - User have access to their own personal library that includes 4 default bookshelves: *Favorites, Reading now, To read, and Have read*, and a big "*home book*" spot at the top of the home page.
    - **Bookshelf**: user can add/move/remove book from any bookshelf.
    - **Books in any bookshelf**: user can add notes, write review or rate the book from 1 to 5.
    - **Home book**: once you set a book to be your homebook, you have access to a progress tracking slider and a textfield to let you write your thought on the book after today's reading.

- #### Stack

  **Frontend**: react, redux,  javascripts, antd, material-ui, react-router-dom, react-rating, draft-js, react-draft-wysiwyg, data-fans

  **Backend**: nodeJS, express

  **Database**: mongoDB

  **API**: Google books API

  

- #### Installation (Update: Add Dockerfile)

  Clone Repo

  ```
  git clone https://github.com/leyunn/dockerized_mybooktracker_react.git
  ```
  
  Create env file for Mongo db connection
  
  ```
  cd app 
  // at my-booktracker
  touch .env
  open .env
  write “MONGO_URL=...(your mongo db database link)”
  ```
  
  Install with docker 
  
  ```
  docker build -t "booktracker_react" .
  docker-compose -f docker-compose.dev.yml up
  ```
  
  Alternatively, you can install manually,
  
  ```
  cd app
  npm install
  cd frontend
  npm install
  ```
  
  Start 
  
  ```
  // backend
  npm start
  //frontend
  cd frontend
  npm start
  ```
  
  
  
