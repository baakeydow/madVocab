# **MADVOCAB**

## Prerequisites
[Nodejs 12.14.1](https://nodejs.org/dist/v12.14.1/)  
[Yarn](https://yarnpkg.com/)  
[MongoDB](https://www.mongodb.com/)  
[AWS account](https://aws.amazon.com/account/)  
[Docker](https://www.docker.com/)  (optional)

You need to have these env variables set with valid values:  
- AWS_ACCESS_KEY_ID=xxxxxxxx  
- AWS_SECRET_ACCESS_KEY=xxxxxxxxx  

These credentials needs to provide full access to Amazon Translate

## **Run Project**

**Install/Update dependencies --- Run front/back environments with hot-reload**

- `yarn dev`

Then visit `http://localhost:9000` to access the application and `http://localhost:9999/api/` to directly hit API endpoints.

**Build frontend dist only**

- `yarn build`

**Run API in production mode and serve frontend dist**

- `yarn start`

The game is running @ `http://localhost:9999` enjoy...

**Run Game in Docker**

First replace _AWS_ACCESS_KEY_ID and _AWS_SECRET_ACCESS_KEY and then execute script like so
- `sh run_docker_container.sh`

The game will soon be running on port `9999`

## **Tips**

[The Patterns Behind Scalable, Reliable, and Performant Large-Scale Systems](https://github.com/binhnguyennus/awesome-scalability)  