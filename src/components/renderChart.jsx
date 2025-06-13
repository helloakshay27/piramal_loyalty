import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const ResponseAchieved = [
  { site: "Sai Radhe", responseLast: 35, responseCurrent: 45 },
  { site: "Baani-The Statement", responseLast: 41, responseCurrent: 35 },
  { site: "AeroMall", responseLast: 65, responseCurrent: 70 },
  { site: "Max House", responseLast: 45, responseCurrent: 50 },
  { site: "Nandan Probiz", responseLast: 65, responseCurrent: 65 },
  { site: "Peninsula Corporate Park", responseLast: 40, responseCurrent: 55 },
  { site: "Raheja Mindspace", responseLast: 40, responseCurrent: 35 },
  { site: "Koncord Tower", responseLast: 15, responseCurrent: 10 },
  { site: "Technopolis, Salt Lake", responseLast: 5, responseCurrent: 10 },
  { site: "Baani-The Statement (2)", responseLast: 5, responseCurrent: 10 },
];
export const renderChart = (width) => (

  <BarChart
    width={width}
    height={700}
    data={ResponseAchieved}
    layout="vertical"
    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
  >
    <defs>
      <pattern
        id="stripedPattern"
        patternUnits="userSpaceOnUse"
        width="6"
        height="6"
        patternTransform="rotate(45)"
      >
        <line x1="0" y="0" x2="0" y2="6" stroke="#C4B89D" strokeWidth="2" />
      </pattern>
    </defs>

    <CartesianGrid strokeDasharray="3 3" />
    <XAxis
      type="number"
      domain={[0, 100]}
      ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
      tickFormatter={(tick) => `${tick}%`}
      orientation="top"
      tick={{ fontSize: 12 }}
      axisLine={{ stroke: '#000' }}
      tickLine={{ stroke: '#000' }}
    />
    <YAxis
      type="category"
      dataKey="site"
      tick={{ fontSize: 12 }}
      width={140}
    />
    <Tooltip />
    <Legend verticalAlign="top" align="right" />
    <Bar dataKey="responseLast" fill="url(#stripedPattern)" name="Last Quarter" />
    <Bar dataKey="responseCurrent" fill="#C4AE9D" name="Current Quarter" />
  </BarChart>
);
