console.log(process.env.NODE_ENV)
export const host = process.env.NODE_ENV === 'production' ? 'http://ahorta.herokuapp.com' : ''