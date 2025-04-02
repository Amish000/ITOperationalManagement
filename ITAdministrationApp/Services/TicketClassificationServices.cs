using Microsoft.ML;
using static ITAdministrationApp.Models.TicketClassification;
using System;
using System.Collections.Generic;
using System.IO;

namespace ITAdministrationApp.Services
{
    public class TicketClassificationService
    {
        private readonly MLContext _mlContext;
        private ITransformer _model;

        public TicketClassificationService()
        {
            _mlContext = new MLContext();
        }

        public void TrainModel()
        {
            // Create a static dataset for training
            var descriptions = new List<TicketDescription>
            {
                new TicketDescription { Description = "System crash when opening software", Label = "Critical" },
                new TicketDescription { Description = "Unable to connect to VPN", Label = "Network Issue" },
                new TicketDescription { Description = "Printer not working", Label = "Hardware Issue" },
                new TicketDescription { Description = "Forgot password", Label = "Authentication Issue" },
                new TicketDescription { Description = "Software update required", Label = "Software Issue" }
            };

            // Convert dataset to IDataView
            var dataView = _mlContext.Data.LoadFromEnumerable(descriptions);

            // Define the ML pipeline
            var pipeline = _mlContext.Transforms.Text.FeaturizeText("Features", nameof(TicketDescription.Description))
                .Append(_mlContext.Transforms.Conversion.MapValueToKey(inputColumnName: "Label", outputColumnName: "LabelKey"))
                .Append(_mlContext.MulticlassClassification.Trainers.SdcaMaximumEntropy(labelColumnName: "LabelKey", featureColumnName: "Features"))
                .Append(_mlContext.Transforms.Conversion.MapKeyToValue(inputColumnName: "PredictedLabel", outputColumnName: "PredictedCategory"));

            // Train the model
            _model = pipeline.Fit(dataView);

            // Save the model for future use
            _mlContext.Model.Save(_model, dataView.Schema, "ticketClassificationModel.zip");
        }

        private void LoadModelIfExists()
        {
            if (File.Exists("ticketClassificationModel.zip"))
            {
                DataViewSchema modelSchema;
                _model = _mlContext.Model.Load("ticketClassificationModel.zip", out modelSchema);
                Console.WriteLine("Model loaded successfully.");
            }
            else
            {
                Console.WriteLine("Model file does not exist.");
            }
        }

        public string PredictTicketCategory(string ticketDescription)
        {
            // Load model if not already loaded
            if (_model == null)
            {
                LoadModelIfExists();
            }

            // If the model is still null, train the model
            if (_model == null)
            {
                TrainModel();
            }

            // Perform the prediction
            var predictionEngine = _mlContext.Model.CreatePredictionEngine<TicketDescription, TicketPrediction>(_model);
            var prediction = predictionEngine.Predict(new TicketDescription { Description = ticketDescription });

            // Debug log to check prediction result
            Console.WriteLine($"Predicted Category: {prediction.PredictedCategory}");
            return prediction.PredictedCategory;
        }
    }
}