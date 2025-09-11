from django.contrib import admin
from .models import Sucursal, SucursalStock

@admin.register(Sucursal)
class SucursalAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'direccion', 'ciudad', 'activa')
    search_fields = ('nombre', 'direccion', 'ciudad')
    list_filter = ('activa', 'ciudad')

@admin.register(SucursalStock)
class SucursalStockAdmin(admin.ModelAdmin):
    list_display = ('sucursal', 'producto', 'stock')
    search_fields = ('sucursal__nombre', 'producto__nombre')
    list_filter = ('sucursal',)
