import json

# Path to the input JSON file
input_file_path = r"C:\\Users\\Quoc Dat\\Desktop\\NER_be\\data\\DanangHoian_490222071180065.json"

# Path to the output JSON file
output_file_path = r'C:\\Users\\Quoc Dat\\Desktop\\NER_be\\data\\TrainData.json'

# Read the JSON file
with open(input_file_path, 'r', encoding="utf-8") as json_file:
    data = json.load(json_file)

# Get the length of the list or number of objects
data_length = len(data)

# Create a new list with the same number of objects (just an example)
new_data = [{} for i in range(data_length)]

# Write the new list to a new JSON file
with open(output_file_path, 'w', encoding="utf-8") as json_file:
    json.dump(new_data, json_file, indent=2)