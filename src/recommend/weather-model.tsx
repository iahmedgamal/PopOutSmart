import React, { useState, useEffect } from "react";
import * as tf from '@tensorflow/tfjs';
import trainingData from './data';
import { WeatherInfo } from "../query/api";

// Enhanced data preparation
const prepareData = (data) => {
  const temps = data.map(d => d.temp);
  const winds = data.map(d => d.wind);
  
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const minWind = Math.min(...winds);
  const maxWind = Math.max(...winds);

  const normalizedInputs = data.map(d => [
    (d.temp - minTemp) / (maxTemp - minTemp),
    (d.wind - minWind) / (maxWind - minWind)
  ]);

  const normalizedLabels = data.map(d => {
    const label = new Array(6).fill(0);
    label[d.top] = 1;
    return label;
  });

  return {
    inputs: normalizedInputs,
    labels: normalizedLabels,
    minTemp,
    maxTemp,
    minWind,
    maxWind
  };
};

const { 
  inputs, 
  labels, 
  minTemp, 
  maxTemp, 
  minWind, 
  maxWind 
} = prepareData(trainingData);

const inputTensor = tf.tensor2d(inputs);
const labelTensor = tf.tensor2d(labels);

interface ModelProps {
  data: WeatherInfo;
}

const Model = ({ data }: ModelProps) => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [status, setStatus] = useState<string>("Not Trained");
  const [prediction, setPrediction] = useState<string>("");
  const [predictionProbability, setPredictionProbability] = useState<number>(0);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);

  const topLabels = [
    "T-shirt", 
    "Sweater", 
    "Warm jacket", 
    "T-shirt with light jacket", 
    "Sweater with light jacket", 
    "Sweater with warm jacket"
  ];

  const createModel = () => {
    const newModel = tf.sequential();
    
    newModel.add(tf.layers.dense({
      units: 16,
      activation: 'relu',
      inputShape: [2]
    }));
    
    newModel.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));
    newModel.add(tf.layers.dropout({ rate: 0.2 }));
    
    newModel.add(tf.layers.dense({
      units: 16,
      activation: 'relu'
    }));
    
    newModel.add(tf.layers.dense({
      units: 6,
      activation: 'softmax'
    }));

    newModel.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return newModel;
  };

  const saveModelToLocalStorage = async (model: tf.Sequential) => {
    try {
      await model.save('localstorage://weather-recommendation-model');
      setStatus("Model Saved to Local Storage");
    } catch (error) {
      console.error("Error saving model:", error);
      setStatus("Failed to Save Model");
    }
  };

  const loadModelFromLocalStorage = async () => {
    try {
      const loadedModel = await tf.loadLayersModel('localstorage://weather-recommendation-model');
      setModel(loadedModel);
      setStatus("Model Loaded from Local Storage");
      return loadedModel;
    } catch (error) {
      console.error("Error loading model:", error);
      setStatus("No Saved Model Found");
      return null;
    }
  };

  const trainModel = async () => {
    try {
      setStatus("Training Model...");
      const newModel = createModel();
      
      const history = await newModel.fit(inputTensor, labelTensor, {
        epochs: 300,
        batchSize: 4,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            const progress = ((epoch + 1) / 300) * 100;
            setTrainingProgress(progress);
            console.log(`Epoch ${epoch}: loss = ${logs.loss}, accuracy = ${logs.acc}`);
          }
        }
      });

      setModel(newModel);
      await saveModelToLocalStorage(newModel);
      setStatus(`Training Completed. Accuracy: ${((history.history.acc as number[])[history.history.acc.length - 1] * 100).toFixed(2)}%`);
    } catch (error) {
      setStatus(`Training Failed: ${error.message}`);
      console.error(error);
    }
  };

  const predictWeather = async () => {
    if (!model || !data) return;

    try {
      const { temp } = data.main;
      const wind = data.wind.speed;

      const normalizedTemp = (temp - minTemp) / (maxTemp - minTemp);
      const normalizedWind = (wind - minWind) / (maxWind - minWind);

      const input = tf.tensor2d([[normalizedTemp, normalizedWind]]);
      const output = model.predict(input) as tf.Tensor;
      
      const predictionArray = (output.arraySync() as number[][])[0];
      const predictedIndex = predictionArray.indexOf(Math.max(...predictionArray));
      const probability = predictionArray[predictedIndex] * 100;
      
      setPrediction(topLabels[predictedIndex]);
      setPredictionProbability(probability);
      
      input.dispose();
      output.dispose();
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  useEffect(() => {
    const initializeModel = async () => {
      const savedModel = await loadModelFromLocalStorage();
      if (!savedModel) {
        await trainModel();
      }
    };

    initializeModel();
  }, []);

  useEffect(() => {
    if (data && model) {
      predictWeather();
    }
  }, [data, model]);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-500">Weather Clothing Predictor</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Model Status</label>
        <div className="bg-blue-100 p-3 rounded-md">
          <p className="text-blue-800">{status}</p>
          {trainingProgress > 0 && trainingProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${trainingProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>

      {prediction && (
        <div className="bg-green-50 p-4 rounded-md mb-4">
          <h3 className="text-lg font-semibold mb-2 text-blue-600">Recommendation</h3>
          <p className="text-green-800">
            <strong>Top:</strong> {prediction}
          </p>
          <p className="text-green-600">
            <strong>Confidence:</strong> {predictionProbability.toFixed(2)}%
          </p>
        </div>
      )}

      <div className="flex space-x-4">
        <button 
          onClick={trainModel} 
          className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Retrain Model
        </button>
        <button 
          onClick={loadModelFromLocalStorage} 
          className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          Load Saved Model
        </button>
      </div>
    </div>
  );
};

export default Model;