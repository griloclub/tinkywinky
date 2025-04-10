import { parse } from 'date-fns';

export function parseMatchLogDate(dateString: string) {
  return parse(dateString, 'dd/MM/yyyy HH:mm:ss', new Date());
}
