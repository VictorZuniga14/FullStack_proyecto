from rest_framework import serializers
from .models import CompraProveedor, DetalleCompraProveedor
from productos.models import Producto

class DetalleCompraProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleCompraProveedor
        fields = '__all__'

    def create(self, validated_data):
        detalle = super().create(validated_data)
        producto = detalle.producto
        producto.stock += detalle.cantidad
        producto.save()
        return detalle

class CompraProveedorSerializer(serializers.ModelSerializer):
    detalles = DetalleCompraProveedorSerializer(many=True, read_only=True)
    class Meta:
        model = CompraProveedor
        fields = '__all__' 