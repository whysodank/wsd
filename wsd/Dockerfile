FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

RUN apt update
RUN apt install gettext -y
RUN apt install libexpat1 -y
RUN apt install tesseract-ocr libtesseract-dev -y
RUN apt install postgresql-client -y

WORKDIR /wsd

COPY . /wsd/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

RUN chmod +x /wsd/entrypoint.sh

CMD ["/wsd/entrypoint.sh"]
