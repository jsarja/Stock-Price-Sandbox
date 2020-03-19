import abc
from alpha_vantage.timeseries import TimeSeries
from requests.exceptions import ConnectionError

from helpers import DateHelpers


class IDataService(abc.ABC):
    @abc.abstractmethod
    def __init__(self, request):
        pass

    @abc.abstractclassmethod
    def get_latest_daily_data(self, stock):
        pass 

    @abc.abstractclassmethod
    def get_longterm_data(self, stock, start, end):
        pass


class AlphaVantageDataService(IDataService):
    def __init__(self, request):
        self.request = request
        #self.time_series_obj = 

    def get_latest_daily_data(self, stock):
        # Init alpha vatage client.
        key = 'fsghehr' #TODO: APIUser.objects.get(user=self.request.user).alpha_vantage_api_key
        ts = TimeSeries(key)
        
        # Get intraday data from the selected stock
        try:
            stock_data, _ = ts.get_intraday(
                symbol=stock, interval='1min', outputsize="full"
            )
        except ValueError:
            # TODO: Raise invalid stock name error
            return
        except ConnectionError:
            # TODO: Raise NoInternetConnectionError
            return
        
        # Get only the data points that are from the latest day.
        all_dates = list(stock_data.keys())
        i = 0
        while all_dates[i].startswith(all_dates[0][:10]):
            i += 1
        dates = all_dates[:i]
        dates.reverse()

        prices = [stock_data[date]["4. close"] for date in dates]

        return {"prices": prices, "dates": dates}

    def get_longterm_data(self, stock, start, end):
         # Init alpha vatage client.
        key = 'fsghehr' #TODO: APIUser.objects.get(user=self.request.user).alpha_vantage_api_key
        ts = TimeSeries(key)

         # Get intraday data from the selected stock
        try:
            stock_data, _ = ts.get_daily(
                symbol=stock, outputsize="full"
            )
        except ValueError:
            # TODO: Raise invalid stock name error
            return
        except ConnectionError:
            # TODO: Raise NoInternetConnectionError
            return
        # TODO, jos käyttänyt yli 5 kertaa minuutissa APIta
        all_dates = list(stock_data.keys())
        all_dates.reverse()

        # Get the indicies where the wanted start and end dates are or the
        # first indicies which are inside start and end boundaries. 
        start_index = 0
        for i, date in enumerate(all_dates):
            if date == start or DateHelpers.string_date_is_smaller(start, date):
                start_index = i
                break   
        end_index = len(all_dates)-1
        for i, date in enumerate(all_dates[start_index:]):
            if date == end:
                end_index = start_index+i
                break
            if DateHelpers.string_date_is_smaller(end, date):
                end_index = start_index+i-1
                break

        dates = all_dates[start_index:end_index+1]
        prices = [stock_data[date]["4. close"] for date in dates]
        return {"prices": prices, "dates": dates}


