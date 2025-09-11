from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import CompraProveedor, DetalleCompraProveedor
from .serializers import CompraProveedorSerializer, DetalleCompraProveedorSerializer

# Create your views here.

class CompraProveedorViewSet(viewsets.ModelViewSet):
    queryset = CompraProveedor.objects.all()
    serializer_class = CompraProveedorSerializer
    permission_classes = [permissions.AllowAny]

class DetalleCompraProveedorViewSet(viewsets.ModelViewSet):
    queryset = DetalleCompraProveedor.objects.all()
    serializer_class = DetalleCompraProveedorSerializer
    permission_classes = [permissions.AllowAny]
