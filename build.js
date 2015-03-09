({
  appDir: './ahmines',
  baseUrl: './scripts/app',
  name: 'libs/almond',
  include: ['mines'],
  wrap: true,
  out: 'build/mines.js',
  paths: {
    jquery: '../libs/jquery.min'
  },
  removeCombined: true
})