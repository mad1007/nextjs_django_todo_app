from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import TodoSerializer
from .models import Todo

class TodoView(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request, format=None):
        """
        Return a list of todos.
        """
        try:
            todos = Todo.objects.filter(user=request.user)
            serialized_data = TodoSerializer(todos, many=True)
            return Response(serialized_data.data)
        except Exception as e:
            return Response(str(e), status=400)
    
    def post(self, request):
        data = request.data
        todo_id = data.get("id")
        if data.get('deadline') == "":
            data.pop("deadline")
        if todo_id:
            try:
                todo = Todo.objects.get(id=todo_id)
                serializer = TodoSerializer(instance=todo, data=data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                else:
                    return Response(serializer.error_messages, status=400)

            except Todo.DoesNotExist as e:
                return Response(str(e), status=404)
        else:
            serializer = TodoSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=400)
    
    def delete(self, request):
        try:
            todo_id = request.data.get("id")
            todo = Todo.objects.get(id=todo_id)
            todo.delete()
            return Response("Ok", status=204)
        except Todo.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=500)




