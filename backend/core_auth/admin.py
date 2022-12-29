from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .forms import CustomUserChangeForm, CustomUserCreationForm
from .models import MyCustomUser
from django.contrib.auth.admin import UserAdmin


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = MyCustomUser
    list_display = ('username', 'is_staff', 'is_active',)
    list_filter = ('username', 'is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('username', 'password', 'first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'is_staff', 'is_active')}),
    )
    search_fields = ('username',)
    ordering = ('username',)


admin.site.register(MyCustomUser, CustomUserAdmin)