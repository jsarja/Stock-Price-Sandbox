from rest_framework import serializers

from .models import User, APIUser

class SignUpSerializer(serializers.ModelSerializer):
    password_check = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    alpha_vantage_api_key = serializers.CharField()

    class Meta:
        model = User
        fields = ['username', 'password', 'password_check', 'alpha_vantage_api_key']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self):
        user = User(
            username = self.validated_data["username"]
        )
        pass1 = self.validated_data["password"]
        pass2 = self.validated_data["password_check"]

        if pass1 != pass2:
            raise serializers.ValidationError({'password': 'Passwords must match'})
        
        user.set_password(pass1)

        user.save()
        print(self.validated_data.keys())
        apiuser = APIUser(
            user=user, 
            alpha_vantage_api_key=self.validated_data["alpha_vantage_api_key"]
        )
        apiuser.save()

        return user

class SignInSerializer(serializers.Serializer):
    username = serializers.CharField(required = True)
    password = serializers.CharField(required = True)