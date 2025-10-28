import { Response } from 'express';

export function setRangeHeaders(res: Response, totalLength: number): void {
  res.setHeader('Content-Range', totalLength);
  res.setHeader('Accept-Ranges', 'bytes');
  res.status(206);
}
