from django.shortcuts import render
from django.http import JsonResponse
import json
import re
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.core.serializers import serialize
import os


@csrf_exempt
def SaveFile(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        jsonData = data['data']
        index = data['index']
        fileName = data['outputFile']
        # python_object = json.loads(data)

        current_path = os.getcwd()
        two_levels_up = os.path.abspath(os.path.join(current_path, '..'))


        file_path = two_levels_up + '/tagging_tool/src/tagData/' +fileName + "_tag.json"

        print(file_path)

        try:
            with open(file_path, 'r',encoding='utf-8') as json_file:
                tempData = json.load(json_file)
        except:
            with open( two_levels_up+'/tagging_tool/src/data/' +fileName+'.json','r',encoding='utf-8') as json_file:
                contentData = json.load(json_file)

            sampleData = [{} for i in range(len(contentData))]

            with open(file_path, 'w', encoding='utf-8') as json_file:
                json.dump(sampleData, json_file, indent=2, ensure_ascii=False)

            with open(file_path, 'r',encoding='utf-8') as json_file:
                tempData = json.load(json_file)

        tempData[index] = jsonData




        with open(file_path, 'w', encoding='utf-8') as json_file:
            json.dump(tempData, json_file, indent=2, ensure_ascii=False)

        return JsonResponse({'statusCode':'success'})

