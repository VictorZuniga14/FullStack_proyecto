from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Carrito, DetalleCarrito
from .serializers import CarritoSerializer, DetalleCarritoSerializer
from productos.models import Producto
from django.contrib.auth.models import User

class CarritoViewSet(viewsets.ModelViewSet):
    queryset = Carrito.objects.all()
    serializer_class = CarritoSerializer
    permission_classes = [permissions.IsAuthenticated]  # ✅ CAMBIADO

    def get_queryset(self):
        return Carrito.objects.filter(usuario=self.request.user)

    @action(detail=False, methods=['get'])
    def mi_carrito(self, request):
        carrito, created = Carrito.objects.get_or_create(usuario=request.user, activo=True)
        serializer = self.get_serializer(carrito)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def vaciar(self, request):
        carrito = get_object_or_404(Carrito, usuario=request.user, activo=True)
        carrito.detalles.all().delete()
        return Response({'status': 'Carrito vaciado'})


class DetalleCarritoViewSet(viewsets.ModelViewSet):
    queryset = DetalleCarrito.objects.all()
    serializer_class = DetalleCarritoSerializer
    permission_classes = [permissions.IsAuthenticated]  # ✅ CAMBIADO

    def get_queryset(self):
        carrito, created = Carrito.objects.get_or_create(usuario=self.request.user, activo=True)
        return DetalleCarrito.objects.filter(carrito=carrito)

    def perform_create(self, serializer):
        carrito, created = Carrito.objects.get_or_create(usuario=self.request.user, activo=True)
        serializer.save(carrito=carrito)
