({
  baseUrl: 'js',
  include: ['libs/almond', 'mines'],
  wrap: false,
  out: 'build/mines.js',
  paths: {
    jquery: 'libs/jquery',
    cs: 'libs/cs',
    'coffee-script': 'libs/coffee-script',
    text: 'libs/text'
  }
})