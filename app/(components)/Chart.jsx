"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,

} from "@/components/ui/chart";


const attendanceData = [  
  { month: '1', present: 28, absent: 2 },
  { month: '2', present: 30, absent: 0 },
  { month: '3', present: 27, absent: 3 },
  { month: '4', present: 29, absent: 1 },
  { month: '5', present: 26, absent: 4 },
  { month: '6', present: 30, absent: 0 },
 
];


const chartConfig = {
  present: {
    label: "present",
    color: "#1e2939",
  },
  absent: {
    label: "absent",
    color: "#1e2939",
  },
};

export function Chart() {
  return (
   <div className="w-[700px] h-[420px] bg-white shadow-md rounded-2xl p-6">
    
        <ChartContainer config={chartConfig}>
          <BarChart  data={attendanceData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
             
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
             <ChartLegend content={<ChartLegendContent   />} className="text-black" />
            <Bar dataKey="present" fill="#212529" radius={4} />
            <Bar dataKey="absent" fill="#495057" radius={4} />
          </BarChart>
        </ChartContainer>
   
     
  </div>
  );
}


