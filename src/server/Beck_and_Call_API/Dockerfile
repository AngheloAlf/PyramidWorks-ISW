FROM python:3.6-stretch

ENV PYTHONUNBUFFERED 1
WORKDIR /usr/src/app
#Copy API into WORKDIR
COPY . .
#Install R
RUN apt install dirmngr
RUN apt update
RUN echo "deb http://cloud.r-project.org/bin/linux/debian stretch-cran35/" >> /etc/apt/sources.list
RUN apt-key add jranke.asc
RUN apt update && apt install -y r-base

#Install Python dependencies
#COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

#Do Migrations
RUN python manage.py migrate
