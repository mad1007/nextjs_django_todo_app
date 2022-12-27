rm -rf /var/log/todo_app/
rm -rf ./frontend/out/
rm ./backend/db.sqlite3
rm /etc/supervisor/conf.d/todo_app.conf
rm /etc/nginx/sites-available/todo_app.conf
rm /etc/nginx/sites-enabled/todo_app.conf
sudo apt purge nginx
sudo apt purge nodejs
sudo apt purge supervisor