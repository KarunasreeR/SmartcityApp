# Use official Python base image
FROM python:3.8-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install  -r requirements.txt

COPY . .


CMD ["python", "main-mqtt-call-api-loop-poc.py"]

