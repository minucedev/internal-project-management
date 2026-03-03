import { z } from "zod";

export const projectFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Tên dự án không được để trống")
      .max(100, "Tên dự án không được quá 100 ký tự"),
    description: z
      .string()
      .max(500, "Mô tả không được quá 500 ký tự")
      .optional()
      .or(z.literal("")),
    startDate: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
    endDate: z.string().min(1, "Ngày kết thúc là bắt buộc"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["endDate"],
  });

export const inviteMemberSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  role: z.enum(['LEADER', 'MEMBER', 'VIEWER']).default('MEMBER'),
  positionTitle: z
    .string()
    .max(100, "Chức vụ không được quá 100 ký tự")
    .optional()
    .or(z.literal("")),
});

