from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Proveedor
from .serializers import ProveedorSerializer

# Create your views here.

class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [permissions.AllowAny]
