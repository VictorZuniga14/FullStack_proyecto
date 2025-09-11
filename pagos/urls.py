from django.urls import path
from .views import IniciarPagoWebpayView, ConfirmacionWebpayView

urlpatterns = [
    path('iniciar/', IniciarPagoWebpayView.as_view(), name='webpay_iniciar'),
    path('confirmacion/', ConfirmacionWebpayView.as_view(), name='webpay_confirmacion'),
] 