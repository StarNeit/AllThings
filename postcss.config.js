module.exports = ctx => ({
  map: ctx.env !== 'production' && 'inline',
  plugins: [
    require('postcss-import'),
    require('autoprefixer'),
    ctx.env === 'production' && require('cssnano')({ safe: true }),
  ],
})
