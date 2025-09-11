from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Venta, DetalleVenta
from .serializers import VentaSerializer, DetalleVentaSerializer

# Create your views here.

class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer
    permission_classes = [permissions.AllowAny]

class DetalleVentaViewSet(viewsets.ModelViewSet):
    queryset = DetalleVenta.objects.all()
    serializer_class = DetalleVentaSerializer
    permission_classes = [permissions.AllowAny]
