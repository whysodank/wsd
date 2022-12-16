from django import forms
from django.conf import settings
from django.contrib.admin.widgets import SELECT2_TRANSLATIONS, AutocompleteMixin, get_language
from django.urls import reverse

from .mixins import AutocompleteViewSetMixin


class RestAutoCompleteFieldWidgetMixin(AutocompleteMixin):
    def __init__(self, *a, **kw):  # NOQA
        self.db_field = kw.pop("db_field")
        self.field = self.db_field
        self.attrs = kw.get("attrs") or {}
        self.choices = kw.get("choices") or ()
        self.db = None

    def get_url(self):
        viewset = AutocompleteViewSetMixin._model_viewset_map.get(self.db_field.target_field.model)
        if not getattr(viewset, "endpoint", None):
            raise ValueError("You should set your viewset.endpoint as your `basename` from your router.register")
        # return reverse(viewset.endpoint + "-list")
        # This is not ideal, but no need to spend so much time on this until we go to v2
        return reverse(f"rest:v1:{viewset.endpoint}-list")

    @property
    def media(self):
        extra = "" if settings.DEBUG else ".min"
        i18n_name = SELECT2_TRANSLATIONS.get(get_language())
        i18n_file = "admin/js/vendor/select2/i18n/%s.js" % i18n_name

        # Static files
        js_jquery = "admin/js/vendor/jquery/jquery%s.js" % extra
        js_select2 = "admin/js/vendor/select2/select2.full%s.js" % extra
        js_jquery_init = "admin/js/jquery.init.js"
        js_autocomplete = "autocomplete_filters/js/autocomplete.js"
        css_select2 = "admin/css/vendor/select2/select2%s.css" % extra
        css_autocomplete = "autocomplete_filters/css/autocomplete.css"

        return forms.Media(
            js=(js_jquery, js_select2, i18n_file, js_jquery_init, js_autocomplete),
            css={"screen": (css_select2, css_autocomplete)},
        )


class AutocompleteSelect(RestAutoCompleteFieldWidgetMixin, forms.Select):
    ...


class AutocompleteSelectMultiple(RestAutoCompleteFieldWidgetMixin, forms.SelectMultiple):
    ...
