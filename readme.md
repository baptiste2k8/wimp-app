

## Prerequisites

Before running the project, make sure you have the following prerequisites installed:

- Node.js (version 14.x or higher)
- MariaDB (with user `root` and password `root`)

## Installation

Follow these steps to set up and run the project:

1. Clone the repository: ```git clone https://github.com/yahiaelfellah/Testing-App.git```
2. Navigate into the cloned directory: ```cd Testing-App```
3. Run `npm install` in your terminal to install all required dependencies. 
4. Populate the database with initial data:   ```node seed.js```
This step will run the `seed.js` script to populate the database with the necessary initial data.
5. Start the server by running ```node app.js```

## Usage

 Here are some key points:
- The `app.js` file is the entry point of the application.
- The `routes.js` contains the route definitions for different endpoints.
