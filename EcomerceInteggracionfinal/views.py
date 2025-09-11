from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.conf import settings
import requests
import json
import time
import traceback
import base64
import hashlib
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            username = request.data.get('username')
            password = request.data.get('password')

            if not username or not password:
                return Response(
                    {'error': 'El nombre de usuario y la contraseña son requeridos'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            if User.objects.filter(username=username).exists():
                return Response(
                    {'error': 'Este nombre de usuario ya está en uso'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                validate_password(password)
            except ValidationError as e:
                return Response(
                    {'error': 'La contraseña no cumple con los requisitos de seguridad'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = User.objects.create_user(
                username=username,
                password=password,
                email=f"{username}@example.com"  # Email temporal
            )

            return Response({
                'message': 'Usuario creado exitosamente',
                'user': {
                    'id': user.id,
                    'username': user.username
                }
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': 'Error al crear el usuario: ' + str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username
        }) 