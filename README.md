# Software Engineering Final Project

## overview
This repository has writen by node.js code. \
The repository manages a database of Covid-19 patients.\
The database storges details of patients, people the patients met, thier covid-tests and status statistics. 

## Getting started
- Clone the repository
- Download and install API development environment such as [Poasman](https://www.postman.com/downloads/) or [Swagger](https://swagger.io/)
- Download and install [Node.js](https://nodejs.org/en/download/)
- Install NPM on the command line 
```bash
$npm install -g npm
```
- Verify installation and version on the command line
```bash
$node -v
``` 
and also
```bash
$npm -v
```
- Install Express-feature on the command line
```bash
$npm install express
$npm install express-validator
```
### Running tests 
For running tests install dev dependencies \
Install on the command line Mocha-Chai-feature
```bash
$npm install mocha chai
$npm install chai-http
``` 
- Install SuperTest-feature on the command line 
```bash
$npm install supertest
```
## Running tests
enter the following:
```bash
$npm run test
```
## Running
- Navigate to the repository folder 
- Run on the command line for starting a server 
```bash
$node .
```
The server should return the message  
```listening on port 3000```
- By using the API send requests to the data base \
- Send rest request to ```http://localhost:3000/```
### Commands
> ***Post*** 
>> patients/potential/{potentialPatientId} \
>> labtests 

> ***Get*** 
>> patients \
>> patients/{id}/route \
>> patients/{id}/encounters \
>> patients/{id}/full \
>> patients/new?since=[VALUE] \
>> patients/potential \
>> patients/isolated \
>> statistics 

> ***Put*** 
>> patients \
>> patients/{id}/route \
>> patients/{id}/encounters

## Authors
* [Amit Zohar](https://github.com/AmitGZ)
* [Naor Tiran](https://github.com/NaorTIRAM)
* [Shahar Ben Tov](https://github.com/sbt94)
## License
This project is under the [MIT license](https://en.wikipedia.org/wiki/MIT_License)

## Open Server
send rest request to this link ```http://ruppin2022.herokuapp.com```

## Class Diagram 
![Class Diagram](https://user-images.githubusercontent.com/88660222/155901046-593564d9-c2c4-4792-b87d-98e38758e37b.jpeg)
