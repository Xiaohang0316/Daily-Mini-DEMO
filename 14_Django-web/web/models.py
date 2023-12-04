# from django.db import models

class MyModel():
    # title = models.CharField(max_length=100)
    # content = models.TextField()
    title = '111'
    content = '222'

    def __str__(self):
        return self.title