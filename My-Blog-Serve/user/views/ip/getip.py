import time
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class GetIpView(APIView):
    """
    获取客户端真实IP地址接口
    支持代理、CDN等场景
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

    def get(self, request):
        try:
            # 获取真实IP地址
            ip = self.get_client_ip(request)
            
            dataall = [{
                'code': 200,
                'message': "null",
                'data': [{
                    'ip': ip,
                }],
                'currentTimeMillis': time.time(),
            }]
            
            return Response({
                'result': dataall
            })
            
        except Exception as error:
            return Response({
                'result': f"failure {error}"
            })
