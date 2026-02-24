// import { PrismaClient } from '@prisma/client';
// import { aiQuerySchema, aiResponseSchema } from './Aischema'; // your zod schemas

// const prisma = new PrismaClient();

// async function handleAIQuery(input: unknown) {
//   // 1. Validate the input query shape
//   const data = aiQuerySchema.parse(input);
//   const { query, user_id } = data;

//   // 2. Determine report type & date range (basic parsing, improve as needed)
//   let reportType: 'sales' | 'user_activity' | 'inventory' | 'revenue' | undefined;
//   let startDate: string | undefined;
//   let endDate: string | undefined;

//   const lowerQuery = query.toLowerCase();

//   if (lowerQuery.includes('sales')) reportType = 'sales';
//   else if (lowerQuery.includes('user') || lowerQuery.includes('activity')) reportType = 'user_activity';
//   else if (lowerQuery.includes('inventory') || lowerQuery.includes('stock')) reportType = 'inventory';
//   else if (lowerQuery.includes('revenue')) reportType = 'revenue';

//   // Extract dates in YYYY-MM-DD format (first two matches)
//   const dates = query.match(/\d{4}-\d{2}-\d{2}/g);
//   if (dates) {
//     startDate = dates[0];
//     endDate = dates[1] || startDate;
//   }

//   // 3. Query the database according to report type and date filters
//   let message = 'Sorry, no report found for your query.';

//   switch (reportType) {
//     case 'sales': {
//       // Sum total_price of orders with status "Paid" in date range
//       const where: any = { status: 'Paid' };
//       if (startDate) where.created_at = { gte: new Date(startDate) };
//       if (endDate) where.created_at = { ...where.created_at, lte: new Date(endDate) };

//       const salesSum = await prisma.orders.aggregate({
//         _sum: { total_price: true },
//         where,
//       });

//       const totalSales = salesSum._sum.total_price ?? 0;
//       message = `Total sales from ${startDate ?? 'the beginning'} to ${endDate ?? 'now'}: $${totalSales.toFixed(2)}`;
//       break;
//     }
//     case 'user_activity': {
//       // Count unique user_analytics entries in date range
//       const where: any = {};
//       if (startDate) where.created_at = { gte: new Date(startDate) };
//       if (endDate) where.created_at = { ...where.created_at, lte: new Date(endDate) };

//       const activeUsers = await prisma.user_analytics.count({
//         where,
//         distinct: ['user_id'],
//       });

//       message = `Active users${startDate ? ` between ${startDate} and ${endDate ?? startDate}` : ''}: ${activeUsers}`;
//       break;
//     }
//     case 'inventory': {
//       // Count products low in stock (< 10)
//       const lowStockProducts = await prisma.products.count({
//         where: { stock_quantity: { lt: 10 } },
//       });

//       message = `There are ${lowStockProducts} products with low stock (less than 10 units).`;
//       break;
//     }
//     case 'revenue': {
//       // Get latest revenue report month summary
//       const latestRevenue = await prisma.revenue.findFirst({
//         orderBy: { report_month: 'desc' },
//       });

//       if (latestRevenue) {
//         message = `Latest revenue report for ${latestRevenue.report_month.toISOString().slice(0, 7)}: Income = $${latestRevenue.total_income ?? 0}, Expense = $${latestRevenue.total_expense ?? 0}`;
//       } else {
//         message = 'No revenue data available.';
//       }
//       break;
//     }
//   }

//   // 4. Validate the AI response schema
//   const response = aiResponseSchema.parse({
//     report_type: reportType,
//     start_date: startDate,
//     end_date: endDate,
//     message,
//   });

//   return response;
// }











import { PrismaClient } from '@prisma/client';
import { aiQuerySchema, aiResponseSchema } from './Aischema';

const prisma = new PrismaClient();

async function handleAIQuery(input: unknown) {
  // 1. Validate the input query shape
  const data = aiQuerySchema.parse(input);
  const { query } = data;

  // 2. Determine report type & date range (basic parsing, improve as needed)
  let reportType: 'sales' | 'user_activity' | 'inventory' | 'revenue' | undefined;
  let startDate: string | undefined;
  let endDate: string | undefined;

  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('sales')) reportType = 'sales';
  else if (lowerQuery.includes('user') || lowerQuery.includes('activity')) reportType = 'user_activity';
  else if (lowerQuery.includes('inventory') || lowerQuery.includes('stock')) reportType = 'inventory';
  else if (lowerQuery.includes('revenue')) reportType = 'revenue';

  // Extract dates in YYYY-MM-DD format (first two matches)
  const dates = query.match(/\d{4}-\d{2}-\d{2}/g);
  if (dates && dates.length > 0) {
    startDate = dates[0];
    endDate = dates[1] || startDate;
  }

  // 3. Query the database according to report type and date filters
  let message = 'Sorry, no report found for your query.';

  switch (reportType) {
    case 'sales': {
      // Sum total_price of orders with status "Paid" in date range
      const where: any = { status: 'Paid' };
      if (startDate) where.created_at = { gte: new Date(startDate) };
      if (endDate) where.created_at = { ...where.created_at, lte: new Date(endDate) };

      const salesSum = await prisma.orders.aggregate({
        _sum: { total_price: true },
        where,
      });

      const totalSales = salesSum._sum.total_price ?? 0;
      message = `Total sales from ${startDate ?? 'the beginning'} to ${endDate ?? 'now'}: $${totalSales.toFixed(2)}`;
      break;
    }
    // case 'user_activity': {
    //   // Count unique user_analytics entries in date range
    //   const where: any = {};
    //   if (startDate) where.created_at = { gte: new Date(startDate) };
    //   if (endDate) where.created_at = { ...where.created_at, lte: new Date(endDate) };

    //   const activeUsers = await prisma.user_analytics.count({
    //     where,
    //     distinct: ['user_id'],
    //   });

    //   message = `Active users${startDate ? ` between ${startDate} and ${endDate ?? startDate}` : ''}: ${activeUsers}`;
    //   break;
    // }

    case 'user_activity': {
  // Count unique user_analytics entries in date range
  const where: any = {};
  if (startDate) where.created_at = { gte: new Date(startDate) };
  if (endDate) where.created_at = { ...where.created_at, lte: new Date(endDate) };

  const uniqueUsers = await prisma.user_analytics.findMany({
    where,
    distinct: ['user_id'],
    select: { user_id: true },
  });

  const activeUsers = uniqueUsers.length;
  message = `Active users${startDate ? ` between ${startDate} and ${endDate ?? startDate}` : ''}: ${activeUsers}`;
  break;
}
    case 'inventory': {
      // Count products low in stock (< 10)
      const lowStockProducts = await prisma.products.count({
        where: { stock_quantity: { lt: 10 } },
      });

      message = `There are ${lowStockProducts} products with low stock (less than 10 units).`;
      break;
    }
    case 'revenue': {
      // Get latest revenue report month summary
      const latestRevenue = await prisma.revenue.findFirst({
        orderBy: { report_month: 'desc' },
      });

      if (latestRevenue) {
        message = `Latest revenue report for ${latestRevenue.report_month.toISOString().slice(0, 7)}: Income = $${latestRevenue.total_income ?? 0}, Expense = $${latestRevenue.total_expense ?? 0}`;
      } else {
        message = 'No revenue data available.';
      }
      break;
    }
  }

  // 4. Validate the AI response schema
  const response = aiResponseSchema.parse({
    report_type: reportType,
    start_date: startDate,
    end_date: endDate,
    message,
  });

  return response;
}

export { handleAIQuery };















// npm install pdf-parse

// npm install tesseract.js

// npm install fluent-ffmpeg

// npm install node-vosk

// npm install @google-cloud/text-to-speech

// npm install simple-peer

// npm install node-fetch

// npm install ffmpeg-static


// https://www.youtube.com/watch?v=5rsKrTh3fAo&list=PPSV&%20t=248s