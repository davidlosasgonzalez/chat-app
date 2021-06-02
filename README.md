# Socket<span>.IO</span> - Chat

Real-time chat between two or more people.

-   The backend is developed with [Node.js](https://nodejs.org/es/) & [better-sqlite3](https://www.npmjs.com/package/better-sqlite3).

-   The frontend is developed with HTML, CSS & JavaScript vanilla.

-   [Socket.io](https://socket.io/) is used in both environments.

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

You need create a `.env` file in the backend directory and add the same variables that you can see at `.env.example`. You can set this values:

```bash
PORT=4000
SECRET=19a5eba90de1ac74c5e322af5020439c
```

> I recommend using port 4000 since it is the one I use in the frontend to make the connection.If you use a different port you will have to modify the port in all the requests in the frontend as well as the connection with socket.io in the `index.html`.

Finally you need to create the database. To do this you just need to run the `db.js` file that you will find in the `bbdd` folder:

```bash
node bbdd/db.js
```

> After starting the database three users [Porcoteixo, Furabolos, Vacaloura] with the password 12345 are generated. You can make use of these users or register with a new user.

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

## Tips

The fun of this chat is being able to talk in real time with two or more people. In order to test this functionality you can start the project and login in several browsers.

For example:

-   **Session 1:** Chrome tab.
-   **Session 2:** Chrome tab incognito mode.
-   **Session 3:** Firefox tab.

With the above configuration you will be able to exchange messages between three different users. Try it!

> If you try to start a second session in another tab of the same browser the previous session will be disconnected.
