# results/serializers.py

from rest_framework import serializers

class MalwareDetectionResultSerializer(serializers.Serializer):
    """
    Define la estructura de los resultados significativos del modelo
    Random Forest, tal como se extrajeron del notebook.
    """
    title = serializers.CharField(max_length=200)
    model_type = serializers.CharField(max_length=50)
    
    # Métricas clave
    f1_score_con_escalado = serializers.FloatField()
    f1_score_sin_escalado = serializers.FloatField()
    
    # Conclusión e Interpretación
    conclusion = serializers.CharField()
    
    # Importancia de las Características (lista de strings)
    features_importantes = serializers.ListField(
        child=serializers.CharField(max_length=100)
    )