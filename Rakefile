require 'rubygems'
require 'closure-compiler'

HEADER = /((^\s*\/\/.*\n)+)/

desc "Use the Closure Compiler to compress f_underscore.js"
task :build do
    # Min standalone
    source  = File.read('f_underscore.js')
    header  = source.match(HEADER)
    min     = Closure::Compiler.new.compress(source)
    File.open('f_underscore-min.js', 'w') do |file|
        file.write header[1].squeeze(' ') + min
    end

    # Min bundle
    _source = File.read('test/vendor/underscore.js') 
    f_source = File.read('f_underscore.js')
    _header = _source.match(HEADER)
    f_header = f_source.match(HEADER)
    min = Closure::Compiler.new.compress(_source + f_source)
    File.open('f_underscore-bundle-min.js', 'w') do |file|
        file.write _header[1].squeeze(' ') + f_header[1].squeeze(' ') + min
    end
end

desc "Bundle underscore.js and f_underscore.js"
task :buildAll do
end

desc "Build the docco documentation"
task :doc do
      sh "docco f_underscore.js"
end
