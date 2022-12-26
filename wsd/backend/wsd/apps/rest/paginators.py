from rest_framework.pagination import PageNumberPagination


class CustomizablePageNumberPaginator(PageNumberPagination):
    page_size_query_param = "page_size"


def page_number_pagination(page_size=10):
    return type("PageNumberPagination", (PageNumberPagination,), {"page_size": page_size})
