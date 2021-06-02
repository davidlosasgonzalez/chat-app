# Socket<span>.IO</span> - Chat

Real-time chat between two or more people. The backend is developed with [Node.js](https://nodejs.org/es/) and the frontend is developed with HTML, CSS & JavaScript vanilla. [Socket.io](https://socket.io/) is used in both environments.

## Features

-   **Registration, login and logout.** No account verification is required. No possibility to change the password or delete the account.

-   **Possibility of sending and receiving messages between two or more users.** The exchange of messages will take place in a single `<div>` where messages will be aggregated as users send them.

-   **Possibility to send and receive messages privately between two users.** The exchange of messages will take place in the same `<div>` where general messages are received, but will only be accessible to the sender and receiver of the message.

-   **Possibility to send links.** If the text sent contains a link it is formatted to construct a clickable hyperlink.

-   **Control of multiple sessions.** If a user logs in to a second window, the first window is disabled.

## Backend Installation

First let's set up the backend. Open de main folder of the proyect, go to backend directory and run `npm install`:

```bash
cd backend
npm i
```

You need create a `.env` file in the backend directory and add the same variables that you can see at `.env.example`. You can set this values if you want:

```bash
PORT=4000
SECRET=19a5eba90de1ac74c5e322af5020439c
```

Finally you need to create the database. To do this you just need to run the `db.js` file that you will find in the `bbdd` folder:

```bash
node bbdd/db.js
```

## Frontend Installation

As simple as moving to the frontend folder and running `npm install`:

```bash
cd frontend
npm i
```

## Run Proyect

To run the project, all you need to do is to perform two simple steps:

-   Start the backend server:
    ```bash
    cd backend
    npm run dev
    ```
-   Start the frontend server:
    ```bash
    cd frontend
    npm start
    ```
