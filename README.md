# UnInsider

UnInsider is a web platform designed to allow students to submit reviews for their universities, as well as like or dislike existing reviews submitted by other students. Additionally, administrators have the ability to create new universities on the platform and have access to all functionalities available to registered students. A machine learning model will also be integrated to summarize the top reviews for each university, making it easier for students to get an idea about any university quickly.

## Technologies Used

* Java with Spring Boot for the backend
* TS/JS with Angular for the frontend
* NodeJS as a small backend for the Angular frontend
* MySQL for the database

## Features

* User authentication and authorization
* Creation of new universities by administrators
* Submission of reviews by registered students
* Ability for registered students to like or dislike existing reviews
* Integration of a machine learning model to summarize top reviews for each university

## Getting Started

```sh
$> pwd
$> .../UnInsider/frontend/uninsider # Angular frontend
$> npm i
$> # This will build the `static` pages and place them into the `views/` dir from `nodejs/`
$> npm run watch

$> pwd
$> .../UnInsider/frontend/nodejs # Nodejs backend
$> npm i
$> # This will run the `nodejs` server which runs on port `4200` (same as the old Angular server)
$> npm run watch

$> # The `Spring Boot` backend is started as usual
```

## Contributing

If you'd like to contribute to this project, please fork the repository and create a pull request.

A very good example of a pull request is [this one](https://github.com/UnInsiderUPB/UnInsider/pull/80). The pull request is well documented, the changes are crystal clear and it also includes a form of humor. This is the kind of pull request we are looking for.

## Credits

This project was created by [@sabidea23](https://github.com/sabidea23), [@abciobanu](https://github.com/abciobanu), [@Iulian277](https://github.com/Iulian277), and [@albertsamoila](https://github.com/albertsamoila). We would also like to extend our thanks to all the contributors who helped make this project possible.

The issue and PR templates exist thanks to [@JoshuaKGoldberg](https://github.com/JoshuaKGoldberg)'s work on the [template-typescript-node-package](https://github.com/JoshuaKGoldberg/template-typescript-node-package) repository.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
