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
    print (request.method)
    if request.method == 'POST':
        data = json.loads(request.body)
        jsonData = data['data']
        index = data['index']
        # python_object = json.loads(data)
        # script_directory = os.path.dirname(os.path.abspath(__file__))
        # relative_path = "data"
        # file_name = "TrainData.json"
        file_path = "../data/TrainData.json"

        with open(file_path, 'r',encoding='utf-8') as json_file:
            tempData = json.load(json_file)

        tempData[index] = jsonData  
        with open(file_path, 'w', encoding='utf-8') as json_file:
            json.dump(tempData, json_file, indent=2, ensure_ascii=False)
        
        return JsonResponse({'statusCode':'success'})