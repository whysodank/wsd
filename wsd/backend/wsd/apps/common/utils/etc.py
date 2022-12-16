def with_attrs(**kwargs):
    def decorator(func):
        for key, value in kwargs.items():
            setattr(func, key, value)
        return func

    return decorator


def returns(value):
    def wrapper(*a, **kw):
        return value

    return wrapper
