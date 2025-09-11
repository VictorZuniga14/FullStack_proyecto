from rest_framework import serializers
from .models import Producto
from categorias.models import Categoria
from categorias.serializers import CategoriaSerializer

class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(),
        write_only=True,
        source='categoria'
    )
    imagen = serializers.SerializerMethodField()

    def get_imagen(self, obj):
        if obj.imagen:
            return obj.imagen.name.split('/')[-1]
        return ''

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'descripcion', 'precio', 'stock',
            'imagen', 'categoria', 'categoria_id', 'marca',
            'modelo', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at'] 