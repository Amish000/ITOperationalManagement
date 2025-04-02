using Microsoft.ML.Data;

namespace ITAdministrationApp.Models
{
    public class TicketClassification
    {
        public class TicketDescription
        {
            [LoadColumn(0)]
            public string Description { get; set; }

            [LoadColumn(1)]
            public string Label { get; set; }
        }

        public class TicketPrediction
        {
            [ColumnName("PredictedCategory")]
            public string PredictedCategory { get; set; }
        }
    }
}