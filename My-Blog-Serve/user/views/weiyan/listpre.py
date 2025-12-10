import time

from django.db.models import Q
# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny

from appone.models.article import Article
from appone.models.wei_yan import WeiYan
from appone.models.client import Client


class WeiYanPreView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        # current 当前页码
        # size    一页显示多少内容
        # 三个搜索条件
        data = request.data
        current = data['current']
        size = data['size']
        source = data.get('source')
        show_all = data.get('all', False)  # 是否显示所有 source 不为空的数据
        dataall = []
        data = []
        # 通过Q来实现不同的搜索操作
        query = Q()
        try:
            if show_all:
                # 如果传了 all=True，返回所有 source 不为 null 的数据（包括私有的）
                query &= Q(source__isnull=False)
            else:
                # 只返回公开的数据
                query &= Q(is_public=True)
                # 返回指定 source 的数据
                if source and Article.objects.filter(id=source).exists():
                    query &= Q(source=source)
            
            wei = WeiYan.objects.filter(query).order_by('-id')
            total = wei.count()
            weis = wei[(current - 1) * size:current * size]

            for w in weis:
                # 获取用户名和头像
                try:
                    client = Client.objects.get(user_id=w.user_id)
                    username = client.username
                    avatar = client.avatar
                except Client.DoesNotExist:
                    username = '未知用户'
                    avatar = None
                
                data.append({
                    'id': w.id,
                    'userId': w.user_id,
                    'username': username,
                    'avatar': avatar,
                    'likeCount': w.like_count,
                    'content': w.content,
                    'type': w.type,
                    'source': w.source,
                    'isPublic': w.is_public,
                    'createTime': w.create_time,
                })

            dataall.append({
                'code': 200,
                'message': "null",
                'total': total,
                'records': data,
                'currentTimeMillis': time.time(),
            })
            return Response({
                'result': dataall
            })

        except Exception as error:
            return Response({
                'result': "failure {0}".format(error)
            })
