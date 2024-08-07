from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
from django.conf import settings
from django.shortcuts import redirect, render

@csrf_exempt
def get_photos(request):
    if request.method == 'GET':
        uuid = request.GET.get('uuid', None)
        upload_dir = os.path.join('uploads',uuid.split("uploads/")[-1].replace("\\","/"))  # 파일을 저장할 디렉터리 경로 설정
        print("###########")
        print("upload_dir")
        print(upload_dir)
        print("###########")
        # 디렉터리 내의 모든 파일 목록을 가져옴
        try:
            file_list = os.listdir(upload_dir)
            print("###########")
            print("file_list")
            print(file_list)
            print("###########")
            # 이미지 파일만 필터링 (예: JPEG, PNG 파일)
            images = [file for file in file_list if file.lower().endswith(('.png', '.jpg', '.jpeg','.mp4'))]
            image_urls = [{'id': idx, 'url': os.path.join(request.build_absolute_uri().split("?")[0].replace("\\","/"), upload_dir.replace("\\","/"), image.replace("\\","/"))} for idx, image in enumerate(images)]
            print("###########")
            print("image_urls")
            print(image_urls)
            print("###########")
            return JsonResponse({'status': 'success', 'images': image_urls})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)

from django.http import HttpResponse, Http404
from urllib.parse import quote

def download(request):
    image_path = request.GET.get('image_path', '')
    video_path = request.GET.get('video_path', '')
    uuid = request.GET.get('uuid', '')    

    try:
        if uuid == '':
            html_file_path = os.path.join(settings.BASE_DIR, 'get_photo', 'templates', 'download.html')
            with open(html_file_path, 'r', encoding='utf-8') as file:
                html_content = file.read()
                # {{ image_path }}와 {{ video_path }}를 실제 값으로 대체
                html_content = html_content.replace('{{ image_path }}', image_path)
                html_content = html_content.replace('{{ video_path }}', video_path)
            return HttpResponse(html_content)
        else:        
            upload_dir = os.path.join(settings.BASE_DIR, 'uploads', uuid)            
            image_urls = [image_path]
            for filename in os.listdir(upload_dir):
                if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                    image_urls.append(f'/get_photo/uploads/{os.path.join(request.build_absolute_uri().split("?")[0].replace("\\","/"), upload_dir.replace("\\","/"), filename)}')
            
            context = {        
                'image_path': image_path,
                'video_path': video_path,
                'image_urls': image_urls
            }        

            return render(request, 'download2.html', context)        
    except FileNotFoundError:
        return HttpResponse("File not found", status=404)


@csrf_exempt    
def serve_photo(request, file_path):
    file_path = os.path.join('uploads', file_path.replace("\\","/"))
    if os.path.exists(file_path):
        with open(file_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type="image/jpeg")
            response['Content-Disposition'] = f'inline; filename={quote(os.path.basename(file_path))}'
            return response
    else:
        raise Http404("File not found")