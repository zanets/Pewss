const BaseDir = __dirname;

module.exports = class Utils{
    static trimExtension(filename){
		['.java', '.class'].forEach((extension) => {
			const pos = filename.indexOf(extension);
			filename = (pos === -1) ? filename : filename.slice(0, pos);
		});
		return filename;
	}

	static ignoreFiles(files){
		['.DS_Store'].forEach((ignore) => {
			files = files.filter((file) => {
				ignore === file.name
			});
		});
		return files;
	}

    static getSimLibrary(){

    }

    static getSimArgument(client){
        let argvs = '';
        Object.keys(client).forEach((key) => {
            const argv = client[key];

            argvs += `${key}=`;

            if(argv.constructor === Array)
                for(const v of argv)
                    argvs += `${v},`;
            else
                argvs += argv;

            argvs += '\r\n';
        });
    }
}
