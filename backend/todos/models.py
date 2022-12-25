from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.
class Todo(models.Model):
    creation_date = models.DateTimeField(auto_now_add=True, null=True)
    update_date = models.DateTimeField(auto_now=True, null=True)
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255, null=True, blank=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    deadline = models.DateTimeField(null=True, blank=True)
    done = models.BooleanField(default=False)