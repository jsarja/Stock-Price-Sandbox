# Stock-Price-Sandbox
Application displays stock price data and statistical information from the price data graphically. Application is developed using Python and Django in the backend and React in the frontend.

Link to live application: https://stock-price-sandbox.herokuapp.com/

## Run Locally
**Run Server**
Open new terminal from project root:
```shell
cd src/server
(Create/Activate Python virtual environment if you want to)
pip install -r requirements.txt
python manage.py runserver
```

**Run Client**
Open new terminal from project root:
```shell
cd src/client
npm install
npm run start
```
If server is not running in port 8000 change the port number manually in src/client/src/settings.js to match the server's port number.

## Site Overview
Site requires user to register before using the application. Registration also requires user to have an [Alpha Vantage API key](https://www.alphavantage.co/support/#api-key) that is linked to user's profile. 

**User profile**

![User profile](https://imgur.com/RX1dWuY.png)

User profile page lets user to update the Alpha Vantage API key.

**Latest Daily**

![Latest Daily](https://imgur.com/HRPBnuw.png)

Latest Daily page plots price and other statistical information per minute from the latest trading day for the selected stock.
![Price Plot](https://imgur.com/s6iq127.png)

The plotting is done using Highcharts JavaScript library.

**Long-Term**

![Latest Daily](https://i.imgur.com/OTCQiZB.png)

Long-Term page plots price and other statistical information per day from the selected date range for the selected stock.

## API documentation
Under construction...
