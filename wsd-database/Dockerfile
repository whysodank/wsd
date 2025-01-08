FROM postgres:14

WORKDIR /wsd-database

RUN apt-get update && \
    apt-get install -y \
        git \
        build-essential \
        postgresql-server-dev-14 \
        libxml2-dev \
        libxslt-dev && \
    rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/whysodank/pg_similarity.git


RUN cd pg_similarity && make && make install

RUN rm -rf pg_similarity
