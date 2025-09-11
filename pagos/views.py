from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.urls import reverse
from carritos.models import Carrito
from ventas.models import Venta, DetalleVenta

from transbank.webpay.webpay_plus.transaction import Transaction
from transbank.common.integration_type import IntegrationType
from transbank.common.options import WebpayOptions

COMMERCE_CODE = "597055555532"
API_KEY = "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C"

class IniciarPagoWebpayView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        try:
            carrito = Carrito.objects.get(usuario=user, activo=True)
            detalles = carrito.detalles.all()
            if not detalles:
                return Response({'error': 'El carrito está vacío.'}, status=status.HTTP_400_BAD_REQUEST)

            amount = sum(d.producto.precio * d.cantidad for d in detalles)
            buy_order = f"orden_{user.id}_{carrito.id}"
            session_id = f"session_{user.id}_{carrito.id}"
            return_url = "http://localhost:8000/api/pagos/confirmacion/"

            options = WebpayOptions(
                commerce_code=COMMERCE_CODE,
                api_key=API_KEY,
                integration_type=IntegrationType.TEST
            )
            tx = Transaction(options)
            response = tx.create(buy_order, session_id, amount, return_url)

            venta = Venta.objects.create(usuario=user, pagado=False, retirado=False)
            for d in detalles:
                DetalleVenta.objects.create(
                    venta=venta,
                    producto=d.producto,
                    cantidad=d.cantidad,
                    precio=d.producto.precio
                )
            venta.save()

            return Response({
                'url': response['url'],
                'token': response['token'],
                'venta_id': venta.id
            }, status=status.HTTP_200_OK)

        except Carrito.DoesNotExist:
            return Response({'error': 'No hay carrito activo para este usuario.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error en iniciar pago Webpay: {str(e)}")
            return Response({'error': 'Error interno del servidor.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ConfirmacionWebpayView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Redirigir al frontend local con mensaje de cancelación
        from django.shortcuts import redirect
        return redirect('http://localhost:3000/carrito?cancelado=1')

    def post(self, request):
        token = request.data.get('token_ws')
        if not token:
            return Response({'error': 'Falta token_ws'}, status=400)

        options = WebpayOptions(
            commerce_code=COMMERCE_CODE,
            api_key=API_KEY,
            integration_type=IntegrationType.TEST
        )
        tx = Transaction(options)

        result = tx.commit(token)
        buy_order = result['buy_order']

        try:
            user_id = int(buy_order.split('_')[1])
            venta = Venta.objects.filter(usuario_id=user_id, pagado=False).latest('id')
        except Exception as e:
            return Response({'error': 'Venta no encontrada o error: ' + str(e)}, status=400)

        venta.pagado = True
        venta.save()

        try:
            carrito = Carrito.objects.get(usuario_id=user_id, activo=True)
            carrito.detalles.all().delete()
        except Carrito.DoesNotExist:
            pass

        from django.shortcuts import redirect
        return redirect('http://localhost:3000/compra-exitosa')
