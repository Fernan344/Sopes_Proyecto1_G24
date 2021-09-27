FROM python:3

WORKDIR /app

COPY . ./

RUN pip install Flask
RUN pip install MySQL
RUN pip install datetime
RUN pip install requests
RUN pip install flask-mysqldb



EXPOSE 4500
CMD ["python", "app.py"]