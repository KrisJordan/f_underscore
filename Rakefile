require 'rubygems'
require 'closure-compiler'

HEADER = /((^\s*\/\/.*\n)+)/

desc "Use the Closure Compiler to compress f_underscore.js"
task :build do
    source  = File.read('f_underscore.js')
    header  = source.match(HEADER)
    min     = Closure::Compiler.new.compress(source)
    File.open('f_underscore-min.js', 'w') do |file|
        file.write header[1].squeeze(' ') + min
    end
end

desc "Build the docco documentation"
task :doc do
      sh "docco f_underscore.js"
end
