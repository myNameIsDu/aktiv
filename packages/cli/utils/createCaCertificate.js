// eslint-disable-next-line max-classes-per-file
const fs = require('fs');
const os = require('os');
const shelljs = require('shelljs');
const ErrorUtil = require('./shellErrorFactory');

const HOME_DIR = os.homedir();

const errInstance = new ErrorUtil();

class CertFs {
    /**
     * @param {string} domainPath domainPath
     * @param {string} rootDir rootDir
     */
    constructor(domainPath, rootDir) {
        /** @type { string | Buffer } */
        this.WIPDomain = '';
        this.domainPath = domainPath;
        this.rootDir = rootDir;
    }

    /**
     * @desc check if file exist
     * @param {string} [path=this.domainPath] domainPath
     * @returns {boolean} isExists
     */
    checkFileExist(path = this.domainPath) {
        if (!path) {
            errInstance.printIn('FilePath is empty!');
        }

        try {
            const stat = fs.statSync(path);

            return stat.isFile();
        } catch (error) {
            return false;
        }
    }

    /**
     * @desc create domainFile and write domain in file
     * @param {string} domain domain eg: 0.0.0.0 localhost
     * @returns {void}
     */
    createDomain(domain) {
        errInstance.autoCatchErrToPrint(() => {
            if (this.checkFileExist()) {
                this.appendDomain(domain);

                return 0;
            }
            fs.writeFileSync(this.domainPath, domain);
        });
    }

    /**
     * @desc append domain in domain file
     * @param {string} domain domain
     * @returns {void}
     */
    appendDomain(domain) {
        errInstance.autoCatchErrToPrint(() => {
            if (!this.checkExistDomain(domain)) {
                fs.appendFileSync(this.domainPath, `  ${domain}`);
            }
        });
    }

    /**
     * @desc program inside read Domain file
     * @returns {string|Buffer} all domain
     */
    readDomain() {
        errInstance.autoCatchErrToPrint(() => {
            this.WIPDomain = /** @type { string } */ (fs.readFileSync(this.domainPath, 'utf-8'));
        });

        return this.WIPDomain;
    }

    /**
     * @desc check domain had existed in file list
     * @param {string} domain domain
     * @returns {boolean} result
     */
    checkExistDomain(domain) {
        return this.readDomain().indexOf(domain) > -1;
    }

    /**
     * @desc when program meet error，auto delete all file in aktiv cert dir
     * @returns {void}
     */
    deleteAll() {
        errInstance.autoCatchErrToPrint(() => {
            let files = [];

            if (fs.existsSync(this.rootDir)) {
                files = fs.readdirSync(this.rootDir);
                files.forEach(file => {
                    const curPath = `${this.rootDir}/${file}`;

                    fs.unlinkSync(curPath);
                });
                fs.rmdirSync(this.rootDir);
            }
        });
    }
}

class CertEngine {
    static AK_CA_GEN_WIP_DIR = process.cwd();

    static CERT_DIR = '/.akCert/';

    static CA_KEY_FILE_NAME = 'akKey.pem';

    static CA_CERT_FILE_NAME = 'akCert.pem';

    static CA_CERT_DOMAIN_CACHE_LIST_FILE_NAME = 'akCertDomain.json';

    static AK_CA_CERT_ROOT_DIR_PATH = HOME_DIR + CertEngine.CERT_DIR;

    static CA_KEY_FILE_PATH = CertEngine.AK_CA_CERT_ROOT_DIR_PATH + CertEngine.CA_KEY_FILE_NAME;

    static CA_CERT_FILE_PATH = CertEngine.AK_CA_CERT_ROOT_DIR_PATH + CertEngine.CA_CERT_FILE_NAME;

    static CA_DOMAIN_FILE_PATH =
        CertEngine.AK_CA_CERT_ROOT_DIR_PATH + CertEngine.CA_CERT_DOMAIN_CACHE_LIST_FILE_NAME;

    constructor(domain) {
        this.fs = new CertFs(CertEngine.CA_DOMAIN_FILE_PATH, CertEngine.AK_CA_CERT_ROOT_DIR_PATH);
        this.domain = domain ? `${domain} localhost 127.0.0.1 ::1` : 'localhost 127.0.0.1 ::1';
    }

    mkdirCertHomeDir() {
        if (!fs.existsSync(CertEngine.AK_CA_CERT_ROOT_DIR_PATH)) {
            fs.mkdirSync(CertEngine.AK_CA_CERT_ROOT_DIR_PATH);
        }
    }

    checkHasMKCert() {
        const has = shelljs.which('mkcert');

        if (!has) {
            errInstance.printIn(`
                Need install mkcert \n Installation Guide: https://github.com/FiloSottile/mkcert
            `);
            process.exit(1);
        }
    }

    createLocalCA() {
        const shellRes = shelljs.exec('mkcert -install');

        errInstance.checkErrorToPrint(shellRes, 'Created a new local CA Fail💥\n');
    }

    /**
     * @desc create ca config
     * @returns {{cert: string, key: string}} ca config for webpack5 https
     */
    createCertificate() {
        this.mkdirCertHomeDir();
        this.checkHasMKCert();
        this.createLocalCA();
        this.fs.createDomain(this.domain);

        const isExisted = this.fs.checkExistDomain(this.domain);

        const hasCA =
            this.fs.checkFileExist(CertEngine.CA_KEY_FILE_PATH) &&
            this.fs.checkFileExist(CertEngine.CA_CERT_FILE_PATH);

        if (!isExisted || !hasCA) {
            const currentDomainList = this.fs.readDomain();

            const shellRes = shelljs.exec(
                // eslint-disable-next-line max-len
                `mkcert -key-file ${CertEngine.CA_KEY_FILE_PATH} -cert-file ${CertEngine.CA_CERT_FILE_PATH} ${currentDomainList}`,
            );

            errInstance.checkErrorToPrint(shellRes, 'Created a new certificate Fail 📜\n', () => {
                this.fs.deleteAll();
            });
        }

        return {
            cert: CertEngine.CA_CERT_FILE_PATH,
            key: CertEngine.CA_KEY_FILE_PATH,
        };
    }
}

module.exports = CertEngine;
