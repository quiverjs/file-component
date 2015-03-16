BABEL_FLAGS=--blacklist=es6.blockScoping,es6.constants,es6.forOf,regenerator 

build: src
	babel src --out-dir out $(BABEL_FLAGS)

unit-test: build
	mocha out/test

server: build
	node out/test-server/server.js

.PHONY: build build-lib build-test test