import type { Response } from "express";

type ResponseType = {
  res: Response,
  data: any,
  statusCode: number
}
export default function Response({res, data, statusCode}: ResponseType){
  return res.status(statusCode).json({
    data: data,
    statusCode: statusCode
  })
}
