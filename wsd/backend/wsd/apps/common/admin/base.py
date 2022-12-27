from admin_auto_filters.filters import AutocompleteFilterFactory as Autocomplete
from django.contrib.admin import ModelAdmin
from django.utils.translation import gettext_lazy as _
from django_object_actions import DjangoObjectActions

from apps.common.models import BaseModel


class BaseAdmin(DjangoObjectActions, ModelAdmin):
    search_fields = []
    update_readonly_fields = []
    create_readonly_fields = []
    list_filter = []
    autocomplete_list_filter = []
    list_display = []
    META_FIELDS = BaseModel.FIELDS
    object_fieldsets = []
    meta_fieldsets = [[META_FIELDS, "Meta"]]
    safe_m2m_fields = []

    @staticmethod
    def make_fieldset_field(*fields, name):
        return [_(name), {"fields": fields}]

    def get_list_filter(self, request):
        autocomplete_filters = [Autocomplete(_(f.title()), f) for f in self.autocomplete_list_filter]
        return autocomplete_filters + self.list_filter

    def get_search_fields(self, request):
        return self.search_fields + BaseModel.FIELDS

    def get_readonly_fields(self, request, obj=None):
        update, create, base = self.update_readonly_fields, self.create_readonly_fields, BaseModel.FIELDS
        return update + base if obj else create + base

    def get_list_display(self, request):
        return self.list_display + BaseModel.FIELDS

    def get_fieldsets(self, request, obj=None):
        object_fieldsets = [self.make_fieldset_field(*fields, name=name) for fields, name in self.object_fieldsets]
        meta_fieldsets = [self.make_fieldset_field(*fields, name=name) for fields, name in self.meta_fieldsets]
        return object_fieldsets + meta_fieldsets if obj else object_fieldsets

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name in self.safe_m2m_fields:
            db_field.remote_field.through._meta.auto_created = True
            form_field = super().formfield_for_manytomany(db_field, request, **kwargs)
            db_field.remote_field.through._meta.auto_created = False
        else:
            form_field = super().formfield_for_manytomany(db_field, request, **kwargs)
        return form_field
