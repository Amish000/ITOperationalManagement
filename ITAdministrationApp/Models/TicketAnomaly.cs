using Microsoft.ML.Data;

namespace ITAdministrationApp.Models
{
    public class TicketAnomaly
    {
        public class TicketDescription
        {
            public string Description { get; set; }
        }

        public class TicketCluster
        {
            [ColumnName("PredictedLabel")]
            public uint ClusterId { get; set; }

            public float[] Features { get; set; }
        }

    }
}
