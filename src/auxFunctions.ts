import { MonthlySale } from "./retrieve-product.dto";

function generateRandomNumber() {
  return Math.floor(Math.random() * 101); // Math.random() generates a number in [0, 1), and Math.floor rounds down to the nearest integer
}

export function generateSalesData(): MonthlySale[] {
    let monthlySalesData: MonthlySale[] = [];
    for(let i=1;i<13;i++){
        monthlySalesData.push({year:2023,month:i,sales:generateRandomNumber()});
    }
    return monthlySalesData;
}