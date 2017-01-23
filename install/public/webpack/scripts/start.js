import webpack from 'webpack';
import webpackConfig from '../webpack.config.babel';

// process.argv.push('--watch');

function start() {
	return new Promise((resolve, reject) => {
		webpack(webpackConfig).run((err, stats) => {
			if (err) {
				return reject(err);
			}

			console.log(stats.toString(webpackConfig.stats));
			return resolve();
		});
	});
}

export default start;
