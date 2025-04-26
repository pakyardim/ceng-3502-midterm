## Landmarks App

This project is developed as part of the **CENG-3502: Dynamic Web Programming** midterm assignment.  
It provides a back-end service (and basic front-end integration) for managing landmarks and visit history.

## Project Description

The Landmarks App allows users to:

- **Add new landmarks** with detailed information
- **Mark landmarks as visited** with a visitor name and date
- **View all landmarks** and **view visit history**

The project supports full **CRUD operations** for managing landmarks and visited landmark data.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: Local JSON storage
- **Frontend**: HTML, CSS, JavaScript (Fetch API)

---

## Features

- Add, retrieve, update, and delete landmarks
- Mark landmarks as visited
- View the list of all landmarks
- View the list of visited landmarks

---

## API Endpoints

### Landmarks

| Method | Endpoint         | Description             |
| :----- | :--------------- | :---------------------- |
| POST   | `/landmarks`     | Add a new landmark      |
| GET    | `/landmarks`     | Get all landmarks       |
| GET    | `/landmarks/:id` | Get a specific landmark |
| PUT    | `/landmarks/:id` | Update a landmark       |
| DELETE | `/landmarks/:id` | Delete a landmark       |

### Visited Landmarks

| Method | Endpoint       | Description                             |
| :----- | :------------- | :-------------------------------------- |
| POST   | `/visited`     | Mark a landmark as visited              |
| GET    | `/visited`     | View all visited landmarks              |
| GET    | `/visited/:id` | View visit info for a specific landmark |

---

## Installation

To install and set up the project, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/pakyardim/ceng-3502-midterm.git
```

2. Navigate to the api directory::

```bash
cd ceng-3502-midterm/api
```

3. Install the dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

5. Access the front-end

```bash
Open index.html in your browser.
```
