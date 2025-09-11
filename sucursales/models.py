from django.db import models
from productos.models import Producto

class Sucursal(models.Model):
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=255)
    ciudad = models.CharField(max_length=100)
    activa = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} - {self.ciudad}"

class SucursalStock(models.Model):
    sucursal = models.ForeignKey(Sucursal, on_delete=models.CASCADE, related_name='stocks')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    stock = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('sucursal', 'producto')

    def __str__(self):
        return f"{self.sucursal.nombre} - {self.producto.nombre}: {self.stock}"
