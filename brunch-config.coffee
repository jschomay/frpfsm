exports.config =
  # See http://brunch.io/#documentation for docs.
  paths:
    public: './'
    watched: ['src', 'vendor']
  files:
    javascripts:
      joinTo:
        'scripts/game.js': /^src/
        'scripts/vendor.js': /^vendor/
  sourceMaps: false
