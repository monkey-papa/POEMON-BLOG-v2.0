# Create your views here.
import time
from datetime import datetime

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from appone.models.client import Client
from appone.models.ip import Ip


class RcView(APIView):
    """
    访问记录接口
    规则：
    1. 每条记录代表一次访问：(ip + user_id + date) 的唯一组合
    2. 同一IP同一天只算一次访问（除非有不同的user_id）
    3. 如果IP先访问时没有user_id，后来有了，更新该记录
    4. 同一用户同一天用不同IP访问，每个IP算一次
    5. 不同用户使用同一IP，分别记录
    """
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]

    def get_client_ip(self, request):
        """
        获取客户端真实IP地址
        优先级：
        1. HTTP_X_FORWARDED_FOR (代理传递的真实IP)
        2. HTTP_X_REAL_IP (Nginx常用)
        3. HTTP_CF_CONNECTING_IP (Cloudflare)
        4. REMOTE_ADDR (直连IP)
        """
        # 1. 尝试从 X-Forwarded-For 获取（最常用）
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            # X-Forwarded-For 可能包含多个IP，取第一个（真实客户端IP）
            ip = x_forwarded_for.split(',')[0].strip()
            return ip
        
        # 2. 尝试从 X-Real-IP 获取（Nginx常用）
        x_real_ip = request.META.get('HTTP_X_REAL_IP')
        if x_real_ip:
            return x_real_ip.strip()
        
        # 3. 尝试从 CF-Connecting-IP 获取（Cloudflare）
        cf_connecting_ip = request.META.get('HTTP_CF_CONNECTING_IP')
        if cf_connecting_ip:
            return cf_connecting_ip.strip()
        
        # 4. 最后使用 REMOTE_ADDR（直连或无代理情况）
        remote_addr = request.META.get('REMOTE_ADDR', '')
        return remote_addr

    def post(self, request):
        try:
            # 获取真实IP地址
            ip = self.get_client_ip(request)
            region = request.data.get('province', '')
            city = request.data.get('city', '')
            user_id = request.data.get('userId', 0) or 0  # 确保空值转为0
            
            # 获取今天的开始和结束时间（0点到24点）
            current_time = datetime.now()
            today_start = datetime(current_time.year, current_time.month, current_time.day, 0, 0, 0)
            today_end = datetime(current_time.year, current_time.month, current_time.day, 23, 59, 59)
            
            # 查找今天这个IP的所有访问记录
            today_ip_records = Ip.objects.filter(
                ip=ip,
                create_time__range=(today_start, today_end)
            )
            
            if user_id:
                # ========== 有用户ID的情况 ==========
                # 1. 先检查今天这个用户用这个IP是否已经访问过
                user_ip_record = today_ip_records.filter(user_id=user_id).first()
                
                if user_ip_record:
                    # 今天这个用户已经用这个IP访问过，只更新信息
                    user_ip_record.province = region
                    user_ip_record.city = city
                    user_ip_record.create_time = current_time
                    user_ip_record.save()
                else:
                    # 2. 检查是否有今天这个IP的匿名记录（user_id=0）
                    anonymous_record = today_ip_records.filter(user_id=0).first()
                    
                    if anonymous_record:
                        # 有匿名记录，更新为该用户的记录（匿名转登录，只算1次）
                        anonymous_record.user_id = user_id
                        anonymous_record.province = region
                        anonymous_record.city = city
                        anonymous_record.create_time = current_time
                        anonymous_record.save()
                    else:
                        # 3. 没有该用户的记录，也没有匿名记录
                        # 检查今天这个IP是否有任何记录（可能是其他用户的）
                        any_record = today_ip_records.first()
                        
                        if any_record and any_record.user_id == 0:
                            # 再次检查是否有匿名记录（防并发）
                            any_record.user_id = user_id
                            any_record.province = region
                            any_record.city = city
                            any_record.create_time = current_time
                            any_record.save()
                        elif not any_record:
                            # 今天这个IP完全没有记录，创建新记录
                            Ip.objects.create(
                                user_id=user_id,
                                ip=ip,
                                province=region,
                                city=city,
                                create_time=current_time,
                                dcount=1,
                                mcount=1
                            )
                        else:
                            # 今天这个IP已有其他用户的记录，为当前用户创建新记录
                            Ip.objects.create(
                                user_id=user_id,
                                ip=ip,
                                province=region,
                                city=city,
                                create_time=current_time,
                                dcount=1,
                                mcount=1
                            )
            else:
                # ========== 匿名访问的情况 ==========
                # 检查今天这个IP是否已有匿名记录
                anonymous_record = today_ip_records.filter(user_id=0).first()
                
                if anonymous_record:
                    # 已有匿名记录，只更新时间和信息
                    anonymous_record.province = region
                    anonymous_record.city = city
                    anonymous_record.create_time = current_time
                    anonymous_record.save()
                else:
                    # 没有匿名记录
                    # 检查是否有该IP的其他用户记录
                    any_user_record = today_ip_records.filter(user_id__gt=0).first()
                    
                    if any_user_record:
                        # 已有登录用户用这个IP访问过，不再创建匿名记录
                        # 因为这个IP今天已经被使用过了
                        pass
                    else:
                        # 今天这个IP完全没有记录，创建匿名记录
                        Ip.objects.create(
                            user_id=0,
                            ip=ip,
                            province=region,
                            city=city,
                            create_time=current_time,
                            dcount=1,
                            mcount=1
                        )
            
            return Response({
                'result': 'success'
            })
            
        except Exception as error:
            return Response({
                'result': f"failure {error}"
            })
