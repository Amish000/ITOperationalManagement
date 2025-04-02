using Microsoft.ML;
using Microsoft.ML.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using static ITAdministrationApp.Models.TicketAnomaly;
namespace ITAdministrationApp.Services
{
    public class TicketClusterService
    {
        private readonly MLContext _mlContext;
        private ITransformer _model;

        public TicketClusterService()
        {
            _mlContext = new MLContext();
        }

        public void TrainModel(List<TicketDescription> descriptions, int numberOfClusters = 3)
        {
            if (descriptions == null || !descriptions.Any())
            {
                throw new InvalidOperationException("No data available for training.");
            }

            var dataView = _mlContext.Data.LoadFromEnumerable(descriptions);

            var pipeline = _mlContext.Transforms.Text.FeaturizeText("Features", nameof(TicketDescription.Description))
                .Append(_mlContext.Clustering.Trainers.KMeans("Features", numberOfClusters: numberOfClusters));

            _model = pipeline.Fit(dataView);
        }

        public TicketCluster PredictCluster(string description)
        {
            var predictor = _mlContext.Model.CreatePredictionEngine<TicketDescription, TicketCluster>(_model);
            return predictor.Predict(new TicketDescription { Description = description });
        }
    }
}