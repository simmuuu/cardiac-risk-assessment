const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PredictSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    Sex:{
        type:Number,
        required:true
    },
    height:{
        type:Number,
        required:true
    },
    weight:{
        type:Number,
        required:true
    },
    Age:{
        type:Number,
        required:true,
        min:[18, 'Min Age is 18']
    },
    HighBP:{
        type:Number,
        default: 0
    },
    HighChol:{
        type:Number,
        default: 0
    },
    Stroke:{
        type:Number,
        default: 0
    },
    Diabetes:{
        type:Number,
        default: 0
    },
    Smoker:{
        type:Number,
        default: 0
    },
    HvyAlcoholConsump:{
        type:Number,
        default: 0
    },
    PhysActivity:{
        type:Number,
        default: 0
    },
    Fruits:{
        type:Number,
        default: 0
    },
    Veggies:{
        type:Number,
        default: 0
    },
    GenHlth:{
        type:Number,
        default: 0
    },
    PhysHlth:{
        type:Number,
        default: 0
    },
    MentHlth:{
        type:Number,
        default: 0
    },
    CholCheck:{
        type:Number,
        default: 0
    },
    DiffWalk:{
        type:Number,
        default: 0
    },
    time:{
        type:String
    },
    predict_probability:{
        type:String
    }
})

module.exports = mongoose.model('Predict',PredictSchema);