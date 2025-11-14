"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";   
import React, { useMemo } from "react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Org {
  _id: string;
  name: string;
  createdAt: string;
}

export default function OrganizationTimelineChart({ organizations }: { organizations: Org[] }) {

  // ⭐ Count organizations per month
  const monthlyCounts = useMemo(() => {
    const counts = Array(12).fill(0);

    organizations.forEach((org) => {
      const month = new Date(org.createdAt).getMonth(); 
      counts[month] += 1;
    });

    return counts;
  }, [organizations]);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: { text: undefined },
    },
    grid: {
      yaxis: { lines: { show: true } },
    },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: true },
      y: { formatter: (val: number) => `${val} organizations` },
    },
  };

  const series = [
    {
      name: "Organizations Created",
      data: monthlyCounts,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 h-[99.5%]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Organizations Timeline
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar h-[97%]">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2 h-[97%]">
          <ReactApexChart 
            options={options}
            series={series}
            type="bar"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
}
