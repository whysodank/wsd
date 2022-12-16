class AttrDict(dict):
    __getattr__ = dict.__getitem__
    __setattr__ = dict.__setitem__

    @classmethod
    def from_data(cls, data: dict):
        for key, value in data.items():
            if isinstance(value, dict):
                data[key] = cls.from_data(value)
        return cls(**data)
