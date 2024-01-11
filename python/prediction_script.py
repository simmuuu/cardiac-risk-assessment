import pickle
import numpy as np
import os
import sys
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId
import warnings 
warnings.filterwarnings('ignore') 






#connect to database
load_dotenv()
dbUrl=os.getenv('dbUrl')
cluster=MongoClient(dbUrl[:-22]) # the env file has even the data base name , so we are removing that
db=cluster['heart-health-database']
collection=db['predicts']





# Determine the directory of the current script
script_directory = os.path.dirname(os.path.abspath(__file__))
# Define the path for the pickle file within the script's directory
pickle_file_path = os.path.join(script_directory, 'heart_health_model.pkl')
# Load the saved model from the file
with open(pickle_file_path, 'rb') as file:
    loaded_model = pickle.load(file)




def age_converter(age):
    if 18 <= age <= 24:
        return 1
    elif 25 <= age <= 29:
        return 2
    elif 30 <= age <= 34:
        return 3
    elif 35 <= age <= 39:
        return 4
    elif 40 <= age <= 44:
        return 5
    elif 45 <= age <= 49:
        return 6
    elif 50 <= age <= 54:
        return 7
    elif 55 <= age <= 59:
        return 8
    elif 60 <= age <= 64:
        return 9
    elif 65 <= age <= 69:
        return 10
    elif 70 <= age <= 74:
        return 11
    elif 75 <= age <= 79:
        return 12
    elif age >= 80:
        return 13






def main():
    # Check if the required data is passed as an argument
    if len(sys.argv) < 2:
        print("Usage: python prediction_script.py <data>")
        return

    # Get the data passed from the Node.js application
    input_id_from_node = sys.argv[1]
    # print(input_id_from_node)
    data = collection.find_one({"_id": ObjectId(input_id_from_node)})
    # print(data)

    #bmi calculation
    height=(int(data.get('height')))/100
    weight=int(data.get('weight'))
    bmi=int(weight/(height*height))
    data['BMI']=bmi

    data['Age']=age_converter(data['Age'])

    order=['HighBP', 'HighChol', 'CholCheck', 'BMI', 'Smoker', 'Stroke', 'Diabetes', 'PhysActivity', 'Fruits', 'Veggies', 'HvyAlcoholConsump', 'GenHlth', 'MentHlth', 'PhysHlth', 'DiffWalk', 'Sex', 'Age']


    sorted_data = {k: data[k] for k in order}
    sorted_data = {key: int(value) for key, value in sorted_data.items()}
    # print("printing sorted_data variable------>",sorted_data)
    data_array = np.array(list(sorted_data.values())).reshape(1,-1)
    predict_probability = str(loaded_model.predict_proba(data_array)[:, 1]).replace('[', '').replace(']', '')
    collection.update_one({"_id": ObjectId(input_id_from_node)}, {"$set":{"predict_probability":predict_probability}})


#         data = {key: int(value) for key, value in data.items()}

#         #converting age to the label
#         data['Age']=age_converter(data['Age'])

#         
#         

#         data_array = np.array(list(sorted_data.values())).reshape(1,-1)



#         prediction=loaded_model.predict(data_array)
#         probabilities_test = loaded_model.predict_proba(data_array)[:, 1]
#         print(str(probabilities_test))

        

if __name__ == "__main__":
    main()
