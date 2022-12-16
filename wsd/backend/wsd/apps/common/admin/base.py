from admin_auto_filters.filters import AutocompleteFilterFactory as Autocomplete
from django.contrib.admin import ModelAdmin
from django.utils.translation import gettext_lazy as _
from apps.common.models import Base


class BaseAdmin(ModelAdmin):
    list_display = Base.FIELDS
    readonly_fields = Base.FIELDS
    search_fields = Base.FIELDS

    @staticmethod
    def make_fieldset_field(*fields, name):
        return [_(name), {"fields": fields}]

    def get_fieldsets(self, request, obj=None):
        return [self.make_fieldset_field(*Base.FIELDS, name="Meta")]

    def get_list_filter(self, request):
        list_filter = super().get_list_filter(request)
        return type(list_filter)(
            [Autocomplete(_(f.title()), f) if f in self.autocomplete_fields else f for f in list_filter]
        )
