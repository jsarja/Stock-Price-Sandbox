from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from server.apps.authentication.models import APIUser
from .helpers import ValidationHelpers
from .errors import *
from .data_manager import DataManager

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def av_api_key(request):
    try:
        user = APIUser.objects.get(user=request.user)
    except APIUser.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response({"key": user.alpha_vantage_api_key})

    if request.method == 'PUT':
        if "alpha_vantage_api_key" not in request.data:
            return Response("Please provide new alpha_vantage_api_key value " + 
                "in request's body", status=status.HTTP_400_BAD_REQUEST)
        
        user.alpha_vantage_api_key = request.data["alpha_vantage_api_key"]
        user.save()
        return Response({"key": user.alpha_vantage_api_key})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_stock(request):
    print(request.GET.QueryDict)
    content = {
        'status': 'request was permitted'
    }
    return Response(content)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stock_data_latest_daily(request):
    # Validate user's query parameters.
    stock, error = ValidationHelpers.validate_latest_daily_request_data(request.GET)

    # If query params were not valid return error message and 400 status code.
    if error:
        return Response(error, status=status.HTTP_400_BAD_REQUEST)
    
    # Get data wanted from data manager and handle possible Errors.
    search_params = {"stock": stock}
    try:
        content = DataManager().construct_data("latest-daily", search_params, request)
    except InvalidStockNameError:
        return Response("Please provide a valid abbreviation of a stock", \
            status=status.HTTP_400_BAD_REQUEST)
    except NoInternetConnectionError:
        return Response("Could not connect to Alpha Vantage API (no internet connection)", \
            status=status.HTTP_503_SERVICE_UNAVAILABLE)

    return Response(content)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stock_data_long_term(request):
    # Validate user's query parameters.
    stock, start_date, end_date, error = \
        ValidationHelpers.validate_long_term_request_data(request.GET)

    # If query params were not valid return error message and 400 status code.
    if error:
        return Response(error, status=status.HTTP_400_BAD_REQUEST)
    
    # Get data wanted from data manager and handle possible Errors.
    search_params = {"stock": stock, "start_date": start_date, "end_date": end_date}
    try:
        content = DataManager().construct_data("long-term", search_params, request)
    except InvalidStockNameError:
        return Response("Please provide a valid abbreviation of a stock", \
            status=status.HTTP_400_BAD_REQUEST)
    except NoInternetConnectionError:
        return Response("Could not connect to Alpha Vantage API (no internet connection)", \
            status=status.HTTP_503_SERVICE_UNAVAILABLE)

    return Response(content)