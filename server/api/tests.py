from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.test import TestCase

from .models import Stock, StockDay


class StockModelTests(TestCase):
    def test_full_clean_rejects_none_name(self):
        stock = Stock(ticker='AAPL', name=None)

        with self.assertRaises(ValidationError):
            stock.full_clean()

    def test_save_rejects_whitespace_name(self):
        with self.assertRaises(ValidationError):
            Stock.objects.create(ticker='AAPL', name='   ')

    def test_full_clean_rejects_ticker_with_trailing_newline(self):
        stock = Stock(ticker='AAPL\n', name='Apple')

        with self.assertRaises(ValidationError):
            stock.full_clean()


class StockDayModelTests(TestCase):
    def test_database_constraint_rejects_non_positive_price(self):
        stock = Stock.objects.create(ticker='AAPL', name='Apple')

        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                StockDay.objects.create(
                    stock=stock,
                    open_price=Decimal('0.00'),
                    close_price=Decimal('1.00'),
                    high_price=Decimal('1.00'),
                    low_price=Decimal('1.00'),
                    volume=1,
                )