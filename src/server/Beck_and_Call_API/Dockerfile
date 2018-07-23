FROM python:3.6-stretch

ENV PYTHONUNBUFFERED 1
WORKDIR /usr/src/app
#Install R
RUN apt update && apt install dirmngr
RUN echo "deb http://cloud.r-project.org/bin/linux/debian stretch-cran35/" >> /etc/apt/sources.list
RUN apt-key adv --keyserver keys.gnupg.net --recv-key 'E19F5F87128899B192B1A2C2AD5F960A256A04AF'
RUN apt update && apt install -y r-base

#Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

#Copy API into WORKDIR
COPY . .
#Do Migrations
RUN python manage.py migrate