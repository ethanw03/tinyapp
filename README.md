# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs. This is a project created for my portfolio curated through Lighthouse Labs. It includes login and register functionality with hashed passwords and cookie encryption. 

## Final Product

!["screenshot description"](#)
!["screenshot description"](#)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Open `localhost:8080` on your browser.
- User must be registered and logged in to create/edit/delete URLs.
- Shortened links can be sent and used by anyone. (/u/:shortenedURL)