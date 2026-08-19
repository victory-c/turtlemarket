from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse

# Create your tests here.
class APITests(APITestCase):
  def setUp(self):
    self.test_url = reverse('test')
  
  def test_get_test(self):
    response = self.client.get(self.test_url)

    self.assertContains(response, "hello world")