from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.utils.module_loading import import_string

from rest_framework import authentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed, TokenError


try:
    JWT_SETTINGS = settings.SIMPLE_JWT
except KeyError:
    raise ImproperlyConfigured(_('SIMPLE_JWT dict not found in your settings'))


class CookieJWTAuthentication(authentication.BaseAuthentication):
    """
    An authentication plugin that authenticates requests through a JSON web
    token provided in a request cookie.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user_model = get_user_model()

    def authenticate(self, request):
        try:
            cookie = request.COOKIES.get(JWT_SETTINGS["ACCESS_TOKEN_COOKIE_NAME"])
        except KeyError:
            raise InvalidToken(_("SIMPLE_JWT['ACCESS_TOKEN_COOKIE_NAME']  not found in your SIMPLE_JWT configuration"))

        if not cookie:
            return None
        validated_token = self.get_validated_token(cookie)
        return self.get_user(validated_token), validated_token


    def get_validated_token(self, raw_token):
        """
        Validates an encoded JSON web token and returns a validated token
        wrapper object.
        """
        messages = []

        for AuthToken in JWT_SETTINGS["AUTH_TOKEN_CLASSES"]:
            AuthTokenClass = import_string(AuthToken)
            try:
                return AuthTokenClass(raw_token)
            except TokenError as e:
                messages.append(
                    {
                        "token_class": AuthTokenClass.__name__,
                        "token_type": AuthTokenClass.token_type,
                        "message": e.args[0],
                    }
                )

        raise InvalidToken(
            {
                "detail": _("Given token not valid for any token type"),
                "messages": messages,
            }
        )


    def get_user(self, validated_token):
        """
        Attempts to find and return a user using the given validated token.
        """
        try:
            user_id = validated_token[JWT_SETTINGS["USER_ID_CLAIM"]]
        except KeyError:
            raise InvalidToken(_("Token contained no recognizable user identification"))

        try:
            user = self.user_model.objects.get(**{JWT_SETTINGS["USER_ID_FIELD"]: user_id})
        except self.user_model.DoesNotExist:
            raise AuthenticationFailed(_("User not found"), code="user_not_found")

        if not user.is_active:
            raise AuthenticationFailed(_("User is inactive"), code="user_inactive")

        return user

