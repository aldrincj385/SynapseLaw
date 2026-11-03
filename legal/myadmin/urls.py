from django.urls import path
from . import views

urlpatterns = [
    path('', views.main_home, name='main_home'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login_view'),
    path('logout/', views.logout_view, name='logout_view'),
    path('profile/', views.profile_view, name='profile_view'),
    path('analyze/', views.analyze_document, name='analyze_document'),
    path('analysis/', views.analysis_page, name='analysis_page'),
]