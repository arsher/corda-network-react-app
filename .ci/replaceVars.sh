cat $1 | \
sed "s/{dockerRegistry}/$DOCKER_REGISTRY_ADDRESS/" | \
sed "s~{dockerImageName}~$DOCKER_IMAGE_NAME~" | \
sed "s/{dockerImageTag}/$DOCKER_REGISTRY_TARGETTAG/" | \

#used ~ for dockerImageTag as a separator because the name might contain /
# namespace: testnet
# serviceName: r3web-testnet
# envName: dev|staging|prod
# hostName: onboarder.prodpreview.r3tests.com
# dockerRegistry: r3webdev.azurecr.io
# dockerImageName: "r3web/testnet"
# dockerImageTag: dev
# baseDomain: staging.r3tests.com|prodpreview.r3tests.com
