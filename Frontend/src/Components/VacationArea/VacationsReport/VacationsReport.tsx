import { useEffect, useState } from "react";
import "./VacationsReport.css";
import { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface VacationData {
    destination: string;
    likesCount: number;
  }

export function VacationsReport(): JSX.Element {

    const [vacations, setVacations] = useState<VacationModel[]>([]);

        useEffect(() => {
            vacationService.getAllVacations()
                .then(vacations => setVacations(vacations))
                .catch(err => notify.error(err));
        }, []);

        const chartData: VacationData[] = vacations.map(v => ({
            destination: v.destination,
            likesCount: v.likesCount,
          }));

          const handleDownload = () => {
            const csvData = chartData.map(item => `"${item.destination}","${item.likesCount}"`).join('\n');
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'vacation_data.csv';
            link.click();
          };

          return (
            <div className="VacationsReport">
              <BarChart width={1500} height={500} data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="destination" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="likesCount" fill=" #00334d" />
              </BarChart>
              <button onClick={handleDownload}>Download Data</button>
            </div>
          );
}
