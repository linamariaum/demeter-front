import React, { useEffect, useLayoutEffect } from 'react';
import { useDashboard } from '../Context/Dashboard.context';
import { useUser } from '../Context/User.context.jsx';
import { useProduct } from '../Context/Product.context.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user, getUsers, toggleUserStatus, deleteUser } = useUser();
  const { product, getProducts, toggleSupplyStatus, getCurrentProduct } = useProduct();
  const { salesChart, fetchSales, fetchSalesusers, salesuserChart, fetchBP, besProd , shopsChart, fetchShops,
    fetchsupli,
    supli } = useDashboard();

  useLayoutEffect(() => {
    getUsers();
    getProducts();
    fetchSales();
    fetchSalesusers();
    fetchBP();
    fetchShops();
    fetchsupli();
  }, []);

  // Utiliza los datos de salesChart para el gráfico
  const chartData = salesChart.map((item) => ({
    name: item.saleDate,
    totalSales: item.totalSales,
    totalAmount: parseFloat(item.totalAmount), // Convierte la cantidad a número
  }));

  const shopchartData = shopsChart.map((item) => ({
    name: item.shoppingDate,
    totalSales: item.totalShopping,
    totalAmount: parseFloat(item.totalAmount), // Convierte la cantidad a número
  }));

  // Utiliza los datos de salesuserChart para la gráfica de dona
  const pieData = salesuserChart.map((item) => ({
    name: item.userName,
    value: parseFloat(item.totalAmount),
  }));

  const COLORS = ['#ff6600', '#6610f2', '#FFBB28', '#FF8042']; // Puedes cambiar los colores según tus preferencias

  return (
    <div className="all">
      <h2 className='text-3xl font-bold mb-4 text-center'>Dashboard</h2>
      <h2 className='text-3xl font-bold mt-[7vh] mb-4 text-center'>Ventas</h2>
      <div className='flex flex-row items-center justify-center ml-[28vh]'>
        <div className='flex flex-col mx-[5vh]'>
          <h2 className='text-3xl font-bold mb-[10vh] text-center'>Ventas Por Día</h2>
          <LineChart width={600} height={300} data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey='name' />
            <YAxis />
            <CartesianGrid strokeDasharray='3 3' />
            <Tooltip />
            <Legend />
            <Line type='monotone' dataKey='totalSales' stroke='#00000' name='Ventas' />
            <Line type='monotone' dataKey='totalAmount' stroke='#ff6600' activeDot={{ r: 8 }} name='Monto Total' />
          </LineChart>
        </div>
        <div className='flex flex-col'>
          <h2 className='text-3xl font-bold mt-[3vh] mb-[10vh] text-center'>Ventas/Meseros</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx={200}
              cy={200}
              outerRadius={80}
              fill='#8884d8'
              dataKey='value'
              label={(entry) => entry.name}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <div className='flex flex-col mx-[5vh]'>
          <h2 className='text-2xl font-bold mt-4 mb-2 whitespace-normal text-center'>El Producto más vendido fue: {besProd.ProductName}</h2>
          <h2 className='text-2xl font-bold mb-4 whitespace-normal text-center'>Cantidad de Ventas: {besProd.detailCount}</h2>
        </div>
      </div>
      <div className="border-b-2 border-gray-300 my-6"></div>
      <h2 className='text-3xl font-bold mt-4 mb-4 text-center'>Compras</h2>
      <div className='flex flex-row items-center justify-center ml-[28vh]'>
        <div className='flex flex-col mx-[5vh]'>
          <h2 className='text-3xl font-bold mb-[10vh] text-center'>Compras Por Día</h2>
          <LineChart width={600} height={300} data={shopchartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey='name' />
            <YAxis />
            <CartesianGrid strokeDasharray='3 3' />
            <Tooltip />
            <Legend />
            <Line type='monotone' dataKey='totalSales' stroke='#00000' name='Compras' />
            <Line type='monotone' dataKey='totalAmount' stroke='#ff6600' activeDot={{ r: 8 }} name='Monto Total' />
          </LineChart>
        </div>
        <div className='flex flex-col mx-[5vh]'>
        <h2 className='text-2xl font-bold mt-4 mb-2 whitespace-normal text-center'>
  {supli ? (
    `El Insumo al que más se le invirtió fue: ${supli.userName}`
  ) : (
    'No hay datos disponibles'
  )}
</h2>
<h2 className='text-2xl font-bold mb-4 whitespace-normal text-center'>
  Dinero Invertido: {supli ? supli.totalSpent ?? "nada por ahora" : "No hay datos disponibles"}
</h2>
        </div>
    </div></div>
  );
};

export default Dashboard;