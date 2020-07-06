compile:
	npx truffle compile
	cp ./node_modules/@uniswap/v2-core/build/* ./build/contracts
	cp ./node_modules/@uniswap/v2-periphery/build/* ./build/contracts
	rm ./build/contracts/Migrations.json
	rm ./build/contracts/Combined-Json.json
	npx truffle compile
	npx typechain --target truffle './build/**/*.json'