exports.config =
  # See http://brunch.io/#documentation for docs.
  paths:
    public: './'
    watched: ['src', 'example']
  files:
    javascripts:
      joinTo:
        'example.js': /^example/
        'lib/frpfsm.js': /^src/
  sourceMaps: false
