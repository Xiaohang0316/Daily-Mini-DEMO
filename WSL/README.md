可以开多个虚拟终端，即使你和服务器远程断开了，screen里面的进程仍然在执行

pm2


tmux是一个包

安装 tmux
sudo apt install tmux 

tmux  创建新终端  Ctrl b c
      终端拆分（左右）   Ctrl b %
             （上下）   Ctrl b "
   切换拆分的shell     Ctrl b 上下左右
	关闭          Ctrl d
        上一个窗口     Ctrl b p
        下一个窗口     Ctrl b n
	所有shell     Ctrl b D 
	切换shell     tmux attach -t 5
 创建有意义的shell     tmux new -s database
       重命名shell    tmux rename-session -t 0 database
	放大缩小      Ctrl b z
	调整分屏大小  Ctrl b Ctrl 上下左右
	重命名当前窗口  Ctrl b ，



Ctrl b z 
Crrl b 上下左右
tmux new -s <name>
Ctrl b x
tmux attach -s <name>

