from django.db import models

# Create your models here.

class Proveedor(models.Model):
    nombre = models.CharField(max_length=100)
    contacto = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.nombre
