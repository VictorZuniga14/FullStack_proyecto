from rest_framework import serializers
from .models import Carrito, DetalleCarrito
from productos.serializers import ProductoSerializer

class DetalleCarritoSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    producto_id = serializers.PrimaryKeyRelatedField(queryset=DetalleCarrito._meta.get_field('producto').related_model.objects.all(), source='producto', write_only=True)

    def create(self, validated_data):
        carrito = validated_data['carrito']
        producto = validated_data['producto']
        cantidad = validated_data.get('cantidad', 1)
        try:
            detalle = DetalleCarrito.objects.get(carrito=carrito, producto=producto)
            detalle.cantidad += cantidad
            detalle.save()
        except DetalleCarrito.DoesNotExist:
            detalle = DetalleCarrito.objects.create(carrito=carrito, producto=producto, cantidad=cantidad)
        return detalle

    class Meta:
        model = DetalleCarrito
        fields = ['id', 'producto', 'producto_id', 'cantidad']

class CarritoSerializer(serializers.ModelSerializer):
    detalles = DetalleCarritoSerializer(many=True, read_only=True)

    class Meta:
        model = Carrito
        fields = ['id', 'usuario', 'creado', 'actualizado', 'activo', 'detalles'] 