// import {z} from "zod"
// import { orderItemSchema } from "./orderitem";
// import {financialSchema} from "./finacial";
// import {paymentSchema} from "./payment";
// export const orderStatusEnum = z.enum([
//     "Pending",
//     "Processing",
//     "Shipped",
//     "Delivered",
//     "Cancelled"
//   ]);
  
//   export const orderSchema = z.object({
 
//     user_id: z.number().nullable().optional(),
//     total_price: z.number().positive("Total price must be positive"),
//     status: orderStatusEnum.default("Pending"),
//     created_at: z.date().optional(),
//     browser_used: z.string().optional(),
//     updated_at: z.date().optional(),
//     order_items: z.array(orderItemSchema).optional(),
//     financials: z.array( financialSchema).optional(), // Assuming financialSchema is defined in financial.ts
//     payments: z.array(paymentSchema).optional(), // Assuming paymentSchema is defined in payment.ts
//   });
  
  



import { z } from "zod";
import { orderItemSchema } from "./orderitem";
import { financialSchema } from "./finacial";
import { paymentSchema } from "./payment";

export const orderSchema = z.object({
  user_id: z.number().nullable().optional(),
  total_price: z.number().positive("Total price must be positive"),
  status: z.string().default("Pending"), // Replaced with a plain string type
  // created_at: z.coerce.date(),
 created_at: z.coerce.date().optional(),
  browser_used: z.string().optional(),
  updated_at: z.coerce.date().optional(),
  order_items: z.array(orderItemSchema).optional(),
  financials: z.array(financialSchema).optional(),
  payments: z.array(paymentSchema).optional(),
});






