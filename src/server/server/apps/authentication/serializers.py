from rest_framework import serializers

from .models import User, APIUser

class SignUpSerializer(serializers.ModelSerializer):
    passwordCheck = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'passwordCheck']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self):
        user = User(
            username = self.validated_data["username"]
        )
        pass1 = self.validated_data["password"]
        pass2 = self.validated_data["passwordCheck"]

        if pass1 != pass2:
            raise serializers.ValidationError({'password': 'Passwords must match'})
        
        user.set_password(pass1)

        user.save()

        apiuser = APIUser(user=user)
        apiuser.save()

        return user

class SignInSerializer(serializers.Serializer):
    username = serializers.CharField(required = True)
    password = serializers.CharField(required = True)