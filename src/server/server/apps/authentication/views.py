from django.http import HttpResponse

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token

from .serializers import SignUpSerializer

@api_view(['POST', ])
def sign_up(request):
    serializer = SignUpSerializer(data=request.data)
    data = {}
    if serializer.is_valid():
        user = serializer.save()
        data['response'] = "Successfully reqistered a new user."
        data['username'] = user.username
        data['token'] = Token.objects.get(user=user).key
    else:
        data = serializer.errors
    return Response(data)