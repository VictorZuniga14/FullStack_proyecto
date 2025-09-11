from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarritoViewSet, DetalleCarritoViewSet

router = DefaultRouter()
router.register(r'carrito', CarritoViewSet, basename='carrito')
router.register(r'detalle-carrito', DetalleCarritoViewSet, basename='detallecarrito')

urlpatterns = [
    path('', include(router.urls)),
] 