import pandas as pd
import pickle
import os


data=pd.read_csv(r'F:\Programming\WEB Dev Practice\cardiac-risk-assessment\python\dataset.csv')
X_data=data.drop(['HeartDiseaseorAttack','Income','Education','NoDocbcCost','AnyHealthcare'],axis=1)
y_data=data['HeartDiseaseorAttack']

# scaling   
from sklearn.preprocessing import MinMaxScaler
scaler = MinMaxScaler()
data_scaled = scaler.fit_transform(X_data)

# model
from sklearn.linear_model import LogisticRegression
model = LogisticRegression(max_iter=2000)
model.fit(X_data, y_data)


# Determine the directory of the current script
script_directory = os.path.dirname(os.path.abspath(__file__))
# Define the path for the pickle file within the script's directory
pickle_file_path = os.path.join(script_directory, 'heart_health_model.pkl')
# Save the trained model to a file
with open(pickle_file_path, 'wb') as file:
    pickle.dump(model, file)