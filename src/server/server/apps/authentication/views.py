from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token

from django.contrib.auth import authenticate

from .serializers import SignUpSerializer, SignInSerializer
from .models import APIUser
from .tokens import expires_in, get_token

@api_view(['POST', ])
def sign_up(request):
    serializer = SignUpSerializer(data=request.data)
    data = {}
    req_status = status.HTTP_201_CREATED
    if serializer.is_valid():
        user = serializer.save()
        data['response'] = "Successfully reqistered a new user."
        data['username'] = user.username
        data['token'] = Token.objects.get(user=user).key
    else:
        data = serializer.errors
        req_status = status.HTTP_400_BAD_REQUEST
    print(data)
    return Response(data, status=req_status)

@api_view(['POST', ])
def sign_in(request):
    serializer = SignInSerializer(data=request.data)
    data = {}
    req_status = status.HTTP_200_OK
    if serializer.is_valid():
        print(serializer.validated_data)
        user = authenticate(
            username = serializer.validated_data['username'],
            password = serializer.validated_data['password'] 
        )
        if not user:
            data['password'] = 'Unable to log in with provided credentials.'
            req_status = status.HTTP_400_BAD_REQUEST
        else:
            token, _ = Token.objects.get_or_create(user = user)
            _, token = get_token(token)
            data['expiresIn'] = expires_in(token)
            data['token'] = token.key
    else:
        data = serializer.errors
        req_status = status.HTTP_400_BAD_REQUEST
    return Response(data, status=req_status)