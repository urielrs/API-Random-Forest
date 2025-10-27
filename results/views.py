# results/views.py

import json
import os
from django.conf import settings
from pathlib import Path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Ruta del archivo de resultados. Asegúrate que esta ruta es correcta
# (Debe ser relativa a la carpeta superior de 'results')
RESULTS_FILE_PATH = os.path.join(settings.BASE_DIR, 'MalwareProject', 'final_model_results.json')

class ResultsAPIView(APIView):
    """
    API que sirve los resultados pre-calculados del notebook.
    """

    def get(self, request, *args, **kwargs):
        try:
            with open(RESULTS_FILE_PATH, 'r') as f:
                data = json.load(f)
            
            # Devuelve el contenido del archivo JSON directamente
            return Response(data, status=status.HTTP_200_OK)
            
        except FileNotFoundError:
            return Response(
                {"error": "El archivo de resultados (final_model_results.json) no fue encontrado. Asegúrate de haber ejecutado el notebook y guardado el archivo en la ruta correcta."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except json.JSONDecodeError:
            return Response(
                {"error": "Error al leer o decodificar el archivo JSON de resultados."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
