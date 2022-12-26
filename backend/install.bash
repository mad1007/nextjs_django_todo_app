#!/bin/bash
echo 'Installing python virtualenv'
echo '============================='
apt install virtualenv
echo 'Creating a virtual environement'
echo '============================='
virtualenv env
echo 'Activating the env'
echo '============================='
source ./env/bin/activate
echo 'Downloading packages'
pip install -r requirements.txt
echo 'Creating database'

python ./manage.py migrate

echo 'Load Data'

python ./manage.py createsuperuser

echo 'Downloading the supervisor'

apt-get install supervisor

echo 'Starting the supervisor'
service supervisor restart
service supervisor status

cwd=$(pwd)

external_port=8000

internal_port=8001

echo 'Create a supervisor configuration file'

cat > foo.conf << EOF

[program:rest_todo_app]

directory=$cwd

command=$cwd/env/bin/gunicorn mybackend.wsgi -w 3  -b 0.0.0.0:$internal_port

user=mad

autostart=true

autorestart=true

stopasgroup=true

killasgroup=true

stderr_logfile=/var/log/todo_app/todo_app.err.log

stdout_logfile=/var/log/todo_app/todo_app.out.log



EOF

mkdir -p /var/log/todo_app/

touch /var/log/todo_app/todo_app.err.log

touch /var/log/todo_app/todo_app.out.log

echo 'Restarting the supervisor'

mv foo.conf /etc/supervisor/conf.d/todo_app.conf
supervisorctl reread
supervisorctl reload
echo 'Your app should be hosted on http://localhost:$internal_port'

chown mad:mad --recursive .


echo 'Create nginx configuration file'
apt-get install nginx 

cat > foot << EOF
server {

    listen $external_port;
    location / {

        autoindex on;

        alias ${cwd}/frontend/out;

        try_files \$uri \$uri/ =404

        

    }



    location /api {

        include proxy_params;

        proxy_pass http://localhost:$internal_port;

    }

}



EOF



mv foot /etc/nginx/sites-available/todo_app.conf

rm /etc/nginx/sites-enabled/default

(cd /etc/nginx/sites-enabled && ln -s ../sites-available/todo_app.conf)

service nginx restart



echo 'SETUP COMPLETE'

echo 'Please change nginx user to "mad" and restart nginx service'

echo 'Configuration file location: /etc/nginx/nginx.conf'