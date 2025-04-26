build: install
	npm run build

dev: install
	npm start

install:
	npm install

clean:
	rm -rf dist

clean-deps:
	rm -rf node_modules

clean-all: clean clean-deps