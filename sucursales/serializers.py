from rest_framework import serializers
from .models import Sucursal, SucursalStock

class SucursalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sucursal
        fields = ['id', 'nombre', 'direccion', 'ciudad', 'activa']

class SucursalStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = SucursalStock
        fields = ['id', 'sucursal', 'producto', 'stock'] 