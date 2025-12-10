# Create your views here.
import time
from datetime import timedelta, datetime

from django.db.models import Count, Q
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from appone.models.client import Client
from appone.models.ip import Ip


class ListIpView(APIView):
    """
    访问统计接口
    返回：
    - 总访问量
    - 省份访问TOP10
    - IP访问TOP10  
    - 今日访问量、今日访问省份、今日访问用户、今日访问IP
    - 昨日访问量、昨日访问省份、昨日访问用户、昨日访问IP
    """
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        try:
            current_time = datetime.now()
            
            # 今天的时间范围（0点到当前时间）
            today_start = datetime(current_time.year, current_time.month, current_time.day, 0, 0, 0)
            today_end = current_time
            
            # 昨天的时间范围（昨天0点到昨天24点）
            yesterday = current_time.date() - timedelta(days=1)
            yesterday_start = datetime(yesterday.year, yesterday.month, yesterday.day, 0, 0, 0)
            yesterday_end = datetime(yesterday.year, yesterday.month, yesterday.day, 23, 59, 59)
            
            # ============ 总访问量 ============
            total_sum = Ip.objects.count()
            
            # ============ 省份访问TOP10（所有时间） ============
            province_all_top = Ip.objects.exclude(
                Q(province__isnull=True) | Q(province='')
            ).values('province').annotate(
                count=Count('id')
            ).order_by('-count')[:10]
            
            provinceall = [
                {'province': item['province'], 'count': item['count']}
                for item in province_all_top
            ]
            
            # ============ IP访问TOP10（所有时间） ============
            ip_all_top = Ip.objects.exclude(
                Q(ip__isnull=True) | Q(ip='')
            ).values('ip').annotate(
                count=Count('id')
            ).order_by('-count')[:10]
            
            ipall = [
                {'ip': item['ip'], 'count': item['count']}
                for item in ip_all_top
            ]
            
            # ============ 今日数据 ============
            today_records = Ip.objects.filter(create_time__range=(today_start, today_end))
            
            # 今日访问量
            today_sum = today_records.count()
            
            # 今日访问省份统计
            province_today = today_records.exclude(
                Q(province__isnull=True) | Q(province='')
            ).values('province').annotate(
                count=Count('id')
            ).order_by('-count')
            
            provincetoday = [
                {'province': item['province'], 'count': item['count']}
                for item in province_today
            ]
            
            # 今日访问IP统计
            ip_today = today_records.exclude(
                Q(ip__isnull=True) | Q(ip='')
            ).values('ip').annotate(
                count=Count('id')
            ).order_by('-count')
            
            iptoday = [
                {'ip': item['ip'], 'count': item['count']}
                for item in ip_today
            ]
            
            # 今日访问用户（去重，只返回有user_id的）
            user_today_records = today_records.filter(user_id__gt=0).values('user_id').distinct()
            usertoday = []
            for record in user_today_records:
                try:
                    user = Client.objects.get(user_id=record['user_id'])
                    usertoday.append({
                        'userId': user.user_id,
                        'avatar': user.avatar,
                        'userName': user.username,
                    })
                except Client.DoesNotExist:
                    pass
            
            # ============ 昨日数据 ============
            yesterday_records = Ip.objects.filter(create_time__range=(yesterday_start, yesterday_end))
            
            # 昨日访问量
            yesterday_sum = yesterday_records.count()
            
            # 昨日访问省份统计
            province_yesterday = yesterday_records.exclude(
                Q(province__isnull=True) | Q(province='')
            ).values('province').annotate(
                count=Count('id')
            ).order_by('-count')
            
            provinceyesterday = [
                {'province': item['province'], 'count': item['count']}
                for item in province_yesterday
            ]
            
            # 昨日访问IP统计
            ip_yesterday = yesterday_records.exclude(
                Q(ip__isnull=True) | Q(ip='')
            ).values('ip').annotate(
                count=Count('id')
            ).order_by('-count')
            
            ipyesterday = [
                {'ip': item['ip'], 'count': item['count']}
                for item in ip_yesterday
            ]
            
            # 昨日访问用户（去重，只返回有user_id的）
            user_yesterday_records = yesterday_records.filter(user_id__gt=0).values('user_id').distinct()
            useryesterday = []
            for record in user_yesterday_records:
                try:
                    user = Client.objects.get(user_id=record['user_id'])
                    useryesterday.append({
                        'userId': user.user_id,
                        'avatar': user.avatar,
                        'userName': user.username,
                    })
                except Client.DoesNotExist:
                    pass
            
            # ============ 返回结果 ============
            dataall = [{
                'code': 200,
                'message': "null",
                'total_sum': total_sum,
                'today_sum': today_sum,
                'yesterday_sum': yesterday_sum,
                'data': {
                    # 总体统计
                    'province_all_top': provinceall,
                    'ip_all_top': ipall,
                    
                    # 今日统计
                    'today': {
                        'province': provincetoday,
                        'ip': iptoday,
                        'users': usertoday,
                    },
                    
                    # 昨日统计
                    'yesterday': {
                        'province': provinceyesterday,
                        'ip': ipyesterday,
                        'users': useryesterday,
                    }
                },
                'currentTimeMillis': time.time(),
            }]
            
            return Response({
                'result': dataall
            })
            
        except Exception as error:
            return Response({
                'result': f"failure {error}"
            })
