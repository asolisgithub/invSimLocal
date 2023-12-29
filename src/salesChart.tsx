import './salesChart.css'
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { MonthlySale } from './retrieve-product.dto';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

interface salesChartDataProps {
  salesChartData: MonthlySale[];
}

function SalesChart({ salesChartData }: salesChartDataProps) {
    console.log( salesChartData );
    
    const SalesChartProductData = {
        labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL','AUG','SEP','OCT','NOV','DEC'],
        datasets: [
            {
            label: 'Sales Data',
            data: salesChartData.map((item) => item.sales),
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(75,192,192,1)',
            pointRadius: 5,
            fill: false,
            },
        ],
        };

    return <Line className="salesChart" data={SalesChartProductData} />

}
export default SalesChart;