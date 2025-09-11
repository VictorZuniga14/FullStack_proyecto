from django.contrib import admin
from .models import Producto

class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'marca', 'modelo', 'precio', 'stock')
    search_fields = ('nombre', 'marca', 'modelo')

admin.site.register(Producto, ProductoAdmin)
