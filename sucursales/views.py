from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Sucursal, SucursalStock
from .serializers import SucursalSerializer, SucursalStockSerializer
from carritos.models import Carrito, DetalleCarrito
from rest_framework import viewsets, permissions

# Create your views here.

class SucursalesDisponiblesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            carrito = Carrito.objects.get(usuario=request.user)
        except Carrito.DoesNotExist:
            return Response({'detail': 'No tienes carrito.'}, status=404)
        detalles = DetalleCarrito.objects.filter(carrito=carrito)
        if not detalles.exists():
            return Response({'detail': 'El carrito está vacío.'}, status=400)
        productos_cantidades = {d.producto_id: d.cantidad for d in detalles}
        sucursales = Sucursal.objects.filter(activa=True)
        disponibles = []
        for sucursal in sucursales:
            stocks = SucursalStock.objects.filter(sucursal=sucursal, producto_id__in=productos_cantidades.keys())
            if stocks.count() != len(productos_cantidades):
                continue  # No hay stock para todos los productos
            if all(stocks.get(producto_id=pid).stock >= cantidad for pid, cantidad in productos_cantidades.items()):
                disponibles.append(sucursal)
        serializer = SucursalSerializer(disponibles, many=True)
        return Response(serializer.data)

class SucursalViewSet(viewsets.ModelViewSet):
    queryset = Sucursal.objects.all()
    serializer_class = SucursalSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class SucursalStockViewSet(viewsets.ModelViewSet):
    queryset = SucursalStock.objects.all()
    serializer_class = SucursalStockSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# Si quieres exponer también el stock por sucursal, crea un serializer y viewset similar para SucursalStock
