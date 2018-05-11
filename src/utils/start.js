const fs = require('fs')
const path = require('path')
const axios = require('axios')

const data = fs.readFileSync('src/smart/blacklist.js', 'utf-8')
console.log(JSON.stringify(data))

const api = 'http://localhost:8685/v1/admin/transaction'

const params = {
  from: 'n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE',
  to: 'n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE',
  gasLimit: '200000',
  gasPrice: '1000000',
  value: '0',
  contract: {
    source: data,
    sourceType: 'ts',
    args: ''
  },
  nonce: 1
}

axios.post(api, JSON.stringify(params))
  .then(function (response) {
    console.log(response)
  })
  .catch(function (error) {
    console.log(error)
  })
