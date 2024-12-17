from dj_rest_auth.views import (LogoutView,
                                PasswordResetConfirmView, )
from django.urls import path

from .views import LoginView, RegisterView, VerifyEmailView, TokenRefreshView, PasswordResetView, \
    UserProfileCourseListView, UserDetailsView

app_name = 'accounts'

urlpatterns = [
    path('api/auth/register/', RegisterView.as_view(), name='rest_register'),
    path('api/auth/login/token/', LoginView.as_view(), name='rest_login'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/logout/', LogoutView.as_view(), name='rest_logout'),
    path('api/auth/verify-email/',
         VerifyEmailView.as_view(), name='rest_verify_email'),
    # path('api/v1/auth/account-confirm-email/',
    #      VerifyEmailView.as_view(), name='rest_resend_email'),
    # re_path(r'^api/v1/auth/account-confirm-email/(?P<key>[-:\w]+)/$',
    #         VerifyEmailView.as_view(), name='account_confirm_email'),
    path('api/auth/password/reset/', PasswordResetView.as_view(), name='rest_password_reset'),
    path('api/auth/password/reset/confirm/',
         PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('api/auth/me/', UserDetailsView.as_view(), name='rest_user_details'),
    path('api/profile/courses/', UserProfileCourseListView.as_view(), name='profile-course-list'),
]
