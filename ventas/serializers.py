from rest_framework import serializers
from .models import Venta, DetalleVenta
from productos.models import Producto
from sucursales.models import Sucursal

class DetalleVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleVenta
        fields = '__all__'

    def create(self, validated_data):
        producto = validated_data['producto']
        cantidad = validated_data['cantidad']
        if producto.stock < cantidad:
            raise serializers.ValidationError({'stock': 'No hay suficiente stock para este producto.'})
        producto.stock -= cantidad
        producto.save()
        return super().create(validated_data)

class VentaSerializer(serializers.ModelSerializer):
    detalles = DetalleVentaSerializer(many=True, read_only=True)
    sucursal = serializers.PrimaryKeyRelatedField(queryset=Sucursal.objects.all(), required=False, allow_null=True)
    class Meta:
        model = Venta
        fields = '__all__' 