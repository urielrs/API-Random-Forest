# results/urls.py

from django.urls import path
from .views import ResultsAPIView

urlpatterns = [
    # Esta es la única ruta de la API que necesitas
    path('api/model-results/', ResultsAPIView.as_view(), name='model_results'),
]