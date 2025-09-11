from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Categoria
from .serializers import CategoriaSerializer

# Create your views here.

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.AllowAny]
