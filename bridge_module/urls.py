from django.urls import path
from . import views

urlpatterns = [
    path('location-data/', views.location_data_view, name='bridge-location-data'),
    path('validate-geometry/', views.validate_geometry_view, name='bridge-validate-geometry'),
    path('validate-girder-geometry/', views.validate_girder_geometry_view, name='bridge-validate-girder-geometry'),
]
