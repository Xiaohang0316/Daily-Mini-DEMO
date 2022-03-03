##### 1.查看Docker已有镜像

```sh
docker images
# REPOSITORY   TAG        IMAGE ID       CREATED        SIZE
# Spegling1   20210806   65dc05e7180c   2 months ago   334MB
# Spegling2   20210705   1a9f53a0b726   4 months ago   384MB
# Spegling3   5.0.4      3bb4a303e17c   2 years ago    95MB
```

##### 2.启动docker

```sh
# 找到 REPOSITORY 对应的  IMAGE ID
# 举个例子 启动 Spegling1
docker run 65dc05e7180c
```

##### 3. 查看Docker正在运行的镜像

```sh
docker ps
# CONTAINER ID   IMAGE         COMMAND                  CREATED        STATUS       PORTS                    NAMES
# 3414e8105931   Spegling1   "docker-entrypoint.s…"   8 days ago     Up 3 hours   0.0.0.0:5432->5432/tcp   Spegling11
# 96213f086e59   Spegling2   "docker-entrypoint.s…"   4 months ago   Up 3 hours   0.0.0.0:6379->6379/tcp   Spegling22
```

##### 4.停止Docker镜像

```sh
# 找到 IMAGE 对应的  CONTAINER ID 
# 举个例子 停止 Spegling1
docker stop 3414e8105931
# 停止所有的Docker镜像
docker stop $(docker ps -aq)
```

##### 5.删除已有的Docker镜像

```sh
# 找到 REPOSITORY 对应的  IMAGE ID
# 举个例子 删除 Spegling1
docker rmi 65dc05e7180c
# 强制删除 Docker 镜像
docker rmi -f 65dc05e7180c
```