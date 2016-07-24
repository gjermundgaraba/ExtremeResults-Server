# ExtremeResults-Server
The backend Server with RESTful API's for ExtremeResults

This server is used by the Extreme Results Web App, for which the code can be found here:
https://github.com/bjaanes/ExtremeResults-WebApp

## Technology

The server is build using Node.js and Express and exposes a set of API's that can be found in the API.md file.


## Installation

### Requirements:

* Node.js with npm

### Setup

#### Install dependencies for building:
```bash
npm install
```


#### Build and run

To build and run the application, you can just use
```bash
npm start
```

When starting the application, there are several environment variables that are searched for, but none of them are required:

| Environment Variable	| Description	    | Default Value                 |
| --------------------	| -----------	    | -------------                 |
| PORT			        | Server port	    | 4321		                    |
| MONGO_SERVER          | Mongo server url  | mongodb://localhost/xr        |
| MONGO_USERNAME        | Mongo username    | Nothing - for no auth server  |     
| MONGO_PASSWORD        | Monog passowrd    | Nothing - for no auth server  |


#### Tests

The server is tested using some Unit Tests and a lot of Integration Tests.

##### Unit tests

To run the unit tests in a TDD matter
```bash
npm test
```

##### Integration Tests

To run the Integration Tests
```bash
npm run it
```
