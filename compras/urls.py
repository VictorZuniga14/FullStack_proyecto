from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompraProveedorViewSet, DetalleCompraProveedorViewSet

router = DefaultRouter()
router.register(r'compras-proveedor', CompraProveedorViewSet)
router.register(r'detalle-compras-proveedor', DetalleCompraProveedorViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 