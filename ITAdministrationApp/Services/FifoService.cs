namespace ITAdministrationApp.Services
{
    public class FifoService
    {
        public Queue<int> FifoQueue { get; set; }

        public FifoService()
        {
            FifoQueue = new Queue<int>();
        }

        public void Enqueue(int item)
        {
            FifoQueue.Enqueue(item);
        }

        public int Dequeue()
        {
            return FifoQueue.Dequeue();
        }

        public List<int> GetAllItems()
        {
            return FifoQueue.ToList();

        }
    }
}
