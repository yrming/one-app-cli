const gradient = require('gradient-string');
const figlet = require('figlet');
const chalk = require('chalk');
const superagent = require('superagent');
const termImg = require('term-img');
const ONEURL = 'http://m.wufazhuce.com/one';
const AJAXURL = 'http://m.wufazhuce.com/one/ajaxlist/';

class ONE {

    /**
     * get today info
     *
     * @static
     * @memberof ONE
     */
    static async getTodayInfo () {
        try {
            let one_url_resp = await superagent.get(ONEURL).send();
            let cookie = one_url_resp.header['set-cookie'];
            let token = one_url_resp.text.split("One.token = '")[1].split("'")[0];
            if (token && token.length === 40) {
                let ajax_resp = await superagent.get(`${AJAXURL}0?_token=${token}`).send().set('Cookie', cookie);
                let list = JSON.parse(ajax_resp.text);
                if (list && list.data && list.data.length > 0) {
                    let today = list.data[0];
                    let imgData = await superagent.get(today.img_url).send();
                    if (process.spinner) {
                        process.spinner.stop();
                    }
                    console.log(chalk.green(`\n${chalk.bold(today.date.replace(/\s+/g,""))}(${today.title})\n`));
                    await termImg(imgData.body);
                    console.log(chalk.green(`${today.picture_author}\n`));
                    console.log(chalk.green(`${today.content}(by ${today.text_authors})\n`));
                }
            }
        } catch (error) {
            if (process.spinner) {
                process.spinner.stop();
            }
            console.log(chalk.green('\n' + chalk.bold('Failed to get info') + '\n'));
        }
    }
    
    /**
     * get version
     *
     * @static
     * @returns
     * @memberof ONE
     */
    static version () {
        const banner = gradient.vice(figlet.textSync('ONE', {
            font: 'standard'
        }));
        const gxchainVersion = chalk.cyanBright(`ONE APP CLI Version: ${require('../package').version}`);
        const version = `${banner}\n${gxchainVersion}\n`;
        return version;
    }
}

module.exports = ONE;
