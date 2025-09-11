from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from .models import Producto
from .serializers import ProductoSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import ProductoFilter

# Create your views here.

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [AllowAny]
    filterset_class = ProductoFilter
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'descripcion', 'marca', 'modelo']
    ordering_fields = ['precio', 'created_at', 'nombre']
    ordering = ['-created_at']
