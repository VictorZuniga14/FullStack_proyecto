from django.contrib import admin
from .models import CompraProveedor, DetalleCompraProveedor

# Register your models here.
admin.site.register(CompraProveedor)
admin.site.register(DetalleCompraProveedor)
