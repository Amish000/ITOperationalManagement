using System.Collections.Generic;
using System.Linq;

namespace ITAdministrationApp.Services
{
    public class QuickSortService
    {
        public List<int> QuickSort(List<int> list)
        {
            if (list.Count <= 1)
                return list;

            int pivotIndex = list.Count / 2;
            int pivotValue = list[pivotIndex];
            list.RemoveAt(pivotIndex);

            List<int> less = new List<int>();
            List<int> greater = new List<int>();

            foreach (int item in list)
            {
                if (item < pivotValue)
                    less.Add(item);
                else
                    greater.Add(item);
            }

            List<int> sorted = QuickSort(less);
            sorted.Add(pivotValue);
            sorted.AddRange(QuickSort(greater));

            return sorted;
        }
    }
}
