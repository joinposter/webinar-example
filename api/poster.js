var request = require('request');
var md5 = require('md5');
var querystring = require('querystring');
var config = require('../config');


class PosterApi {
    /**
     *
     * @param props {{ token: String, account: String }}
     */
    constructor(props) {
        this.token = props.token;
        this.account = props.account;
    }

    /**
     * Метод делает запрос к API Poster при помощи токена и аккаунта
     * @param method {String} poster API method name
     * @param type {String} GET or POST
     * @param params {Object} GET or POST params to method
     * @return {Promise<*>}
     */
    makePosterRequest(method, type = 'GET', params = {}) {
        let options = {
            method: type.toUpperCase(),
            url: `https://joinposter.com/api/${method}?token=${this.token}&`,
        };

        if (options.method === 'GET') {
            options.url += querystring.encode(params.body);
        } else {
            options.json = params.body;
        }

        return new Promise((resolve, reject) => {
            request(options, (err, response, body) => {
                if (err) {
                    reject(err);
                }

                if (typeof body === 'string') {
                    body = JSON.parse(body);
                }
                // В большинстве методов API Poster ответ приходит в объекте response
                if (body && body.response) {
                    body = body.response;
                }
                resolve(body);
            });
        });
    }
}


module.exports = PosterApi;
