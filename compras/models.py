from django.db import models
from proveedores.models import Proveedor
from productos.models import Producto

# Create your models here.

class CompraProveedor(models.Model):
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)

class DetalleCompraProveedor(models.Model):
    compra = models.ForeignKey(CompraProveedor, related_name='detalles', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
