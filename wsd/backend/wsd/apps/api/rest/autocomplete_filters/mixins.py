class AutocompleteViewSetMixin:
    _model_viewset_map = {}

    def __init_subclass__(cls, **kwargs):
        if getattr(cls, "serializer_class", None):
            AutocompleteViewSetMixin._model_viewset_map[cls.serializer_class.Meta.model] = cls
        super().__init_subclass__(**kwargs)
