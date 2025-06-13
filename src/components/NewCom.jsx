import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  LabelList,
  LineChart,
  Line,
  Scatter
} from "recharts";

const TicketMetrics = () => {
    const data = [
      { site: "Sai Radhe", responseLast: 35, responseCurrent: 45, resolutionLast: 75, resolutionCurrent: 65 },
      { site: "Baani-The Statement", responseLast: 41, responseCurrent: 35, resolutionLast: 30, resolutionCurrent: 35 },
      { site: "AeroMall", responseLast: 65, responseCurrent: 70, resolutionLast: 45, resolutionCurrent: 35 },
      { site: "Max House", responseLast: 45, responseCurrent: 50, resolutionLast: 30, resolutionCurrent: 35 },
      { site: "Nandan Probiz", responseLast: 65, responseCurrent: 65, resolutionLast: 45, resolutionCurrent: 40 },
      { site: "Peninsula Corporate Park", responseLast: 40, responseCurrent: 55, resolutionLast: 40, resolutionCurrent: 45 },
      { site: "Raheja Mindspace", responseLast: 40, responseCurrent: 35, resolutionLast: 35, resolutionCurrent: 40 },
      { site: "Koncord Tower", responseLast: 15, responseCurrent: 10, resolutionLast: 65, resolutionCurrent: 60 },
      { site: "Technopolis, Salt Lake", responseLast: 5, responseCurrent: 10, resolutionLast: 70, resolutionCurrent: 65 },
      { site: "Baani-The Statement (2)", responseLast: 0, responseCurrent: 10, resolutionLast: 65, resolutionCurrent: 60 },
    ];

      const scatterDataLast = data.map(item => ({ site: item.site, value: item.resolutionLast }));
      const scatterDataCurrent = data.map(item => ({ site: item.site, value: item.resolutionCurrent }));

    return (
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Response TAT Performance by Center – Quarterly Comparison</h1>

      {/* Legend */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center mr-4">
          <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
          <span>Response Achieved: Last Quarter</span>
        </div>
        <div className="flex items-center mr-4">
          <div className="w-4 h-4 bg-[#8B4513] rounded-full mr-2"></div>
          <span>Response Achieved: Current Quarter</span>
        </div>
        <div className="flex items-center mr-4">
          <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
          <span>Resolution Achieved: Last Quarter</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#8B4513] rounded-full mr-2"></div>
          <span>Resolution Achieved: Current Quarter</span>
        </div>
      </div>

      {/* Response Achieved Bar Chart */}
      <h2 className="text-xl font-semibold text-center mb-4">Response Achieved (TAT in Percentage)</h2>
      <div className="w-full h-96 mb-8">
        <BarChart
          width={800}
          height={350}
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, 100]}
            label={{ value: "TAT in Percentage", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            type="category"
            dataKey="site"
            tick={{ fontSize: 12 }}
            width={140}
          />
          <Tooltip />
          <Legend verticalAlign="top" align="right" />
          <Bar dataKey="responseLast" fill="#D3D3D3" name="Last Quarter" />
          <Bar dataKey="responseCurrent" fill="#8B4513" name="Current Quarter" />
        </BarChart>
      </div>

      {/* Resolution Achieved Bar Chart with Dots */}
      <h2 className="text-xl font-semibold text-center mb-4">Resolution Achieved (TAT in Percentage)</h2>
      <div className="w-full h-96">
        <BarChart
          width={800}
          height={350}
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, 100]}
            label={{ value: "TAT in Percentage", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            type="category"
            dataKey="site"
            tick={{ fontSize: 12 }}
            width={140}
          />
          <Tooltip />
          <Legend verticalAlign="top" align="right" />
          <Bar dataKey="resolutionLast" fill="#D3D3D3" name="Last Quarter" />
          <Bar dataKey="resolutionCurrent" fill="#8B4513" name="Current Quarter" />
          <Scatter data={scatterDataLast} fill="#000000" name="Last Quarter (Dots)" shape="circle" />
          <Scatter data={scatterDataCurrent} fill="#FF0000" name="Current Quarter (Dots)" shape="circle" />
        </BarChart>
      </div>

      {/* Note */}
      <p className="text-sm text-gray-500 mt-4">
        <strong>Note:</strong> The bar graph represents the response TAT achieved in the current and previous quarter, while the line graph indicates the resolution TAT achieved over the same period. This visual helps track and compare the ticket response and resolution performance between the current and last quarter.
      </p>
    </div>
    );
  };

  export default TicketMetrics;
