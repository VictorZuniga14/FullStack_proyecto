"""EcomerceInteggracionfinal URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, MeView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/categorias/', include('categorias.urls')),
    path('api/productos/', include('productos.urls')),
    path('api/proveedores/', include('proveedores.urls')),
    path('api/compras/', include('compras.urls')),
    path('api/ventas/', include('ventas.urls')),
    path('api/carritos/', include('carritos.urls')),
    path('api/pagos/', include('pagos.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('api/auth/me/', MeView.as_view(), name='me'),
    path('api/sucursales/', include('sucursales.urls')),
]
