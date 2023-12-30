import './categoriesChart.css'
import './salesChart.css'
import {  Doughnut } from "react-chartjs-2";
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
  ChartOptions,
} from 'chart.js'
import { useEffect, useState } from 'react';
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
  categoryChartColors: string[],
  selectedCategory: (category:string) => void;
}

function CategoriesChart({ categoryChartData, selectedCategory, categoryChartColors }: categoryChartDataProps) {

    const [products, setProducts] = useState<CategoryAmount[]>([]);
    useEffect(()=>{
      setProducts([...categoryChartData]);
    },[categoryChartData]);

    const chartData = {
      labels: products.map((item) => item.category.toUpperCase()),
      datasets: [{
        data: products.map((item) => item.amount),
        backgroundColor: categoryChartColors,
        borderWidth: 0,
      }] 
    }

    const handlePieClick = (event: ChartEvent, elements: ActiveElement[]) => {
      console.log(event);
      if(elements.length > 0) {
        const clickedSegment = elements[0];
        const segmentLabel = chartData.labels[clickedSegment.index];
        selectedCategory(segmentLabel);
      }
    }

    const donutChartOptions: ChartOptions<'doughnut'> = {
      onClick: handlePieClick,
      plugins: {
        legend:{
          position: 'right',
          labels: {
            boxWidth: 2,
            color: 'white',
            font: {
                        size: 8
                    }
          }
        }
      }
    }

    return <Doughnut className="categoriesChart" data={chartData} options={donutChartOptions}/>

}
export default CategoriesChart;