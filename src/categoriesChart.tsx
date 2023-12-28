import './categoriesChart.css'
import './salesChart.css'
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ActiveElement,
  ChartEvent,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { useEffect, useState } from 'react';
import { retrieveProductsArray } from './api';
import { RetrieveProduct } from './retrieve-product.dto';
import { CategoryAmount } from './category-data.dto';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface categoryChartDataProps {
  categoryChartData: CategoryAmount[];
  selectedCategory: (category:string) => void;
}

function CategoriesChart({ categoryChartData, selectedCategory }: categoryChartDataProps) {

    const [products, setProducts] = useState<CategoryAmount[]>([]);
    useEffect(()=>{
      setProducts([...categoryChartData]);
    },[categoryChartData]);

    const chartData = {
      labels: products.map((item) => item.category),
      datasets: [{
        data: products.map((item) => item.amount),
      }] 
    }

    const handlePieClick = (event: ChartEvent, elements: ActiveElement[]) => {
      if(elements.length > 0) {
        const clickedSegment = elements[0];
        const segmentLabel = chartData.labels[clickedSegment.index];
        selectedCategory(segmentLabel);
      }
    }

    return <Pie className="categoriesChart" data={chartData} options={{onClick: handlePieClick}}/>

}
export default CategoriesChart;