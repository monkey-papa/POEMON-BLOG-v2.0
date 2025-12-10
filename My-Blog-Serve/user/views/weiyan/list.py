import time

from django.db.models import Q
from django.contrib.auth.models import User
# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny

from appone.models.wei_yan import WeiYan
from appone.models.client import Client


class WeiYanView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        # current 当前页码
        # size    一页显示多少内容
        # 三个搜索条件
        data = request.data
        # print(data)
        current = int(data.get('current', 0))
        size = int(data.get('size', 0))
        userId = data.get('userId', 0)
        show_all = data.get('all', False)  # 是否显示所有数据（包括不可见的）
        
        # 如果 userId 为空，从数据库中获取 is_staff=1 的用户ID作为默认值
        if not userId:
            admin_user = User.objects.filter(is_staff=True).first()
            if admin_user:
                userId = admin_user.id
            else:
                return Response({
                    'result': [{
                        'code': 404,
                        'message': "未找到管理员用户",
                        'data': [],
                        'currentTimeMillis': time.time(),
                    }]
                })
        
        dataall = []
        data = []
        # 通过Q来实现不同的搜索操作
        query = Q()
        try:
            # 如果传了 all=True，查询所有用户的数据
            # 否则只查询指定用户的数据（userId为空时默认为9）
            if not show_all:
                query &= Q(user_id=userId)
            
            # 过滤 source 为空的数据
            query &= Q(source__isnull=True)
            
            # 如果不是 all 模式，只显示可见的数据
            if not show_all:
                query &= Q(is_public=True)
            
            # 先过滤再分页
            wei = WeiYan.objects.filter(query).order_by('-id')
            total = wei.count()  # 过滤后的总数
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
