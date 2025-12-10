# POEMON Blog v2.0

一个基于 Vue 3 + Django 的个人博客系统。

在线访问地址：http://www.blog.zjh2002.icu

前情回顾：

- 1.0 版本：http://www.blog.zjh2002.icu/article?id=20
- 1.0 版本开源地址（内含七牛云教程、本地运行方式等）：https://github.com/monkey-papa/POEMON-BLOG

## 项目结构

```
POEMON-BLOG-v2.0/
├── My-Blog-Vue3/     # 前端项目 (Vue 3 + Vite)
├── My-Blog-Serve/    # 后端项目 (Django + DRF)
└── README.md         # 本文件
```

## 技术栈

### 前端

- Vue 3 (Composition API)
- Vite 5
- Pinia
- Vue Router 4
- Element Plus
- ECharts
- APlayer

### 后端

- Python 3.8+
- Django 4.1.5
- Django REST Framework
- MySQL
- 七牛云（图片存储）

---

# 预览

![](https://www.qiniuyun.zjh2002.icu/articlePicture/0a8eb3e6d57811f0a59400163e002b00)
![](https://www.qiniuyun.zjh2002.icu/articlePicture/346e39acd57811f0a59400163e002b00)
![](https://www.qiniuyun.zjh2002.icu/articlePicture/3e230d2ed57811f0824a00163e002b00)
![](https://www.qiniuyun.zjh2002.icu/articlePicture/468c85dad57811f087de00163e002b00)
![](https://www.qiniuyun.zjh2002.icu/articlePicture/4e278862d57811f0a59400163e002b00)
![](https://www.qiniuyun.zjh2002.icu/articlePicture/5d03710cd57811f0b09a00163e002b00)
![](https://www.qiniuyun.zjh2002.icu/articlePicture/6390e50ed57811f0a59400163e002b00)
![](https://www.qiniuyun.zjh2002.icu/articlePicture/937d8462d57711f0824a00163e002b00)
![](https://www.qiniuyun.zjh2002.icu/articlePicture/9d29b2ced57711f0b09e00163e002b00)
![](https://www.qiniuyun.zjh2002.icu/articlePicture/562aa566d57911f087de00163e002b00)
![](https://www.qiniuyun.zjh2002.icu/articlePicture/62620478d57911f0a59400163e002b00)
![](https://www.qiniuyun.zjh2002.icu/articlePicture/6eef7d60d57911f0824a00163e002b00)
![](https://www.qiniuyun.zjh2002.icu/articlePicture/de83c56ed57911f0a59400163e002b00)
![](https://www.qiniuyun.zjh2002.icu/articlePicture/f075bc50d57911f09e5e00163e002b00)
![](https://www.qiniuyun.zjh2002.icu/articlePicture/13ea8350d57a11f0a59400163e002b00)
![](https://www.qiniuyun.zjh2002.icu/articlePicture/1b32da4ad57a11f0824a00163e002b00)

---

# 快速开始

## 一、后端配置 (My-Blog-Serve)

### 1. 创建虚拟环境

```bash
cd My-Blog-Serve
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate  # Windows
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### 3. 配置文件修改

修改 `luntan/settings.py`：

#### 数据库配置

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'your_database_name',      # 数据库名
        'USER': 'your_database_user',      # 数据库用户名
        'PASSWORD': 'your_database_password',  # 数据库密码
        'HOST': '127.0.0.1',               # 数据库地址
        'PORT': '3306',                    # 数据库端口
    }
}
```

#### Django Secret Key

```python
# 生成新密钥命令:
# python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
SECRET_KEY = 'your-generated-secret-key'
```

#### 邮箱服务（用于发送验证码）

```python
from_address = 'your_email@example.com'  # 发件人邮箱地址
wand = "your_email_auth_code"  # 邮箱授权码（非登录密码）
```

> 获取邮箱授权码：
>
> - QQ 邮箱：设置 → 账户 → POP3/SMTP 服务 → 开启 → 获取授权码
> - 163 邮箱：设置 → POP3/SMTP/IMAP → 开启 → 设置授权码

#### AI 摘要服务（可选）

```python
summary_url = "your_ai_summary_api_url"
summary_authorization = "your_ai_summary_auth_token"
```

#### 生产环境域名配置

```python
ALLOWED_HOSTS = ['your-domain.com', 'your-server-ip']
DEBUG = False  # 生产环境请设为 False
```

### 4. 数据库迁移

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. 创建超级管理员

```bash
python manage.py createsuperuser
```

### 6. 运行开发服务器

```bash
python manage.py runserver 0.0.0.0:8000
```

---

## 二、前端配置 (My-Blog-Vue3)

### 1. 安装依赖

```bash
cd My-Blog-Vue3
npm install
```

### 2. 配置文件修改

修改 `src/utils/constant.js`：

#### 后端 API 地址

```javascript
// 开发环境
baseURL: "http://localhost:8000/api",
webURL: "http://localhost:8000",
qiniuUploadImages: "http://localhost:8000/api/resource/updateImage/",

// 生产环境请修改为您的后端域名
// baseURL: "http://your-backend-domain.com/api",
// webURL: "http://your-backend-domain.com",
// qiniuUploadImages: "http://your-backend-domain.com/api/resource/updateImage/",
```

#### 七牛云/图床地址

```javascript
// 用于加载表情和 Markdown 图片
qiniuUploadEntrance: "http://your-qiniu-domain.com/",
```

#### 视频资源

```javascript
// 首页背景视频
favoriteVideo: "https://your-video-url.com/video.mp4",
```

#### 博客主人用户 ID

```javascript
// 博客主人的用户 ID（注册后在数据库中查看）
userId: 9,
```

#### 关于页面内容

```javascript
about: [
  {
    img: "https://your-image-url.com/image1.jpg",
    tit: "标题",
    sub: "描述",
  },
  // 添加更多...
],
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:81

### 4. 构建生产版本

```bash
npm run build
```

构建产物位于 `dist` 目录

---

# 配置清单

> 所有需要修改的配置项汇总，按文件分类

## 后端配置

| 文件路径                           | 配置项                  | 行号 | 说明                 |
| ---------------------------------- | ----------------------- | ---- | -------------------- |
| `My-Blog-Serve/luntan/settings.py` | `DATABASES`             | 149  | MySQL 数据库连接信息 |
| `My-Blog-Serve/luntan/settings.py` | `SECRET_KEY`            | 33   | Django 密钥          |
| `My-Blog-Serve/luntan/settings.py` | `DEBUG`                 | 36   | 生产环境设为 False   |
| `My-Blog-Serve/luntan/settings.py` | `ALLOWED_HOSTS`         | 40   | 允许访问的域名/IP    |
| `My-Blog-Serve/luntan/settings.py` | `from_address`          | 17   | 发件人邮箱地址       |
| `My-Blog-Serve/luntan/settings.py` | `wand`                  | 18   | 邮箱授权码           |
| `My-Blog-Serve/luntan/settings.py` | `summary_url`           | 22   | AI 摘要 API 地址     |
| `My-Blog-Serve/luntan/settings.py` | `summary_authorization` | 23   | AI 摘要授权 Token    |
| `My-Blog-Serve/uwsgi.ini`          | `chdir`                 | 6    | 项目部署路径         |

## 前端配置

| 文件路径                             | 配置项                | 行号 | 说明               |
| ------------------------------------ | --------------------- | ---- | ------------------ |
| `My-Blog-Vue3/src/utils/constant.js` | `baseURL`             | 4    | 后端 API 地址      |
| `My-Blog-Vue3/src/utils/constant.js` | `webURL`              | 5    | 后端地址           |
| `My-Blog-Vue3/src/utils/constant.js` | `qiniuUploadImages`   | 17   | 图片上传接口地址   |
| `My-Blog-Vue3/src/utils/constant.js` | `qiniuUploadEntrance` | 23   | 七牛云/图床域名    |
| `My-Blog-Vue3/src/utils/constant.js` | `favoriteVideo`       | 27   | 首页背景视频地址   |
| `My-Blog-Vue3/src/utils/constant.js` | `userId`              | 33   | 博客主人用户 ID    |
| `My-Blog-Vue3/src/utils/constant.js` | `about`               | 99   | 关于页面图片和内容 |

## 数据库配置（通过后台管理）

| 数据表   | 字段                | 说明             |
| -------- | ------------------- | ---------------- |
| `client` | `qiniu_access_key`  | 七牛云 AccessKey |
| `client` | `qiniu_secret_key`  | 七牛云 SecretKey |
| `client` | `qiniu_bucket_name` | 存储空间名称     |
| `client` | `qiniu_domain`      | 存储空间域名     |

---

# 生产部署

## 后端部署 (uWSGI + Nginx)

### 1. 修改 uwsgi.ini

```ini
chdir=/your/project/path/My-Blog-Serve/
```

### 2. 收集静态文件

```bash
python manage.py collectstatic
```

### 3. 启动 uWSGI

```bash
uwsgi --ini uwsgi.ini
```

### 4. Nginx 配置

```nginx
server {
    listen 80;
    server_name your-backend-domain.com;

    location / {
        include uwsgi_params;
        uwsgi_pass 127.0.0.1:9001;
    }

    location /static {
        alias /your/project/path/My-Blog-Serve/static/;
    }
}
```

## 前端部署

### 1. 构建

```bash
cd My-Blog-Vue3
npm run build
```

### 2. Nginx 配置

```nginx
server {
    listen 80;
    server_name your-frontend-domain.com;

    root /your/path/to/dist;
    index index.html;

    # 处理 Vue Router history 模式
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

---

# 功能特性

- 文章管理（发布、编辑、删除）
- Markdown 编辑器 + 代码高亮
- 文章目录自动生成
- 评论系统
- 微言（说说）
- 树洞
- 友链管理
- 相册
- 音乐播放器
- 访客地图统计
- 后台管理系统

---

# 常见问题

### 1. 跨域问题

后端已配置 `django-cors-headers`，默认允许所有来源。生产环境建议在 `settings.py` 中配置具体域名。

### 2. 图片无法显示

检查 `constant.js` 中的 `qiniuUploadEntrance` 是否配置正确。

### 3. 登录后无法访问后台

检查 `constant.js` 中的 `userId` 是否配置为您的管理员用户 ID。

### 4. 时区问题

默认时区为 `Asia/Shanghai`，如需修改请更改 `settings.py` 中的 `TIME_ZONE`。

---

# License

MIT License
