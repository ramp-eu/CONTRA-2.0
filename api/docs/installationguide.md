## Prerequisites
In order to run the RS232-IoT-Agent you need:
* node (version >=10.16.0)
* npm (version 6.9.0)
​
installed on a target server hosting the application. 
​
## Installation and running RS232-IoT-Agent
​
Copy the upackaged application folder to the target server. Next, run the following commands inside the RS232-IoT-Agent root `src` folder to install required libraries:
​
```
npm install
```
​
To run the RS232-IoT-Agent use insider root `src` folder:
​
```
npm start
```
​
​
If application run correctly you should see:
```
RESTful API server started on: 5000
Both APIs started successfully
```
​
If you are connected with RS232 Converter on screen you shold see:
​
```
Connected
```
