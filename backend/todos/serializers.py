from rest_framework import serializers
from .models import Todo

# Create your models here.
class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = "__all__"
    
    def to_representation(self, instance):
        obj = super().to_representation(instance)
        obj["creation_date"] = instance.creation_date.strftime("%Y-%m-%d %H:%M")
        if instance.deadline:
            obj["deadline"] = instance.deadline.strftime("%Y-%m-%d %H:%M")
        return obj