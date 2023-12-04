### Django
使用 django-admin 创建

```bash 

django-admin startproject <projectName>
cd <projectName>
python3 manage.py startapp <appName>

# 数据迁移
python3 manage.py makemigrations
python3 manage.py migrate
# table 查看
python3 manage.py showmigrations


python3 manage.py runserver // 启动服务

```

项目启动后浏览器输入 http://127.0.0.1:8000/web/ 运行 web




