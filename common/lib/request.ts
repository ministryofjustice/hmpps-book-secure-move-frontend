import qs from 'qs'

const getQueryString = (target: Record<string, string>, source: Record<string, string>): string => {
  const output = qs.stringify({ ...target, ...source })
  return output ? `?${output}` : ''
}

const getUrl = (page: string, args: Record<string, string> = {}): string => {
  return `${page}${getQueryString(args, {})}`;
}

export { 
  getQueryString, 
  getUrl 
}