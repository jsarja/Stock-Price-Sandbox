#data_managers.py
from .services import *
import numpy as np

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

        # for option in plot_options
        # Call PlotCalculators.factory[option.plot](option.kwargs)

        # Return {option.plot: PlotCalculators.factory[option.plot](plot_data, option.kwargs)}
        return {"avg": PlotCalculators.average(stock_data["prices"])}
        return {}

def numpy_converter(input_func):
    def numpify(*args, **kwargs):
        price_list = np.array(args[0])
        result = input_func(price_list, **kwargs)
        return result.tolist()
    return numpify

class PlotCalculators:
    factory = {}

    @staticmethod
    @numpy_converter
    def average(price_data, **kwargs):
        return np.repeat(np.average(price_data), price_data.shape[0])
