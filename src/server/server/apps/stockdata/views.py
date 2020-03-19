from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from server.apps.authentication.models import APIUser

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
    content = {
        'status': 'request was permitted'
    }
    return Response(content)
