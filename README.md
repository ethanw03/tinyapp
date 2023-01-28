# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs. This is a project created for my portfolio curated through Lighthouse Labs. It includes login and register functionality with hashed passwords and cookie encryption. 

## Final Product

!["screenshot of URLs Page"](https://github.com/ethanw03/tinyapp/blob/main/docs/screenshot%20of%20URL%20page.png?raw=true)
!["screenshot of Login Page"](https://github.com/ethanw03/tinyapp/blob/main/docs/screenshot%20of%20login%20page.png?raw=true)
!["screenshot of Edit Page"](https://github.com/ethanw03/tinyapp/blob/main/docs/screenshot%20of%20edit%20page.png?raw=true)

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