import django_filters
from .models import Producto

class ProductoFilter(django_filters.FilterSet):
    precio_min = django_filters.NumberFilter(field_name="precio", lookup_expr='gte')
    precio_max = django_filters.NumberFilter(field_name="precio", lookup_expr='lte')

    class Meta:
        model = Producto
        fields = ['categoria', 'marca', 'precio_min', 'precio_max'] 