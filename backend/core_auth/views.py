from django.utils.translation import gettext as _
from django.contrib.auth import authenticate
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer

def get_tokens_for_user(user):
    '''Mannualy create tokens for user'''
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

try:
    JWT_SETTINGS = settings.SIMPLE_JWT
except KeyError as e:
        raise ImproperlyConfigured(_("you must set SIMPLE_JWT in your settings file"))

@api_view(['POST', ])
def signin(request):
    username = request.data.get("username")
    password = request.data.get("password")
    # check username and password
    if not username or not password:
        return Response(_('Authentications credentials were not provided'), status=400)
    # check if user exist
    user = authenticate(username=username, password=password)
    if not user:
        return Response(_('Incorrect username or password'), status=403)
    # create jwt cookie for user
    tokens = get_tokens_for_user(user)
    response = Response(tokens)
    try:
        jwt_cookie_name = JWT_SETTINGS['ACCESS_TOKEN_COOKIE_NAME']
    except KeyError as e:
        raise ImproperlyConfigured(_("you must set SIMPLE_JWT['ACCESS_TOKEN_COOKIE_NAME']"))
    response.set_cookie(jwt_cookie_name, tokens['access'], samesite='None', secure=settings.USING_HTTPS, httponly=True, max_age=JWT_SETTINGS['ACCESS_TOKEN_LIFETIME'].total_seconds())
    return response

@api_view(["GET"])
@permission_classes([IsAuthenticated, ])
def check_auth(request):
    return Response(UserSerializer(request.user).data)   

@api_view(["GET"])
@permission_classes([IsAuthenticated, ])
def logout(request):
    response = Response('Ok')
    response.delete_cookie('jwt')
    return response   
        