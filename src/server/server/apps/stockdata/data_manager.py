import numpy as np
import pandas as pd
from .services import *
from .errors import InvalidPlotOptionParameter

class DataManager:
    def __init__(self):
        self.__data_service = AlphaVantageDataService

    @property
    def data_service(self):
        return self.__data_service

    @data_service.setter
    def data_service(self, service):
        if isinstance(service(None), IDataService):
            self.__data_service = service

    def construct_data(self, mode, search_params, request, plot_options=None):
        stock_price_data = self.__fetch_stock_data(mode, search_params, request)

        other_plot_data = self.__create_other_plot_data(
            stock_price_data, plot_options)

        return {'stock_data': stock_price_data, 'plot_data': other_plot_data}

    def __fetch_stock_data(self, mode, search_params, request):
        # Get data from service.
        service = self.__data_service(request)
        if mode == "latest-daily":
            data = service.get_latest_daily_data(search_params["stock"])
        elif mode == "long-term":
            data = service.get_longterm_data(search_params["stock"], 
                search_params["start_date"], search_params["end_date"])
        else:
            data = {"prices:": [], "dates": []}
        
        return data

    def __create_other_plot_data(self, stock_data, plot_options):
        # Plot option is list of dicts, dict keys: 'plot', 'kwargs'
        res = {}
        for option in plot_options:
            if option["name"] not in PlotCalculators.factory:
                res[option["name"]] = []

            plot_func =  PlotCalculators.factory[option["name"]]
            if "params" in option:
                for value in option["params"].values():
                    if not isinstance(value, int):
                        raise InvalidPlotOptionParameter

                plot_data = plot_func(stock_data["prices"], **option["params"])
            else:
                plot_data = plot_func(stock_data["prices"])
            res[option["name"]] = plot_data

        return res

def numpy_converter(input_func):
    def numpify(*args, **kwargs):
        price_list = np.array(args[0])
        result = input_func(price_list, **kwargs)
        return result.tolist()
    return numpify



class PlotCalculators:
    @staticmethod
    @numpy_converter
    def average(price_data, **kwargs):
        return np.repeat(np.average(price_data), price_data.shape[0])

    @staticmethod
    @numpy_converter
    def moving_average(price_data, **kwargs):
        window_size = PlotCalculators.get_window_size(price_data, kwargs)
        
        price_series = pd.Series(price_data)
        moving_averages = price_series.rolling(window_size).mean()
        moving_averages = moving_averages.where(pd.notnull(moving_averages), None)
        return moving_averages.to_numpy()

    @staticmethod
    @numpy_converter
    def median(price_data, **kwargs):
        return np.repeat(np.median(price_data), price_data.shape[0])

    @staticmethod
    @numpy_converter
    def moving_median(price_data, **kwargs):
        window_size = PlotCalculators.get_window_size(price_data, kwargs)
        
        price_series = pd.Series(price_data)
        moving_median = price_series.rolling(window_size).median()
        moving_median = moving_median.where(pd.notnull(moving_median), None)
        return moving_median.to_numpy()

    @staticmethod
    @numpy_converter
    def std(price_data, **kwargs):
        return np.repeat(np.std(price_data), price_data.shape[0])

    @staticmethod
    @numpy_converter
    def moving_std(price_data, **kwargs):
        window_size = PlotCalculators.get_window_size(price_data, kwargs)
        
        price_series = pd.Series(price_data)
        moving_std = price_series.rolling(window_size).std()
        moving_std = moving_std.where(pd.notnull(moving_std), None)
        return moving_std.to_numpy()
    
    @staticmethod
    @numpy_converter
    def minimum(price_data, **kwargs):
        if "limit" not in kwargs:
            return np.repeat(np.min(price_data), price_data.shape[0])

        min_percentage = kwargs["limit"]
        data_points = int(price_data.shape[0] * min_percentage/100)
        data_points = data_points if data_points > 0 else 1
        idx = np.argpartition(price_data, data_points)
        last_min = price_data[idx[data_points-1]]
        return np.repeat(last_min, price_data.shape[0])
    
    @staticmethod
    @numpy_converter
    def moving_min(price_data, **kwargs):
        window_size = PlotCalculators.get_window_size(price_data, kwargs)

        price_series = pd.Series(price_data)

        if "limit" not in kwargs:
            moving_min = price_series.rolling(window_size).min()
            moving_min = moving_min.where(pd.notnull(moving_min), None)
            return moving_min.to_numpy()
        
        min_percentage = kwargs["limit"]
        data_points = int(window_size * min_percentage/100)
        data_points = data_points if data_points > 0 else 1
        
        rolling_values = [None]*(window_size-1)
        for i in range(price_data.shape[0]-window_size+1):
            window = price_data[i:i+window_size]
            idx = np.argpartition(window, data_points)
            rolling_values.append(window[idx[data_points-1]])

        return np.array(rolling_values)
    
    @staticmethod
    @numpy_converter
    def maximum(price_data, **kwargs):
        if "limit" not in kwargs:
            return np.repeat(np.max(price_data), price_data.shape[0])
            
        max_percentage = kwargs["limit"]
        data_points = - int(price_data.shape[0] * max_percentage/100)
        data_points = data_points if data_points < 0 else 1
        idx = np.argpartition(price_data, data_points)
        last_max = price_data[idx[data_points]]
        return np.repeat(last_max, price_data.shape[0])

    @staticmethod
    @numpy_converter
    def moving_max(price_data, **kwargs):
        window_size = PlotCalculators.get_window_size(price_data, kwargs)

        price_series = pd.Series(price_data)

        if ("limit" not in kwargs) or not(0 <= kwargs["limit"] <= 100):
            moving_max = price_series.rolling(window_size).max()
            moving_max = moving_max.where(pd.notnull(moving_max), None)
            return moving_max.to_numpy()
        
        max_percentage = kwargs["limit"]
        data_points = - int(window_size * max_percentage/100)
        data_points = data_points if data_points < 0 else 1
        
        rolling_values = [None]*(window_size-1)
        for i in range(price_data.shape[0]-window_size+1):
            window = price_data[i:i+window_size]
            idx = np.argpartition(window, data_points)
            rolling_values.append(window[idx[data_points]])

        return np.array(rolling_values)

    @staticmethod
    def get_window_size(price_data, params_dict):
        window_size = params_dict.get("window", 20)
        if window_size > price_data.shape[0]:
            window_size = price_data.shape[0]
        return window_size

    factory = {
        'average': average.__func__,
        'moving_average': moving_average.__func__,
        'median': median.__func__,
        'moving_median': moving_median.__func__,
        'std': std.__func__,
        'moving_std': moving_std.__func__,
        'min': minimum.__func__,
        'moving_min': moving_min.__func__,
        'max': maximum.__func__,
        'moving_max': moving_max.__func__,
    }