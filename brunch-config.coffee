exports.config =
  # See http://brunch.io/#documentation for docs.
  paths:
    public: './'
    watched: ['src', 'example', 'vendor']
  files:
    javascripts:
      joinTo:
        'scripts/game.js': /^(src|example)/
        'scripts/vendor.js': /^vendor/
  sourceMaps: false
