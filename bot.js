const axios = require('axios');
const AWS = require('aws-sdk');
const uuid = require('uuid');

const createEC2 = () => {
    const instance = new AWS.EC2({apiVersion: '2016-11-15'});

    const keyName = `ec2-${uuid.v4()}`;
    const instanceName = `instance-${uuid.v4()}`
    const subnetId = 'subnet-24c3b268';

    const keyParams = {
        KeyName: keyName
    };
    
    log.debug(`Creating Key-Pair '${keyName}'`);
    instance.createKeyPair(keyParams, (err, data) => {
        if (err) { log.error(`Key-Pair Creation Error: \n${err}`);
        } else { log.debug(`Successfully created Key-Pair '${keyName}': ${JSON.stringify(data)}`); }
    });

    const params = {
        ImageId: amiid,
        InstanceType: 't2.micro',
        KeyName: keyName,
        MinCount: 1,
        MaxCount: 1,
        SubnetId: subnetId,
        TagSpecifications: [
            {
                ResourceType: "instance",
                Tags: [
                    {
                        Key: "Name",
                        Value: instanceName
                    }
                ]
            }
        ]
    };

    instance.runInstances(params, (err, data) => {
        if (err) { log.error(`Instance Run Erro: \n${err}`);
        } else { log.debug(`Successfully create Key-Pair`); }
    });

    return instance;
}

const opts = {
    errorEventName:'error',
        logDirectory:'./logs', // NOTE: folder must exist and be writable...
        fileNamePattern:'roll-<DATE>.log',
        dateFormat:'YYYY.MM.DD'
};

const log = require('simple-node-logger').createRollingFileLogger(opts);
log.setLevel('debug');

log.info('Simple Logger started');
log.debug('Logging with following options:');
log.debug(opts);

log.debug('Loading AWS Credentials');
AWS.config.loadFromPath('./config/aws.json');
log.info(`Successfully loaded AWS credentials for region: '${AWS.config.region}'`);

const ec2 = createEC2();