FROM python:3.11.4-slim-bullseye AS BASE

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app

COPY requirements.txt /app/

RUN apt-get update && \
  apt-get install -y \
  gcc \
  default-libmysqlclient-dev \
  pkg-config \
  curl


RUN mkdir /app/static
RUN mkdir /app/media
RUN mkdir /app/mlrec
RUN mkdir /app/mlrec/models_data

RUN pip install --upgrade pip
RUN pip3 install gunicorn
RUN pip3 install --no-cache-dir -r requirements.txt && \
  apt-get remove -y \
  gcc \
  pkg-config && \
  rm -rf /var/lib/apt/lists/*


COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

COPY . .

ENTRYPOINT ["sh","/app/entrypoint.sh"]