from django.shortcuts import render
# from .models import MyModel

def index(request):
    # my_objects = MyModel.objects.all()
    my_objects = [
        {
            'title': '1111',
            'content': 'web'
        },

    ]
    return render(request, 'view/index.html', {'my_objects': my_objects})


def index1(request):
     # 检查计数器是否存在于session中，如果不存在，则初始化为0
    counter = request.session.get('counter', 0)
    
    # 将计数器加一
    counter += 1
    
    # 将新的计数器值存储回session
    request.session['counter'] = counter
    
    # 将计数器值传递给模板
    return render(request, 'view/index1.html', {'counter': counter})