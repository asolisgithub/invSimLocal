export const SalesChartSampleData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Sales Data',
      data: [65, 59, 80, 81, 56, 55, 40],
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(75,192,192,1)',
      pointRadius: 5,
      fill: false,
    },
  ],
};
export const CategoriesChartSampleData = {
  labels: ['Category 1', 'Category 2', 'Category 3'],
  datasets: [{
    data: [30, 50, 20],
    backgroundColor: ['red', 'blue', 'green'],
  }],
};