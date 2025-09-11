from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SucursalesDisponiblesView, SucursalViewSet, SucursalStockViewSet

router = DefaultRouter()
router.register(r'sucursal', SucursalViewSet)
router.register(r'sucursal-stock', SucursalStockViewSet)

urlpatterns = [
    path('disponibles/', SucursalesDisponiblesView.as_view(), name='sucursales-disponibles'),
    path('', include(router.urls)),
] 